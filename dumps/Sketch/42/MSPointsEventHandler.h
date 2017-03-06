//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "MSEventHandler.h"

@class MSLayer, NSMutableDictionary;

@interface MSPointsEventHandler : MSEventHandler
{
    MSLayer *layer;
    NSMutableDictionary *currentSnaps;
    BOOL firstDrag;
    long long _selectedPoint;
}

@property(nonatomic) long long selectedPoint; // @synthesize selectedPoint=_selectedPoint;
- (void).cxx_destruct;
- (struct CGPoint)convertPointToAbsoluteCoordinates:(struct CGPoint)arg1;
- (struct CGPoint)snapPoint:(struct CGPoint)arg1 toLines:(id)arg2;
- (id)snapsForPoints:(id)arg1;
- (id)snapsForShape;
- (BOOL)useSnaps;
- (void)drawDotAtPoint:(struct CGPoint)arg1 index:(long long)arg2 selected:(BOOL)arg3;
- (void)drawHandles;
- (void)drawSnaps;
- (void)concatTransformsForDrawSnaps;
- (id)handleLinesPath;
- (id)handleLinesColor;
- (void)drawHandleLines;
- (void)drawInRect:(struct CGRect)arg1 cache:(id)arg2;
- (void)keyDown:(id)arg1;
- (struct CGPoint)adjustPoint:(struct CGPoint)arg1;
- (BOOL)shouldReturnToDefaultHandlerInCurrentState;
- (BOOL)absoluteMouseUp:(struct CGPoint)arg1 flags:(unsigned long long)arg2;
- (BOOL)absoluteMouseDragged:(struct CGPoint)arg1 flags:(unsigned long long)arg2;
- (void)replacePointAtIndex:(long long)arg1 withPoint:(struct CGPoint)arg2;
- (struct CGPoint)pointAtIndex:(unsigned long long)arg1;
- (BOOL)point:(struct CGPoint)arg1 isNearPoint:(struct CGPoint)arg2;
- (BOOL)absoluteMouseDown:(struct CGPoint)arg1 clickCount:(unsigned long long)arg2 flags:(unsigned long long)arg3;
- (long long)indexForMouse:(struct CGPoint)arg1;
- (BOOL)allowsEmptySelection;
- (struct CGPoint)relMouse:(struct CGPoint)arg1;
- (BOOL)shouldDrawLayerSelection;
- (void)sendUpdate;
- (struct CGRect)bounds;
- (id)points;
- (void)setLayer:(id)arg1;
- (void)handlerWillLoseFocus;
- (void)handlerGotFocus;
- (id)layerFromSelectedLayers;
- (id)initWithManager:(id)arg1;

@end
