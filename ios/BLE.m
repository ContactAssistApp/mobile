#import "BLE.h"
@import CoreBluetooth;

//restrict scanning tracedefence only devices
#define SCAN_SRV_ONLY 1
//we let up to this many times of leeway for the timer subsystem to delay execution
#define TIMER_LEEWAY 5

//global config options

//time between each log entry or device ping
static time_t observation_interval_in_secs = 5; //write internal & scan log interval
//time between us refreshing the remote token of a device
//should be >= observation_interval_in_secs and <= token_cache_ttl_in_secs
//should be <= token_renew_time_in_seconds
static time_t remote_token_refresh_timeout_in_secs = 10; //token read interval
//time we keep a device-id in our cache
static time_t token_cache_ttl_in_secs = 60;
//time between each token renewal (in theory remote_token_refresh_timeout_in_secs should be the same)
//should be >= observation_interval_in_secs (or some tokens won't be observable)
static time_t token_renew_time_in_seconds = 30;

static NSString *_serviceUUID;
static NSString *_characteristicUUID;

//active contact means we reached out and read the ID of device
#define CONTACT_ACTIVE 1
//active contact means a device reached out to us and send their ID
#define CONTACT_PASSIVE 2

#define conn_start_timeout_in_seconds 5

static time_t get_now(void)
{
  return (time_t)[NSDate date].timeIntervalSince1970;
}

@protocol BleLogger
-(void) logLifecycle: (id)payload;
-(NSData*)currentTokenData;
-(CBCentralManager *) cbc;
@end

@interface PeripheralTokenData : NSObject<CBPeripheralDelegate>
-(instancetype)initWithPeripheral: (CBPeripheral*)peripheral logger: (id<BleLogger>)logger;
-(bool)isExpired;

-(void)didConnect;
-(void)didFailToConnect: (NSError*)error;
-(void)beginRefresh;

@property CBPeripheral *peripheral;
@property NSString *token;
@end

@implementation PeripheralTokenData {
  id<BleLogger> _logger;

  time_t _creationTime;
  time_t _lastTokenRefresh;
  time_t _lastTokenSend;
  time_t _lastConnStart;

  //per connection state
  bool _refreshInProgress;
  bool _readRequest, _writeRequest;
  bool _readDone, _writeDone;
  bool _readCompleted, _writeCompleted;
  CBCharacteristic *_contact_characteristic;
}

-(instancetype)initWithPeripheral:(CBPeripheral*)peripheral logger:(id<BleLogger>)logger
{
  self.peripheral = peripheral;

  _logger = logger;
  _creationTime = get_now();
  _lastTokenRefresh = 0;
  _lastTokenSend = 0;
  _lastConnStart = 0;
  [self resetConnState];

  peripheral.delegate = self;

  return self;
}

-(bool)isExpired
{
  return (get_now() - _creationTime) > token_cache_ttl_in_secs;
}

-(void)resetConnState
{
  _refreshInProgress = false;
  _readRequest = _writeRequest = false;
  _readDone = _writeDone = false;
  _readCompleted = _writeCompleted = false;
  _contact_characteristic = nil;
  [[_logger cbc] cancelPeripheralConnection:_peripheral];
}

-(void)performAllIO
{
  if(!_contact_characteristic)
    return;
  if(_readRequest && !_readDone) {
    [_peripheral readValueForCharacteristic:_contact_characteristic];
    _readDone = true;
  }

  if(_writeRequest && !_writeDone) {
    [_peripheral writeValue:[_logger currentTokenData] forCharacteristic:_contact_characteristic type:CBCharacteristicWriteWithResponse];
    _writeDone = true;
  }
}

-(void)beginRefresh
{
  if([self isExpired])
    return;

  time_t now = get_now();
  //do we need to connect?
  bool needsToRefreshToken = (now - _lastTokenRefresh) > remote_token_refresh_timeout_in_secs;
  bool needsToSendToken = (now - _lastTokenSend) > observation_interval_in_secs;

  //Nothing to do, we can kill the connection
  if(!needsToRefreshToken && !needsToSendToken)
  {
    switch(_peripheral.state)
    {
      case CBPeripheralStateConnected:
        if(!_refreshInProgress) {
          [self resetConnState];
          [_logger logLifecycle:[NSString stringWithFormat:@"disconnecting device %@", self.peripheral.identifier]];
        }
        break;
      case CBPeripheralStateConnecting:
        if ((now - _lastConnStart) > conn_start_timeout_in_seconds) {
          [self resetConnState];
          [_logger logLifecycle:[NSString stringWithFormat:@"device connection timeout %@", self.peripheral.identifier]];
        }
        break;
      default: //nothing to do if we're not connected
        break;
    }
    return;
  }
  
  _readRequest = needsToRefreshToken;
  _writeRequest = needsToSendToken;

  switch(_peripheral.state)
  {
    case CBPeripheralStateConnected:
      [self performAllIO];
      break;
    case CBPeripheralStateConnecting:
      break;
    default:
      [[_logger cbc] connectPeripheral:self.peripheral options:nil];
      _lastConnStart = now;
//      [_logger logLifecycle:[NSString stringWithFormat:@"connecting to device %@", self.peripheral.identifier]];
      break;
  }

  _refreshInProgress = true;
}

-(void)didConnect
{
//  [_logger logLifecycle:[NSString stringWithFormat:@"discovering services of %@", self.peripheral.identifier]];
  [self.peripheral discoverServices:@[ [CBUUID UUIDWithString: _serviceUUID]]];
}

-(void)didFailToConnect:(NSError *)error
{
  [_logger logLifecycle:[NSString stringWithFormat:@"failed to connect to %@ due to %@", self.peripheral.identifier, error]];
  [self resetConnState];
}

/**
 * CBPeripheralDelegate
 */

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(NSError *)error
{
  if(error)
  {
    [self resetConnState];
    [_logger logLifecycle:[NSString stringWithFormat: @"discover services failed with %@", error]];
    return;
  }
  CBUUID *chr_id = [CBUUID UUIDWithString:_characteristicUUID];
  //TODO check service id
  for(CBService *s in peripheral.services) {
    if([s.UUID isEqual: [CBUUID UUIDWithString:_serviceUUID]]) {
//      [_logger logLifecycle:@"Found our service :D"];
      [peripheral discoverCharacteristics:@[chr_id] forService:s];
    }
  }
}

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverCharacteristicsForService:(CBService *)service error:(NSError *)error
{
  if(error) {
    [self resetConnState];
    [_logger logLifecycle:[NSString stringWithFormat: @"discovered characteristics failed with %@", error]];
    return;
  }

  CBUUID *chr_id = [CBUUID UUIDWithString:_characteristicUUID];
  for(CBCharacteristic *chr in service.characteristics)
  {
    if([chr.UUID isEqual:chr_id]) {
      _contact_characteristic = chr;
      [self performAllIO];
    }
  }
}

- (void)peripheral:(CBPeripheral *)peripheral didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error
{
  if(error)
  {
    [_logger logLifecycle:[NSString stringWithFormat: @"[%ld] read %@ failed: %@", get_now(), peripheral.identifier, error]];
    //XXX don't break connection on read failure as writes could be happening
  }
  else
  {
    NSString *uuid = [[[NSUUID alloc] initWithUUIDBytes:characteristic.value.bytes] UUIDString];
    [_logger logLifecycle:[NSString stringWithFormat: @"[%ld] read %@ => %@", get_now(), peripheral.identifier, uuid]];

    self.token = uuid;
    _lastTokenRefresh = get_now();
  }

  _readCompleted = true;
  if((!_readRequest || _readCompleted) && (!_writeRequest || _writeCompleted)){
    //We're done with this connection
    [self resetConnState];
  }
}

- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error
{
  [_logger logLifecycle:
   [NSString stringWithFormat: @"[%ld] write %@ (%@)", get_now(), peripheral.identifier, error?@"ok":@"fail"]];

  if(error) {
    [_logger logLifecycle:[NSString stringWithFormat: @"write characteristic failed with %@", error]];
    //XXX don't break connection on write failure as reads could be happening
  }

  //nothing to do if it completed (maybe we log the fact to facilitate testing)

  _writeCompleted = true;
  if((!_readRequest || _readCompleted) && (!_writeRequest || _writeCompleted)) {
    //We're done with this connection
    [self resetConnState];
  }
}
@end


@interface BleRecord: NSObject

@property NSString *uuid;
@property time_t lastSeenTimestamp; //last time this device was seen
@property time_t firstSeenTimestamp; //last time this device was logged
@property int rssi;
@property NSString *deviceName;
@property NSString *localName;
@property NSString *manufacturer;

- (instancetype)initWithUUID:(NSString *)uuid peripheralName:(NSString*)name localName: (NSString*)localId manufacturer: (NSString*)manufacturer;

- (void)update:(time_t)timestamp rssi:(int)rssi;

- (bool)isExpired;
@end

@implementation BleRecord

- (instancetype)initWithUUID:(NSString *)uuid peripheralName:(NSString*)name localName: (NSString*)localName manufacturer: (NSString*)manufacturer
{
  self.uuid = uuid;
  self.deviceName = name;
  self.localName = localName;
  self.manufacturer = manufacturer;
  self.lastSeenTimestamp = 0;
  self.firstSeenTimestamp = 0;
  self.rssi = INT_MIN;

  return self;
}

- (void)update:(time_t)timestamp rssi:(int)rssi;
{
  if(self.firstSeenTimestamp == 0) {
    self.firstSeenTimestamp = timestamp;
    self.lastSeenTimestamp = timestamp;
  } else {
    self.lastSeenTimestamp = timestamp;
  }
  if(self.rssi < rssi)
    self.rssi = rssi;
}

- (bool)isExpired
{
  return (get_now() - self.firstSeenTimestamp) > observation_interval_in_secs;
}


@end

@implementation BLE {
  CBCentralManager *cbCentralManager;
  CBPeripheralManager *cbPeripheralManager;

  //used by scanning
  NSMutableDictionary *ble_table;
  dispatch_source_t queue_timer;

  NSUUID *currentToken;
  dispatch_source_t token_renew_timer;
  
  NSMutableDictionary<NSString*, PeripheralTokenData*> *token_cache;
}

RCT_EXPORT_MODULE();

/**
 * React native module integration
 */
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onLifecycleEvent", @"onTokenChange", @"onContact"];
}


/**
 * BleLogger
 */
-(CBCentralManager *) cbc
{
  return self->cbCentralManager;
}

/**
 * Exported API
 */


RCT_EXPORT_METHOD(init_module: (NSString *)serviceUUID :(NSString *)characteristicUUID)
{
  if(_serviceUUID != nil)
    return;

  _serviceUUID = serviceUUID;
  _characteristicUUID = characteristicUUID;

  [self logLifecycle : @"BLE backend inited" ];
}

RCT_EXPORT_METHOD(startScanning)
{
  if(cbCentralManager != nil)
  {
    [self logLifecycle : @"BLE scanning already in progress" ];
    return;
  }

  NSDictionary *cbc_options = @{
    CBCentralManagerOptionRestoreIdentifierKey: @"tracedefense.scanner."
  };

  cbCentralManager = [[CBCentralManager alloc]
                      initWithDelegate: self
                      queue: dispatch_get_main_queue()
                      options: cbc_options];

  [self logLifecycle : @"scanning init successfull" ];
}

RCT_EXPORT_METHOD(stopScanning)
{
  if(cbCentralManager == nil)
  {
    [self logLifecycle : @"BLE scanning not running" ];
    return;
  }
  
  if (cbCentralManager.isScanning)
    [cbCentralManager stopScan];
  
  cbCentralManager.delegate = nil;
  cbCentralManager = nil;
  [self logLifecycle : @"BLE scanning stopped" ];
}

RCT_EXPORT_METHOD(startAdvertising)
{
  if(cbPeripheralManager != nil)
  {
    [self logLifecycle : @"CBP advertising already on" ];
    return;
  }

  NSDictionary *cbp_options = @{
    CBPeripheralManagerOptionRestoreIdentifierKey: @"tracedefense.peripheral."
  };

cbPeripheralManager = [[CBPeripheralManager alloc]
                         initWithDelegate: self
                         queue: dispatch_get_main_queue()
                         options: cbp_options];

  [self logLifecycle : @"CBP advertising init successfull" ];
}

 RCT_EXPORT_METHOD(stopAdvertising)
 {
   if(cbPeripheralManager == nil)
   {
     [self logLifecycle : @"CBP advertising not happening" ];
     return;
   }
  
   if(cbPeripheralManager.isAdvertising)
    [cbPeripheralManager stopAdvertising];
   
   [cbPeripheralManager removeAllServices];

  cbPeripheralManager.delegate = nil;
  cbPeripheralManager = nil;

  [self logLifecycle : @"CBP advertising stopped" ];
}

/**
 * Logging
 */

-(void) clearScanState {
  //que empty the old data
  if(ble_table == nil)
    ble_table = [[NSMutableDictionary alloc] init];
  if(token_cache == nil)
    token_cache = [[NSMutableDictionary alloc] init];
}

-(void) logTokenChange: (NSString *)token at:(time_t)at  {
  [self sendEventWithName:@"onTokenChange" body:@[token, [NSNumber numberWithLong:at]]];
}

-(void) logContact: (NSString *)token at:(time_t)at rssi:(int)rssi kind:(int)kind {
  [self sendEventWithName:@"onContact" body:@[token, [NSNumber numberWithLong:at], [NSNumber numberWithInt:rssi], [NSNumber numberWithInt:kind]]];
}

-(void) logLifecycle: (id)payload {
  [self sendEventWithName:@"onLifecycleEvent" body:payload ];
  NSLog(@"TraceDefense:: %@", payload);
}

/**
*CBCentralManagerDelegate Impl
*/
-(void)centralManagerDidUpdateState:(CBCentralManager *)central {
  [self clearScanState];
  [self logLifecycle:[NSString stringWithFormat:@"CBM State update: %ld", (long)central.state] ];

  if (central.state == CBManagerStatePoweredOn) {
#if SCAN_SRV_ONLY
    NSArray *services = @[ [CBUUID UUIDWithString: _serviceUUID] ];
#else
      NSArray *services = nil;
#endif
      
      NSDictionary *options = @{
        CBCentralManagerScanOptionAllowDuplicatesKey: @1
      };
    
      [ cbCentralManager scanForPeripheralsWithServices: services options: options ];
      [self logLifecycle:@"BLE scan started"];
    } else {
      [self logLifecycle:@"Bluetooth not enabled"];
    }
}

- (void)centralManager:(CBCentralManager *)central willRestoreState:(NSDictionary<NSString *,id> *)dict {
  [self logLifecycle:@"restoring CBCentral state"];
}

static NSString *nsdata_to_hex(NSData *data)
{
  NSUInteger capacity = data.length * 2;
  NSMutableString *sbuf = [NSMutableString stringWithCapacity:capacity];
  const unsigned char *buf = data.bytes;
  NSInteger i;
  for (i=0; i< data.length; ++i) {
    [sbuf appendFormat:@"%02X", (int)buf[i]];
  }
  return sbuf;
}


-(void)centralManager:(CBCentralManager *)central
  didDiscoverPeripheral:(CBPeripheral *)peripheral
  advertisementData:(NSDictionary<NSString *,id> *)advertisementData
  RSSI:(NSNumber *)RSSI {
 
  NSString *peripheralName = peripheral.name;
  NSString *peripheralId = peripheral.identifier.UUIDString;
  NSNumber *rssi =  [NSNumber numberWithInteger: [RSSI integerValue]];
  
  NSString *localName = [advertisementData objectForKey:CBAdvertisementDataLocalNameKey];
  if(localName == nil)
    localName = @"<no_local_name>";
  NSString * manufacturer_str = @"<no_manufacturer>";
  NSData *manufacturer = [advertisementData objectForKey:CBAdvertisementDataManufacturerDataKey];
  if(manufacturer != nil)
    manufacturer_str = nsdata_to_hex(manufacturer);

  if(peripheralName == nil)
    peripheralName = @"<unknown>";
  
  BleRecord *rec = [ble_table objectForKey: peripheralId];

  if(rec != nil && rec.isExpired) {
    [self flush_record: rec];
    rec = nil;
  }
   
  if(rec == nil)
  {
   rec = [[BleRecord alloc] initWithUUID: peripheralId peripheralName: peripheralName localName:localName manufacturer:manufacturer_str];
   [self add_record_to_monitor: rec];
  }

  time_t ts = (time_t)[NSDate date].timeIntervalSince1970;
  [rec update: ts rssi: [rssi intValue]];

  //token cache maintenance
  PeripheralTokenData *token = self->token_cache[peripheralId];
  if(token == nil || [token isExpired]) {
    [self logLifecycle:[NSString stringWithFormat:@"bad token is nil %d", (token == nil)]];
    token = [[PeripheralTokenData alloc] initWithPeripheral:peripheral logger:self];
    token_cache[peripheralId] = token;
  }

  [token beginRefresh];
}

- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral
{
  PeripheralTokenData *token = self->token_cache[peripheral.identifier.UUIDString];
  if(token)
    [token didConnect];
  else
    [self logLifecycle:[NSString stringWithFormat:@"didConnect: did not find PTD for %@", peripheral.identifier]];

}

- (void)centralManager:(CBCentralManager *)central didFailToConnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error
{
  PeripheralTokenData *token = self->token_cache[peripheral.identifier.UUIDString];
  if(token)
    [token didFailToConnect: error];
  else
    [self logLifecycle:[NSString stringWithFormat:@"didFailConnect: did not find PTD for %@ err %@", peripheral.identifier, error]];

}

/**
 *CBPeripheralManagerDelegate Impl
 */

- (void)peripheralManager:(CBPeripheralManager *)peripheral willRestoreState:(NSDictionary<NSString *,id> *)dict
{
  [self logLifecycle:@"restoring CBPeripheralManager state"];
}


- (void)clearPeripheralState
{
  //TODO?
}

time_t lastTokenUpdate;

-(NSData*)currentTokenData
{
  time_t now = get_now();
  if((now - lastTokenUpdate) > token_renew_time_in_seconds) {
    NSUUID *newToken = [NSUUID UUID];
    [self logLifecycle:[NSString stringWithFormat:@"Updating token from %@ to %@", currentToken, newToken]];
    currentToken = newToken;
    [self logTokenChange:[newToken UUIDString] at:now
    ];
    lastTokenUpdate = now;
  }

  uuid_t uuid;
  [currentToken getUUIDBytes: (u_char*)&uuid];
  return [NSData dataWithBytes:&uuid length:16];
}

- (void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral
{
  [self clearPeripheralState];
  [self logLifecycle:[NSString stringWithFormat:@"CBP State update: %ld", (long)peripheral.state] ];

  if (peripheral.state == CBPeripheralManagerStatePoweredOn)
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
    [self logLifecycle:@"CBP service added"];
  }
  else
  {
    [self logLifecycle:@"CBP Bluetooth peripheral not enabled"];
  }
}


- (void)peripheralManager:(CBPeripheralManager *)peripheral didAddService:(CBService *)service error:(NSError *)error
{
  
  if(error != nil)
  {
    [self logLifecycle:[NSString stringWithFormat: @"CBP add service failed due to %@", error]];
  }
  else
  {
    [cbPeripheralManager startAdvertising:@{
      CBAdvertisementDataLocalNameKey: @"tracedefense.app.",
      CBAdvertisementDataServiceUUIDsKey: @[ [CBUUID UUIDWithString:_serviceUUID] ]
    }];
    [self logLifecycle:@"CBP service advertising started"];
  }
}

- (void)peripheralManagerDidStartAdvertising:(CBPeripheralManager *)peripheral error:(NSError *)error
{
  if(error != nil)
  {
    [self logLifecycle:[NSString stringWithFormat: @"CBP start advertising failed/2 due to %@", error] ];
  }
  else
  {
    [self logLifecycle:@"CBP start advertising success"];
  }
}

- (void)peripheralManager:(CBPeripheralManager *)peripheral didReceiveReadRequest:(CBATTRequest *)request
{
  NSData *data = [self currentTokenData];
  request.value = data;
  [peripheral respondToRequest:request withResult:CBATTErrorSuccess];
}

- (void)peripheralManager:(CBPeripheralManager *)peripheral didReceiveWriteRequests:(NSArray<CBATTRequest *> *)requests
{
  for(CBATTRequest *req in requests)
  {
    if(req.value == nil) {
      [peripheral respondToRequest:req withResult:CBATTErrorUnlikelyError];
      [self logLifecycle:@"Bad write request with no data"];
      continue;
    }

    if(req.value.length != 16) {
      [peripheral respondToRequest:req withResult:CBATTErrorUnlikelyError];
      [self logLifecycle:[NSString stringWithFormat:@"Bad write request with wrong data size %ld", req.value.length]];
      continue;
    }

    NSString *uuid = [[[NSUUID alloc] initWithUUIDBytes:req.value.bytes] UUIDString];
    [self logLifecycle:[NSString stringWithFormat:@">>>A friend sent us uuid: %@", uuid]];
    [ self logContact:uuid at:get_now() rssi:INT_MIN kind:CONTACT_PASSIVE];
  }
}


/**
 * Blackground queueing and flusshing
 */

-(void) flush_record: (BleRecord*)rec
{
//  [self logLifecycle:[NSString stringWithFormat:@"flushing %@", rec.uuid]];

  PeripheralTokenData *pd = token_cache[rec.uuid];
  if(pd == nil || pd.token == nil) {
    [self logLifecycle:[NSString stringWithFormat:
                        @"Can't flush record because there's no token in cache for %@ pd %d", rec.uuid, (pd == nil)] ];
  }
  else
  {
    [self logContact:pd.token at:rec.firstSeenTimestamp rssi:rec.rssi kind:CONTACT_ACTIVE];
  }

  [ble_table removeObjectForKey:rec.uuid];
}

-(void) processTokensAndRecords
{
//  [self logLifecycle:@"Processing timer called"];
  
  for(PeripheralTokenData *pd in token_cache.allValues)
  {
    [pd beginRefresh];
    if([pd isExpired]) {
      [token_cache removeObjectForKey: pd.peripheral.identifier.UUIDString];
    }
  }
  //collect all expired objects
  NSMutableArray<BleRecord*> *arr = [[NSMutableArray alloc] init];

  for(NSString *key in ble_table) {
    BleRecord *rec = [ble_table objectForKey:key];
    if(rec.isExpired)
      [arr addObject: rec];
  }
  
  for(BleRecord *rec in arr) {
    [self flush_record: rec];
  }

  if(ble_table.count == 0 && token_cache.count == 0) {
    dispatch_source_cancel(queue_timer);
    queue_timer = nil;
  }
}

-(void) add_record_to_monitor: (BleRecord*)rec
{
  [ble_table setObject:rec forKey: rec.uuid];

  if(queue_timer == nil)
  {
    queue_timer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, dispatch_get_main_queue());
    if(queue_timer)
    {
      dispatch_source_set_timer(queue_timer,
                                dispatch_walltime(NULL, 0),
                                observation_interval_in_secs * NSEC_PER_SEC,
                                observation_interval_in_secs * NSEC_PER_SEC * TIMER_LEEWAY);

      __weak BLE* w_self = self;
      dispatch_source_set_event_handler(queue_timer, ^{
        [w_self processTokensAndRecords];
      });

      dispatch_resume(queue_timer);
    }
    else
    {
      [self logLifecycle:@"Could not create queue timer"];
    }
  }
}

@end

