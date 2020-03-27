#import "BLE.h"
@import CoreBluetooth;

// static NSString *CovidBleUUID = @"0000c019-0000-1000-8000-00805f9b34fb";
// static NSString *CovidBlueCharacteristicUUID = @ "D61F4F27-3D6B-4B04-9E46-C9D2EA617F62";

//restrict scanning tracedefence only devices
//#define SCAN_SRV_ONLY

@implementation BLE

CBCentralManager *cbCentralManager;
CBPeripheralManager *cbPeripheralManager;
NSString *_serviceUUID;
NSString *_characteristicUUID;

RCT_EXPORT_MODULE();

/**
 * React native module integration
 */
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onLifecycleEvent", @"onBlePeripheralDiscovered"];
}

/**
 * Exported API
 */

RCT_EXPORT_METHOD(trigger_ble)
{
  [self logBlePeripheralDiscovery: @[ @"dummy device name", @"000-000-000", [NSNumber numberWithInteger: -10], @"no desc"]];
}

RCT_EXPORT_METHOD(trigger_lc)
{
  [self logLifecycle: @"dummy lifecycle notification"];
}


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

  cbPeripheralManager.delegate = nil;
  cbPeripheralManager = nil;
  [self logLifecycle : @"CBP advertising stopped" ];
}

/**
 * Logging
 */

-(void) clearScanState {
  return;
}

-(void) logBlePeripheralDiscovery: (id)payload {
  [self sendEventWithName:@"onBlePeripheralDiscovered" body:payload ];
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

-(void)centralManager:(CBCentralManager *)central
  didDiscoverPeripheral:(CBPeripheral *)peripheral
  advertisementData:(NSDictionary<NSString *,id> *)advertisementData
  RSSI:(NSNumber *)RSSI {
 
  NSString *peripheralName = [peripheral name];
  NSString *peripheralId =  [[peripheral identifier] description];
  NSNumber *rssi =  [NSNumber numberWithInteger: [RSSI integerValue]];
  NSString *desc = [advertisementData description];
  if(peripheralName == nil)
    peripheralName = @"<unknown>";

  if ([peripheralId isEqualToString: @"tijuca"])
      [self logLifecycle:[NSString stringWithFormat: @"found tijuca with id %@", peripheralId]];

// Can't log that, it's too spamy
//  [self logLifecycle:[NSString
//        stringWithFormat:@"Central manager did discover new peripheral (uuid=%@ name='%@') RSSI=%d advertisementData=%@",
//        peripheralName,
//        peripheralId,
//        [RSSI intValue],
//        desc]];

  [self logBlePeripheralDiscovery:@[ peripheralName, peripheralId, rssi, desc] ];
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
  //todo
}

- (void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral
{
  [self clearPeripheralState];
  [self logLifecycle:[NSString stringWithFormat:@"CBP State update: %ld", (long)peripheral.state] ];

  if (peripheral.state == CBPeripheralManagerStatePoweredOn)
  {
    
    CBUUID *characteristicUUID = [CBUUID UUIDWithString: _characteristicUUID];
    CBCharacteristicProperties properties = CBCharacteristicPropertyRead;
    CBAttributePermissions permissions = CBAttributePermissionsReadable;
    CBMutableCharacteristic *srvC = [[CBMutableCharacteristic alloc]
                                     initWithType:characteristicUUID
                                     properties:properties
                                     value:nil
                                     permissions:permissions];

    
    CBMutableService *srv = [[CBMutableService alloc] initWithType:[CBUUID UUIDWithString: _serviceUUID] primary:YES];
    [srv setCharacteristics: @[srvC]];

    [peripheral addService:srv];
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


@end
