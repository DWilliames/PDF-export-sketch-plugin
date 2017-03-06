//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "NSKeyedUnarchiver.h"

@class NSArray, NSDictionary;

@interface MSUnarchiver : NSKeyedUnarchiver
{
    BOOL _corruptionDetected;
    long long _version;
    SEL _propertyDecoder;
    NSArray *_actualSymbolIDs;
    NSDictionary *_legacyImages;
}

+ (id)unarchiveObjectFromURL:(id)arg1 actualVersion:(long long *)arg2 error:(id *)arg3;
+ (id)unarchiveObjectWithData:(id)arg1 actualVersion:(long long *)arg2 error:(id *)arg3;
+ (id)unarchiveObjectWithData:(id)arg1 asVersion:(long long)arg2 corruptionDetected:(char *)arg3 error:(id *)arg4;
+ (id)unarchiveObjectWithData:(id)arg1;
+ (id)unarchiveObjectWithData:(id)arg1 error:(id *)arg2;
+ (void)defineReplacementClasses;
+ (void)initialize;
@property(retain, nonatomic) NSDictionary *legacyImages; // @synthesize legacyImages=_legacyImages;
@property(retain, nonatomic) NSArray *actualSymbolIDs; // @synthesize actualSymbolIDs=_actualSymbolIDs;
@property(nonatomic) BOOL corruptionDetected; // @synthesize corruptionDetected=_corruptionDetected;
@property(readonly, nonatomic) SEL propertyDecoder; // @synthesize propertyDecoder=_propertyDecoder;
@property(readonly, nonatomic) long long version; // @synthesize version=_version;
- (void).cxx_destruct;
- (void)setDecodingVersion:(long long)arg1;

@end
