//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "MSBaseRenderer.h"

@class MSImmutableStyleFill, MSModelObjectCacheGeneration, MSPath, MSRenderingContext;

@interface MSStyleFillRenderer : MSBaseRenderer
{
    BOOL _hasInnerStroke;
    MSRenderingContext *_context;
    MSImmutableStyleFill *_fill;
    MSPath *_path;
    long long _fillIndex;
    double _zoomValue;
    unsigned long long _windingRule;
    MSModelObjectCacheGeneration *_cacheKey;
    struct CGRect _rect;
}

+ (void)drawFill:(id)arg1 forPath:(id)arg2 windingRule:(unsigned long long)arg3 atIndex:(long long)arg4 inRect:(struct CGRect)arg5 hasInnerStroke:(BOOL)arg6 context:(id)arg7 angularGradientCacheKey:(id)arg8;
@property(retain, nonatomic) MSModelObjectCacheGeneration *cacheKey; // @synthesize cacheKey=_cacheKey;
@property(nonatomic) unsigned long long windingRule; // @synthesize windingRule=_windingRule;
@property(nonatomic) struct CGRect rect; // @synthesize rect=_rect;
@property(nonatomic) double zoomValue; // @synthesize zoomValue=_zoomValue;
@property(nonatomic) BOOL hasInnerStroke; // @synthesize hasInnerStroke=_hasInnerStroke;
@property(nonatomic) long long fillIndex; // @synthesize fillIndex=_fillIndex;
@property(retain, nonatomic) MSPath *path; // @synthesize path=_path;
@property(retain, nonatomic) MSImmutableStyleFill *fill; // @synthesize fill=_fill;
@property(nonatomic) __weak MSRenderingContext *context; // @synthesize context=_context;
- (void).cxx_destruct;
- (void)drawImageInRect:(struct CGRect)arg1;
- (void)drawPatternStretch;
- (void)drawPatternFit;
- (void)drawPatternFill;
- (void)prepareAlphaForContext:(struct CGContext *)arg1;
- (struct CGImage *)CGImageForPatternTile;
- (void)drawPatternTile;
- (void)drawNoise;
- (void)drawPatternImage;
- (void)drawGradientFill;
- (void)drawColorFill;
- (void)clipInBlock:(CDUnknownBlockType)arg1;
- (void)render;

@end
