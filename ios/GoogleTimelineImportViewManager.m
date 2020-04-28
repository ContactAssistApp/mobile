//
//  GoogleTimelineImportViewManager.m
//  covidsafe
//
//  Created by Apollo Zhu on 4/28/20.
//  Copyright © 2020 CovidSafe. All rights reserved.
//

#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(GoogleTimelineImportViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(isVisible, BOOL)
RCT_EXPORT_VIEW_PROPERTY(logWindow, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onReceivingPlacemarks, RCTBubblingEventBlock)

@end
