#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#include <CoreBluetooth/CoreBluetooth.h>
#include "contact-model.h"

@protocol BleProtocol
-(void) logDebug: (id)payload;
-(void) logCritical: (id)payload;
-(NSMutableData*)currentDeviceId;
-(NSString*)currentIdStr;
-(CBCentralManager *) cbc;
-(void) flushCache: (CBPeripheral*)peripheral;
-(void)logContact: (NSData *)device_id at:(int64_t)at rssi:(int)rssi kind:(td::ContactKind)kind;
@end



@interface BLE : RCTEventEmitter <RCTBridgeModule, CBCentralManagerDelegate, CBPeripheralManagerDelegate, BleProtocol>
@end
