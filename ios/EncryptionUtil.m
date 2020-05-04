#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(EncryptionUtil, NSObject)
    RCT_EXTERN_METHOD(encryptWrapper: (NSString *)plainText callback:(RCTResponseSenderBlock *)callback)
    RCT_EXTERN_METHOD(decryptWrapper: (NSString *)encryptedString callback:(RCTResponseSenderBlock *)callback)
@end
