//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "MSImmutableModelObject.h"

@interface _MSImmutableCurvePoint : MSImmutableModelObject
{
    double _cornerRadius;
    struct CGPoint _curveFrom;
    long long _curveMode;
    struct CGPoint _curveTo;
    BOOL _hasCurveFrom;
    BOOL _hasCurveTo;
    struct CGPoint _point;
}

+ (Class)mutableClass;
@property(nonatomic) struct CGPoint point; // @synthesize point=_point;
@property(nonatomic) BOOL hasCurveTo; // @synthesize hasCurveTo=_hasCurveTo;
@property(nonatomic) BOOL hasCurveFrom; // @synthesize hasCurveFrom=_hasCurveFrom;
@property(nonatomic) struct CGPoint curveTo; // @synthesize curveTo=_curveTo;
@property(nonatomic) long long curveMode; // @synthesize curveMode=_curveMode;
@property(nonatomic) struct CGPoint curveFrom; // @synthesize curveFrom=_curveFrom;
@property(nonatomic) double cornerRadius; // @synthesize cornerRadius=_cornerRadius;
- (id)keysDifferingFromObject:(id)arg1;
- (BOOL)isEqualForDiffToObject:(id)arg1;
- (void)initializeUnsetObjectPropertiesWithDefaults;
- (BOOL)hasDefaultValues;
- (void)performInitEmptyObject;
- (void)decodePropertiesWithCoder:(id)arg1;
- (void)encodePropertiesWithCoder:(id)arg1;
- (void)enumerateChildProperties:(CDUnknownBlockType)arg1;
- (void)enumerateProperties:(CDUnknownBlockType)arg1;
- (void)performInitWithMutableModelObject:(id)arg1;

@end

