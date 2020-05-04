#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(EncryptionUtil, NSObject)
    RCT_EXTERN_METHOD(encryptWrapper: (NSString *)plainText
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject)
    RCT_EXTERN_METHOD(decryptWrapper: (NSString *)encryptedString
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject)
@end
