//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "MSImmutableLayer.h"

@class MSImmutableStyle;

@interface _MSImmutableStyledLayer : MSImmutableLayer
{
    MSImmutableStyle *_style;
}

+ (Class)mutableClass;
@property(retain, nonatomic) MSImmutableStyle *style; // @synthesize style=_style;
- (void).cxx_destruct;
- (id)keysDifferingFromObject:(id)arg1;
- (BOOL)isEqualForDiffToObject:(id)arg1;
- (void)initializeUnsetObjectPropertiesWithDefaults;
- (BOOL)hasDefaultValues;
- (void)performInitEmptyObject;
- (void)decodePropertiesWithCoder:(id)arg1;
- (void)encodePropertiesWithCoder:(id)arg1;
- (void)enumerateChildProperties:(CDUnknownBlockType)arg1;
- (void)enumerateProperties:(CDUnknownBlockType)arg1;
- (id)styleGeneric;
- (void)performInitWithMutableModelObject:(id)arg1;

@end

