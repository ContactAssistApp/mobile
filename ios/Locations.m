#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Locations, NSObject)
  RCT_EXTERN_METHOD(
    reverseGeoCode: (NSDictionary *)geo
    resolve: (RCTPromiseResolveBlock)resolve
    rejecter: (RCTPromiseRejectBlock*)reject
  )
@end
