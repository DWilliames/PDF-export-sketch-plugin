//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "_MSExportPreset.h"

#import "MSExportFormatContainer.h"
#import "MSExportPreset.h"

@class NSArray, NSObject<NSCopying><NSCoding>, NSString;

@interface MSExportPreset : _MSExportPreset <MSExportPreset, MSExportFormatContainer>
{
}

- (id)containingLayer;
- (BOOL)isAssetEqual:(id)arg1;
- (unsigned long long)assetType;
- (id)initWithName:(id)arg1 formats:(id)arg2;
@property BOOL shouldAutoApply;

// Remaining properties
@property(readonly, copy) NSString *debugDescription;
@property(readonly, copy) NSString *description;
@property(readonly, nonatomic) NSArray *exportFormats;
@property(readonly) unsigned long long hash;
@property(readonly, nonatomic) NSString *name;
@property(readonly, copy, nonatomic) NSObject<NSCopying><NSCoding> *objectID;
@property(readonly, nonatomic) BOOL shouldApplyAutomatically;
@property(readonly) Class superclass;

@end

