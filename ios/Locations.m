#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Locations, NSObject)
  RCT_EXTERN_METHOD(reverseGeoCode: (NSDictionaryArray *)geoList callback:(RCTResponseSenderBlock *)callback)
@end
