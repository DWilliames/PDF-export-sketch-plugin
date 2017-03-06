//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "MSEventHandler.h"

@class MSBitmapEditInspectorViewController, MSBitmapMagicWandEditor, MSBitmapRectangleEditor, NSBezierPath, NSBitmapImageRep, NSCursor;

@interface MSBitmapEditEventHandler : MSEventHandler
{
    MSBitmapEditInspectorViewController *_inspectorViewController;
    long long _currentMode;
    NSBezierPath *_accumulatedSelection;
    MSBitmapRectangleEditor *_rectangleEditor;
    MSBitmapMagicWandEditor *_magicWandEditor;
    NSBitmapImageRep *_backupImageRep;
    NSBitmapImageRep *_cachedFirstBitmapImageRep;
    NSCursor *_currentCursor;
}

@property(retain, nonatomic) NSCursor *currentCursor; // @synthesize currentCursor=_currentCursor;
@property(retain, nonatomic) NSBitmapImageRep *cachedFirstBitmapImageRep; // @synthesize cachedFirstBitmapImageRep=_cachedFirstBitmapImageRep;
@property(retain, nonatomic) NSBitmapImageRep *backupImageRep; // @synthesize backupImageRep=_backupImageRep;
@property(retain, nonatomic) MSBitmapMagicWandEditor *magicWandEditor; // @synthesize magicWandEditor=_magicWandEditor;
@property(retain, nonatomic) MSBitmapRectangleEditor *rectangleEditor; // @synthesize rectangleEditor=_rectangleEditor;
@property(retain, nonatomic) NSBezierPath *accumulatedSelection; // @synthesize accumulatedSelection=_accumulatedSelection;
@property(nonatomic) long long currentMode; // @synthesize currentMode=_currentMode;
- (void).cxx_destruct;
- (BOOL)shouldHideExportBar;
- (BOOL)inspectorShouldShowLayerSpecificProperties;
- (unsigned long long)inspectorLocation;
@property(readonly, nonatomic) MSBitmapEditInspectorViewController *inspectorViewController; // @synthesize inspectorViewController=_inspectorViewController;
- (id)crossHairCursorRemove;
- (id)crossHairCursorAdd;
- (id)crossHairCursor;
- (id)magicWandCursorRemove;
- (id)magicWandCursorAdd;
- (id)magicWandCursor;
- (BOOL)mouseDraggedOutsideViewShouldMoveScrollOrigin;
- (void)makeNewBackupImage;
- (void)setImage:(id)arg1 forBitmapLayer:(id)arg2;
- (id)bitmapLayer;
- (id)coordinateTransformMatrix;
- (void)drawSizeLabel;
- (void)drawBorderAroundBounds;
- (void)drawInRect:(struct CGRect)arg1 cache:(id)arg2;
- (BOOL)shouldDrawLayerSelection;
- (id)selectionBezierForFlippingCoordinates;
- (struct CGRect)imageBounds;
- (struct CGSize)imageSize;
- (void)clearAreaUnderSelection;
- (void)fillSelectionWithColor:(id)arg1 blending:(unsigned long long)arg2;
- (void)fillSelectionWithColor:(id)arg1;
- (void)duplicate:(id)arg1;
- (BOOL)canDuplicate;
- (void)paste:(id)arg1;
- (void)copy:(id)arg1;
- (void)cut:(id)arg1;
- (void)keyDown:(id)arg1;
- (void)selectLayerBelowPoint:(struct CGPoint)arg1;
- (BOOL)absoluteMouseUp:(struct CGPoint)arg1 flags:(unsigned long long)arg2;
- (BOOL)absoluteMouseDragged:(struct CGPoint)arg1 flags:(unsigned long long)arg2;
- (BOOL)absoluteMouseDown:(struct CGPoint)arg1 clickCount:(unsigned long long)arg2 flags:(unsigned long long)arg3;
- (BOOL)absoluteMouseMoved:(struct CGPoint)arg1 flags:(unsigned long long)arg2;
- (void)flagsChanged:(id)arg1;
- (BOOL)rectIsCropOfImage:(struct CGRect)arg1 fromImage:(id)arg2;
- (void)cropLayerFrame;
- (id)imageFromSelectedArea;
- (id)bitmapLayerFromSelectedArea;
- (void)cropAction:(id)arg1;
- (struct CGRect)selectedRect;
- (struct CGRect)rectFromBitmapToBoundsCoordinates:(struct CGRect)arg1;
- (struct CGRect)selectionRectInLayerCoordinates;
- (void)invertAction:(id)arg1;
- (void)selectionDidChangeTo:(id)arg1;
- (void)handlerWillLoseFocus;
- (void)handlerGotFocus;
- (id)toolbarIdentifier;
- (void)dealloc;

@end

