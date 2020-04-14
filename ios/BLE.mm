#include <stdio.h>
#include <sys/time.h>

#include <Foundation/Foundation.h>
#include <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTConvert.h>

#include "util.h"
#include "proto.h"
#include "query-engine.h"
#include "contact.h"
#import "BLE.h"


/*
 BIG TODO LIST:
 
 Implement:
  new ID generation protocol (done)
  token and contact logging (done)
  connection timeout using a timer (done-ish)
  add define based heavy debugging (done)
  handle RSSI (done, send it with package and discard bad data).

  handle restore events
  add delay to write from read
  add networking retries for read/write
 */

//set this to enable high volume logging disable for release!
static bool DebugLogEnabled = false;
//set this to make the protocol to act in non-conforming, but extremely fast. good for developing.
static bool UseFastDevValues = false;

//we let up to this many times of leeway for the timer subsystem to delay execution
#define TIMER_LEEWAY 5

//global config options

static int64_t contact_log_interval_in_secs; //active contact logging
static int64_t local_id_write_interval_in_secs; //send my id to remote devices / passive logging
static int64_t remote_id_read_interval_in_secs; //read remote id
static int64_t device_cache_ttl_in_secs; //drop local cache on remote device
static int64_t crypto_id_update_schedule_in_secs;
static int64_t key_rotation_window_in_secs;

static int64_t conn_start_timeout_in_seconds = 5;
static NSString *_serviceUUID;
static NSString *_characteristicUUID;


static int sanitize_rssi(int rssi)
{
  if(rssi == INT_MIN)
    rssi = 0;
  //only values between -255 and -1 are valid, round up below -255 and down to zero.
  //zero is a special value meaning invalid
  return MIN(MAX(rssi, -255), 0);
}

static int64_t get_now_secs(void)
{
  struct timeval tv = {0};
  if(gettimeofday(&tv, NULL))
    NSLog(@"gettimeofday failed with %d", errno);

  return ((int64_t)tv.tv_sec);
}

static dispatch_source_t create_recurring_timer(int64_t interval_sec, void (^block)(void))
{
  dispatch_source_t timer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, dispatch_get_main_queue());
  if(timer)
  {
    dispatch_source_set_timer(timer,
                              dispatch_walltime(NULL, 0),
                              interval_sec * NSEC_PER_SEC,
                              interval_sec * NSEC_PER_SEC * TIMER_LEEWAY);

    dispatch_source_set_event_handler(timer, block);
    dispatch_resume(timer);
  }
  return timer;
}

static dispatch_source_t create_one_shot_timer(int64_t delay_in_secs, void (^block)(void))
{
  dispatch_source_t timer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, dispatch_get_main_queue());
  if(timer)
  {
    dispatch_source_set_timer(timer,
                              dispatch_walltime(NULL, delay_in_secs * NSEC_PER_SEC),
                              1 * NSEC_PER_SEC,
                              1 * NSEC_PER_SEC * TIMER_LEEWAY);

    __weak dispatch_source_t w_timer = timer;
      dispatch_source_set_event_handler(timer, ^{
      block();
      dispatch_source_t tmp = w_timer;
      if(tmp)
        dispatch_source_cancel(w_timer);
    });
    dispatch_resume(timer);
  }
  return timer;
}

typedef enum {
  OpIgnore,
  OpRequested,
  OpInProgress,
  OpDone
} OpStage;

@interface PeripheralContactHelper: NSObject<CBPeripheralDelegate>

-(instancetype)initWithPeripheral: (CBPeripheral*)peripheral logger: (id<BleProtocol>)logger;


//methods called by CBCentralManagerDelegate
-(void)didConnect;
-(void)didFailToConnect: (NSError*)error;
-(void)didScan:(NSDictionary<NSString *,id> *)data rssi:(int)rssi;
@end

#define OPS_COUNT 2
#define OP_READ 0
#define OP_WRITE 1


@implementation PeripheralContactHelper {
  CBPeripheral *_peripheral;
  __weak id<BleProtocol> _ble;
  
  int64_t _creation_time;

  dispatch_source_t _read_timer;
  dispatch_source_t _write_timer;
  dispatch_source_t _cache_flush_timer;
  dispatch_source_t _timeout_timer;

  OpStage _ops[OPS_COUNT];
  bool _connectionInProgress;
  CBCharacteristic *_contact_characteristic;

  int64_t _lastContactFlush;
  int _rssi, _prevRssi;

  NSMutableData *_current_device_data;
  bool _device_id_valid;
}

-(instancetype)initWithPeripheral: (CBPeripheral*)peripheral logger: (id<BleProtocol>)ble
{
  _peripheral = peripheral;
  _ble = ble;
  //we set _lastContactFlush to force at least one tick before logging
  _creation_time = _lastContactFlush = get_now_secs();
  _rssi = INT_MIN;
  _prevRssi = 0;
  _current_device_data = [[NSMutableData alloc] initWithLength:PROTO_ID_SIZE];
  _device_id_valid = false;

  _peripheral.delegate = self;
  [self cancelConnection];

  //fresh new device, let's schedule IO
  __weak PeripheralContactHelper *w_self = self;

  _read_timer = create_recurring_timer(remote_id_read_interval_in_secs, ^ {
    [w_self queueRead];
  });

  _write_timer = create_recurring_timer(local_id_write_interval_in_secs, ^ {
    [w_self queueWrite];
  });

  _cache_flush_timer = create_one_shot_timer(device_cache_ttl_in_secs, ^{
    [w_self cache_timeout];
  });
  
  [_ble logDebug:[NSString stringWithFormat:@"new PCH for device %@", peripheral.identifier]];
  return self;
}

-(void)queueRead {
  [_ble logDebug:[NSString stringWithFormat:@"queue read for %@", _peripheral.identifier]];
  //only start if there isn't one in progress
  if(_ops[OP_READ] == OpIgnore)
    _ops[OP_READ] = OpRequested;
  [self beingConnectIfNeeded];
}

-(void)queueWrite {
  [_ble logDebug:[NSString stringWithFormat:@"queue write for %@", _peripheral.identifier]];
  if(_ops[OP_WRITE] == OpIgnore)
    _ops[OP_WRITE] = OpRequested;
  [self beingConnectIfNeeded];
}

-(void)cache_timeout {
  [_ble logDebug:[NSString stringWithFormat:@"cache timeout for %@", _peripheral.identifier]];
  dispatch_source_cancel(_read_timer);
  dispatch_source_cancel(_write_timer);
  [self cancelConnection];
  [_ble flushCache: _peripheral];
}

-(void)beingConnectIfNeeded {
  if(_connectionInProgress)
    return;
  switch(_peripheral.state)
  {
    case CBPeripheralStateConnected:
    case CBPeripheralStateConnecting:
      break;
    default: {
      [_ble.cbc connectPeripheral:_peripheral options:nil];

      __weak PeripheralContactHelper *w_self = self;
      _timeout_timer = create_one_shot_timer(conn_start_timeout_in_seconds, ^{
        [w_self checkForTimeout];
      });
      _connectionInProgress = true;

      break;
    }
  }
}

-(void) checkForTimeout {
  [_ble logDebug:[NSString stringWithFormat:@"connection timeout for %@", _peripheral.identifier]];
  [self cancelConnection];
}

-(void) cancelConnection {
  [_ble.cbc cancelPeripheralConnection:_peripheral];
  for(int i = 0; i < OPS_COUNT; ++i) {
    _ops[i] = OpIgnore;
  }
  if(_timeout_timer) {
    dispatch_source_cancel(_timeout_timer);
    _timeout_timer = nil;
  }
  _contact_characteristic = nil;
  _connectionInProgress = false;
}

-(void)updateIo
{
  int done_or_ignore = 0;
  
  for(int i = 0; i < OPS_COUNT; ++i) {
    switch(_ops[i]) {
    case OpIgnore: //nothing to do
        ++done_or_ignore;
        break;
    case OpRequested:
        if(_contact_characteristic) {
          if(i == OP_READ) {
             [_peripheral readValueForCharacteristic:_contact_characteristic];
          } else {
            NSMutableData *deviceId = [_ble currentDeviceId];
            //we encode as an unsigned int, zero is reserved to mean invalid local rssi, we saturate at 255
            int rssiToSend = -sanitize_rssi(_rssi == INT_MIN ? _prevRssi : _rssi); //pick prev if we just flushed
            uint8_t bytes[1] = { (uint8_t)(rssiToSend & 0xFF) };
            [deviceId appendBytes:bytes length:1];

            [_peripheral writeValue:deviceId forCharacteristic:_contact_characteristic type:CBCharacteristicWriteWithResponse];
          }
          _ops[i] = OpInProgress;
        } else {
          [self beingConnectIfNeeded];
        }
        break;
      case OpInProgress: //this is done by the completion cbs
        break;
      case OpDone:
        ++done_or_ignore;
        break;
    }
  }
  if(done_or_ignore == OPS_COUNT)
    [self cancelConnection];
}

-(void)didConnect
{
  [_ble logDebug:[NSString stringWithFormat:@"connect ok. discovering services of %@", _peripheral.identifier]];
  [_peripheral discoverServices:@[ [CBUUID UUIDWithString: _serviceUUID]]];
}

-(void)didFailToConnect: (NSError*)error
{
  [_ble logDebug:[NSString stringWithFormat:@"failed to connect to %@ due to %@", _peripheral.identifier, error]];
  [self cancelConnection];
}


//BLE callbacks

-(void)tryFlushContact
{
  int64_t now = get_now_secs();
  if((now - _lastContactFlush) > contact_log_interval_in_secs && _device_id_valid) {
    [_ble logContact: _current_device_data at:_lastContactFlush rssi:sanitize_rssi(_rssi) kind:td::ContactKind::ActiveContact];
    _lastContactFlush = now;
    _prevRssi = _rssi;
    _rssi = INT_MIN;
  }
}
     
-(void)didScan:(NSDictionary<NSString *,id> *)data rssi:(int)rssi
{
  //a positive rssi is insane
  if(rssi < 0)
    _rssi = sanitize_rssi(MAX(_rssi, rssi));
  [self tryFlushContact];
}

//Delegate callbacks

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(NSError *)error
{
  if(error)
  {
    [self cancelConnection];
    [_ble logDebug:[NSString stringWithFormat: @"discover services failed with %@", error]];
    return;
  }
  CBUUID *chr_id = [CBUUID UUIDWithString:_characteristicUUID];
  //TODO check service id
  for(CBService *s in peripheral.services) {
    if([s.UUID isEqual: [CBUUID UUIDWithString:_serviceUUID]]) {
      [peripheral discoverCharacteristics:@[chr_id] forService:s];
      break;
    }
  }
}

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverCharacteristicsForService:(CBService *)service error:(NSError *)error
{
  if(error) {
    [self cancelConnection];
    [_ble logDebug:[NSString stringWithFormat: @"discovered characteristics failed with %@", error]];
    return;
  }

  CBUUID *chr_id = [CBUUID UUIDWithString:_characteristicUUID];
  for(CBCharacteristic *chr in service.characteristics)
  {
    if([chr.UUID isEqual:chr_id]) {
      _contact_characteristic = chr;
      break;
    }
  }
  [self updateIo];
}

- (void)peripheral:(CBPeripheral *)peripheral didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error
{
  if(error)
  {
    [_ble logDebug:[NSString stringWithFormat: @"[%lld] read %@ failed: %@", get_now_secs(), peripheral.identifier, error]];
    //XXX don't break connection on read failure as writes could be happening
  }
  else
  {
    NSData *data = characteristic.value;

    if(data != nil && data.length == PROTO_ID_SIZE) {
      [_ble logDebug:[NSString stringWithFormat: @"[%lld] read %@ good device id", get_now_secs(), peripheral.identifier]];
      memcpy([_current_device_data mutableBytes], data.bytes, PROTO_ID_SIZE);
      _device_id_valid = true;
      [self tryFlushContact];
    } else {
      [_ble logDebug:[NSString stringWithFormat: @"[%lld] read %@ bad device id - no payload or bad size", get_now_secs(), peripheral.identifier]];
      _device_id_valid = false;
    }
  }

  _ops[OP_READ] = OpDone;
  [self updateIo];
}

- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error
{
  if(error) {
    [_ble logDebug:[NSString stringWithFormat: @"[%lld] write characteristic failed with %@", get_now_secs(), error]];
  } else {
      [_ble logDebug: [NSString stringWithFormat: @"[%lld] write success %@", get_now_secs(), peripheral.identifier]];
  }

  _ops[OP_WRITE] = OpDone;
  [self updateIo];
}

@end

@implementation BLE {
  CBCentralManager *cbCentralManager;
  CBPeripheralManager *cbPeripheralManager;
  
  NSMutableDictionary<NSString*, PeripheralContactHelper*> *device_cache;

  td::SeedStore *_seeds;
  td::ContactStore *_contacts;
}

RCT_EXPORT_MODULE();

/**
 * React native module integration
 */
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onLifecycleEvent"];
}

/**
 * BleProtocol
 */
-(CBCentralManager *) cbc
{
  return self->cbCentralManager;
}

/**
 * Exported API
 */


RCT_EXPORT_METHOD(init_module: (NSString *)serviceUUID :(NSString *)characteristicUUID options:(NSDictionary*)options)
{
  if(_serviceUUID != nil)
    return;

  _serviceUUID = serviceUUID;
  _characteristicUUID = characteristicUUID;
  DebugLogEnabled = false;
  UseFastDevValues = false;

  key_rotation_window_in_secs = 14 * 24 * 3600; //default of 14 days

  if(options != nil) {
    if([@"yes" isEqual:[options objectForKey:@"DebugLog"]])
      DebugLogEnabled = true;
    if([@"yes" isEqual:[options objectForKey:@"FastDevScan"]])
      UseFastDevValues = true;
    if([options objectForKey:@"RetentionWindow"] != nil) {
      int64_t val = [RCTConvert NSNumber:options[@"RetentionWindow"]].longLongValue;
      if(val > 0)
        key_rotation_window_in_secs = val;
    }
  }

  if(UseFastDevValues) {
    contact_log_interval_in_secs = 5;
    local_id_write_interval_in_secs = 10;
    remote_id_read_interval_in_secs = 20;
    device_cache_ttl_in_secs = 1 * 60;
    crypto_id_update_schedule_in_secs = 5 * 60;
  } else {
    contact_log_interval_in_secs = 1 * 60;
    local_id_write_interval_in_secs = 5 * 60;
    remote_id_read_interval_in_secs = 10 * 60;
    device_cache_ttl_in_secs = 30 * 60;
    crypto_id_update_schedule_in_secs = 15 * 60;
  }


  NSURL *docs_url = [[NSFileManager.defaultManager URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
  NSURL *contact_url = [docs_url URLByAppendingPathComponent:@"contacts.txt"];
  NSURL *ids_url = [docs_url URLByAppendingPathComponent:@"ids.txt"];

  try {
    _contacts = new td::ContactStore(contact_url.path.UTF8String);
  } catch(std::exception *e) {
    NSLog(@"Error opening contacts store %@ due to %s", contact_url.path, e->what());
    [NSException raise:NSInvalidArgumentException format:@"Error opening contacts fileat %@ reason: %s", contact_url.path, e->what()];
  }
  
  try {
    _seeds = new td::SeedStore(ids_url.path.UTF8String, crypto_id_update_schedule_in_secs, key_rotation_window_in_secs);
  } catch(std::exception *e) {
    NSLog(@"Error opening crypto id database: %s at %@", e->what(), ids_url.path);
    [NSException raise:NSInvalidArgumentException format:@"Error opening crypto id database: %s at %@", e->what(), ids_url.path];
  }

  [self logCritical: [NSString stringWithFormat:@"BLE backend inited contacts %@ and ids %@", contact_url.path, ids_url.path]];
}

RCT_EXPORT_METHOD(start_ble)
{
  if(cbCentralManager != nil)
  {
    [self logCritical: @"BLE already inited" ];
    return;
  }

  NSDictionary *cbc_options = @{
  CBCentralManagerOptionRestoreIdentifierKey: @"tracedefense.scanner."
  };

  cbCentralManager = [[CBCentralManager alloc]
                    initWithDelegate: self
                    queue: dispatch_get_main_queue()
                    options: cbc_options];

  NSDictionary *cbp_options = @{
  CBPeripheralManagerOptionRestoreIdentifierKey: @"tracedefense.peripheral."
  };

  cbPeripheralManager = [[CBPeripheralManager alloc]
                       initWithDelegate: self
                       queue: dispatch_get_main_queue()
                       options: cbp_options];


  device_cache = [[NSMutableDictionary alloc] init];

  [self logCritical: @"BLE init successfull" ];
}

RCT_EXPORT_METHOD(stop_ble)
{
  if(cbCentralManager == nil)
  {
    [self logCritical: @"BLE not enabled" ];
    return;
  }

  if (cbCentralManager.isScanning)
  [cbCentralManager stopScan];

  cbCentralManager.delegate = nil;
  cbCentralManager = nil;

  if(cbPeripheralManager.isAdvertising)
  [cbPeripheralManager stopAdvertising];

  [cbPeripheralManager removeAllServices];

  cbPeripheralManager.delegate = nil;
  cbPeripheralManager = nil;
  device_cache = nil;

  [self logCritical: @"BLE stopped" ];
}

/**
 * Logging
 */

 -(void) flushCache: (CBPeripheral*)peripheral
{
   [device_cache removeObjectForKey: peripheral.identifier.UUIDString];
}

-(void) logContact: (NSData *)deviceId at:(int64_t)at rssi:(int)rssi kind:(td::ContactKind)kind {
  if(_contacts) {
    NSString *uuid_str = [[NSUUID alloc] initWithUUIDBytes:(uint8_t*)deviceId.bytes ].UUIDString;
    [self logDebug:[NSString stringWithFormat:@"new contact to %@ at %lld rssi %d kind %d", uuid_str, at, rssi, (int)kind]];
    _contacts->log(td::ContactLogEntry(td::Id((uint8_t *)deviceId.bytes), at, rssi, kind));
  }
}

-(void) logCritical: (id)payload {
  [self sendEventWithName:@"onLifecycleEvent" body:payload ];
  NSLog(@"TraceDefense::CRIT:: %@", payload);
}

-(void) logDebug: (id)payload {
  if(DebugLogEnabled) {
    [self sendEventWithName:@"onLifecycleEvent" body:payload ];
    NSLog(@"TraceDefense::INFO:: %@", payload);
  }
}

/**
*CBCentralManagerDelegate Impl
*/
-(void)centralManagerDidUpdateState:(CBCentralManager *)central {
  [self logCritical:[NSString stringWithFormat:@"CBM State update: %ld", (long)central.state] ];

  if (central.state == CBManagerStatePoweredOn) {
    NSArray *services = @[ [CBUUID UUIDWithString: _serviceUUID] ];
      
    NSDictionary *options = @{
      CBCentralManagerScanOptionAllowDuplicatesKey: @1
    };
    
    [ cbCentralManager scanForPeripheralsWithServices: services options: options ];
    [self logCritical: @"BLE scan started"];
  } else {
    [self logCritical: @"Bluetooth not enabled"];
  }
}

- (void)centralManager:(CBCentralManager *)central willRestoreState:(NSDictionary<NSString *,id> *)dict {
  [self logCritical: @"restoring CBCentral state"];
}

-(void)centralManager:(CBCentralManager *)central
  didDiscoverPeripheral:(CBPeripheral *)peripheral
  advertisementData:(NSDictionary<NSString *,id> *)advertisementData
  RSSI:(NSNumber *)RSSI {

  PeripheralContactHelper *pch = device_cache[peripheral.identifier.UUIDString];
  if(!pch) {
    pch = [[PeripheralContactHelper alloc] initWithPeripheral:peripheral logger:self];
    device_cache[peripheral.identifier.UUIDString] = pch;
  }
  [pch didScan:advertisementData rssi:[RSSI intValue]];
}

- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral
{
  PeripheralContactHelper *pch = device_cache[peripheral.identifier.UUIDString];
  if(pch)
    [pch didConnect];
  else
    [self logDebug:[NSString stringWithFormat:@"didConnect: did not find PTD for %@", peripheral.identifier]];

}

- (void)centralManager:(CBCentralManager *)central didFailToConnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error
{
  PeripheralContactHelper *pch = device_cache[peripheral.identifier.UUIDString];
  if(pch)
    [pch didFailToConnect: error];
  else
    [self logDebug:[NSString stringWithFormat:@"didFailConnect: did not find PTD for %@ err %@", peripheral.identifier, error]];

}

/**
 *CBPeripheralManagerDelegate Impl
 */

- (void)peripheralManager:(CBPeripheralManager *)peripheral willRestoreState:(NSDictionary<NSString *,id> *)dict
{
  [self logCritical:@"restoring CBPeripheralManager state"];
}



-(NSMutableData*) currentDeviceId
{
  if(!_seeds)
    return nil;

  try
  {
    td::Id cur = _seeds->getCurrentId();
    return [[NSMutableData alloc] initWithBytes:cur.bytes() length:PROTO_ID_SIZE];
  } catch(std::exception * e)
  {
    [self logCritical:[NSString stringWithFormat:@"Failed to fetch from id database error: %s", e->what()]];
    return NULL;
  }
}

- (void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral
{
  [self logCritical:[NSString stringWithFormat:@"CBP State update: %ld", (long)peripheral.state] ];

  if (peripheral.state == CBManagerStatePoweredOn)
  {
    CBUUID *characteristicUUID = [CBUUID UUIDWithString: _characteristicUUID];
    CBCharacteristicProperties properties = CBCharacteristicPropertyRead | CBCharacteristicPropertyWrite;
    CBAttributePermissions permissions = CBAttributePermissionsReadable | CBAttributePermissionsWriteable;
    
    CBMutableCharacteristic *service_characteristic = [[CBMutableCharacteristic alloc]
                                     initWithType:characteristicUUID
                                     properties:properties
                                     value:nil
                                     permissions:permissions];

    CBMutableService *the_service = [[CBMutableService alloc] initWithType:[CBUUID UUIDWithString: _serviceUUID] primary:YES];
    [the_service setCharacteristics: @[service_characteristic]];

    [peripheral removeAllServices];
    [peripheral addService:the_service];
    [self logDebug:@"CBP service added"];
  }
  else
  {
    [self logCritical:@"CBP Bluetooth peripheral not enabled"];
  }
}


- (void)peripheralManager:(CBPeripheralManager *)peripheral didAddService:(CBService *)service error:(NSError *)error
{
  
  if(error != nil)
  {
    [self logCritical:[NSString stringWithFormat: @"CBP add service failed due to %@", error]];
  }
  else
  {
    [cbPeripheralManager startAdvertising:@{
      CBAdvertisementDataLocalNameKey: @"tracedefense.app.",
      CBAdvertisementDataServiceUUIDsKey: @[ [CBUUID UUIDWithString:_serviceUUID] ]
    }];
    [self logCritical:@"CBP service advertising started"];
  }
}

- (void)peripheralManagerDidStartAdvertising:(CBPeripheralManager *)peripheral error:(NSError *)error
{
  if(error != nil)
  {
    [self logCritical:[NSString stringWithFormat: @"CBP start advertising failed due to %@", error] ];
  }
  else
  {
    [self logCritical:@"CBP start advertising success"];
  }
}

- (void)peripheralManager:(CBPeripheralManager *)peripheral didReceiveReadRequest:(CBATTRequest *)request
{
  request.value = [self currentDeviceId];
  [peripheral respondToRequest:request withResult:CBATTErrorSuccess];
}

- (void)peripheralManager:(CBPeripheralManager *)peripheral didReceiveWriteRequests:(NSArray<CBATTRequest *> *)requests
{
  for(CBATTRequest *req in requests)
  {
//    req.central.identifier;
    if(req.value == nil) {
      [peripheral respondToRequest:req withResult:CBATTErrorUnlikelyError];
      [self logDebug:@"Bad write request with no data"];
      continue;
    }

    if(req.value.length != 17) {
      [peripheral respondToRequest:req withResult:CBATTErrorUnlikelyError];
      [self logDebug:[NSString stringWithFormat:@"Bad write request with wrong data size %ld", (long)req.value.length]];
      continue;
    }

    NSData *device_id = [NSData dataWithBytes:req.value.bytes length:16 ];
    int rssi = -(int)((uint8_t*)req.value.bytes)[16];
    
    [self logContact:device_id at:get_now_secs() rssi:rssi kind:td::ContactKind::PassiveContact];
    [peripheral respondToRequest:req withResult:CBATTErrorSuccess];
  }
}


RCT_EXPORT_METHOD(getDeviceSeedAndRotate:(nonnull NSNumber *)interval resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  int64_t timestamp = [interval longLongValue];
  [self logDebug:[NSString stringWithFormat:@"ROTATING FOR %lld", timestamp]];

  if(!_seeds) {
    reject(@"InternalStateError", @"ID generator not initialzed", nil);
    return;
  }
  
  try {
    int64_t now = td::get_timestamp();
    auto seed = _seeds->getSeedAndRotate();
    
    NSMutableArray *arr = [[NSMutableArray alloc] initWithCapacity:1];
    NSMutableDictionary *seedVal = [NSMutableDictionary dictionary];
    seedVal[@"seed"] = [[NSUUID alloc] initWithUUIDBytes:seed.bytes()].UUIDString.lowercaseString;
    seedVal[@"sequenceStartTime"] = [NSNumber numberWithLongLong: seed.ts()];
    seedVal[@"sequenceEndTime"] = [NSNumber numberWithLongLong: now];
    [arr addObject:seedVal];

    resolve(arr);
  } catch(std::exception *e) {
    reject(@"InternalStateError", [NSString stringWithFormat:@"Failed to fetch seeds and rotate due to: %s", e->what()], nil);
  }
}

RCT_EXPORT_METHOD(purgeOldRecords:(nonnull NSNumber *)intervalToKeep)
{
  //FIXME TODO
  [self logDebug:@"purging records!"];
  int64_t how_old = td::get_timestamp() - CONTACT_QUERY_LOOKBACK_PERIOD_IN_SECS;
  try {
    if(_seeds)
      _seeds->makeSeedCurrent();
    if(_contacts)
      _contacts->purgeOldRecords(how_old);
    [self logCritical:@"record purge done"];
  } catch(std::exception *e) {
    [self logCritical:[NSString stringWithFormat:@"record purging failed with %s", e->what()]];
  }
}

RCT_EXPORT_METHOD(runBleQuery: (NSArray*)arr resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  __weak BLE *_w_ble = self;
  dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^ {
    try {
      std::vector<td::BluetoothMatch> matches;
      matches.resize(arr.count, td::BluetoothMatch(CONTACT_QUERY_LOOKBACK_PERIOD_IN_SECS, crypto_id_update_schedule_in_secs));
      for(int i = 0; i < arr.count / 2; ++i) {
        auto &bm = matches[i];
        NSArray *seeds = arr[i * 2];
        NSArray *timestamps = arr[i * 2 + 1];
        for(int j = 0; j < seeds.count; ++j) {
          NSString *s = seeds[j];
          NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:s];

          NSNumber *ts = nil;
          if(j < timestamps.count)
            ts = timestamps[j];

          if(uuid && ts) {
            uint8_t tmp[16];
            [uuid getUUIDBytes:tmp];
            bm.addSeed(td::Seed(tmp, [ts longLongValue]));
          }
        }
      }

      
      std::vector<td::Id> localIds;
      {
        BLE * ble = _w_ble;
        if(ble)
          localIds = ble->_contacts->findContactsSince(td::get_timestamp() - CONTACT_QUERY_LOOKBACK_PERIOD_IN_SECS);
      }

      auto boolRes = performBleMatching(matches, localIds);

      NSMutableArray *res = [NSMutableArray arrayWithCapacity: boolRes.size()];
      for(auto r : boolRes)
        [res addObject: [NSNumber numberWithInt: r ? 1 : 0]];

      resolve(res);
    } catch(std::exception e) {
      reject(@"InternalStateError", [NSString stringWithFormat:@"Query engine failed: %s", e.what()], nil);
    }
  });

}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber*, applyBitMask: (nonnull NSNumber*)number bits:(nonnull NSNumber*) bits)
{
  double val = [number doubleValue];
  int64_t ival = *(int64_t*)(&val);
  ival = ival & ((1ll << ([bits intValue] + 1)) - 1);
  val = *(double*)(&ival);
  return [NSNumber numberWithLongLong:val];
}


@end

