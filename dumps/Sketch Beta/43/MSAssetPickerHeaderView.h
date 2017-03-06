//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "NSView.h"

@class NSString;

@interface MSAssetPickerHeaderView : NSView
{
    id <MSAssetPickerHeaderViewDelegate> _delegate;
    NSString *_preferenceKey;
}

+ (id)headerPickerWithTitle:(id)arg1 isExpandedPreference:(id)arg2 delegate:(id)arg3;
@property(retain, nonatomic) NSString *preferenceKey; // @synthesize preferenceKey=_preferenceKey;
@property(nonatomic) __weak id <MSAssetPickerHeaderViewDelegate> delegate; // @synthesize delegate=_delegate;
- (void).cxx_destruct;
- (void)expandArrowWasClicked:(id)arg1;

@end

