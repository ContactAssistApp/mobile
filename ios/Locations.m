#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Locations, NSObject)
  RCT_EXTERN_METHOD(reverseGeoCode: (NSDictionary *)geoList resolve: (RCTPromiseResolveBlock *)resolver reject: (RCTPromiseRejectBlock*)rejecter)
@end
