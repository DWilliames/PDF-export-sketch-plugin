//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "CHSheetController.h"

@class NSButton, NSProgressIndicator, NSTextField;

@interface CHProgressSheet : CHSheetController
{
    NSTextField *textField;
    NSProgressIndicator *progress;
    NSTextField *titleField;
    NSTextField *subtitleField;
    NSButton *cancelButton;
    long long _maximum;
    long long _value;
}

@property(nonatomic) long long value; // @synthesize value=_value;
@property(nonatomic) long long maximum; // @synthesize maximum=_maximum;
- (void).cxx_destruct;
- (void)setIndeterminate:(BOOL)arg1;
- (void)setShowsCancelButton:(BOOL)arg1;
- (void)setSubtitle:(id)arg1;
- (void)setTitle:(id)arg1;
- (BOOL)isMaximum;
- (void)setMessage:(id)arg1;
- (void)incrementProgressBy:(long long)arg1;
- (void)incrementProgress;
- (void)setProgressMaximum:(long long)arg1;
- (void)awakeFromNib;

@end

