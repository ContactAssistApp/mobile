#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(EncryptionUtil, NSObject)
    RCT_EXTERN_METHOD(getRealmKey: (RCTPromiseResolveBlock)resolve
                                   rejecter:(RCTPromiseRejectBlock)reject)
@end
