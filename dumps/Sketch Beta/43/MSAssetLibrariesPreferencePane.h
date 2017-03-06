//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "MSPreferencePane.h"

#import "NSTableViewDataSource.h"
#import "NSTableViewDelegate.h"

@class MSAssetLibraryController, NSArray, NSMenu, NSString, NSTableView;

@interface MSAssetLibrariesPreferencePane : MSPreferencePane <NSTableViewDelegate, NSTableViewDataSource>
{
    BOOL _hasAssets;
    BOOL _hasSelectedAssetLibrary;
    NSTableView *_tableView;
    NSMenu *_contextMenu;
}

+ (id)toolbarIcon;
+ (id)title;
+ (id)identifier;
@property(nonatomic) BOOL hasSelectedAssetLibrary; // @synthesize hasSelectedAssetLibrary=_hasSelectedAssetLibrary;
@property(nonatomic) BOOL hasAssets; // @synthesize hasAssets=_hasAssets;
@property(retain, nonatomic) NSMenu *contextMenu; // @synthesize contextMenu=_contextMenu;
@property(nonatomic) __weak NSTableView *tableView; // @synthesize tableView=_tableView;
- (void).cxx_destruct;
- (void)togglePreview:(id)arg1;
- (void)showContextMenu:(id)arg1;
@property(readonly, nonatomic) NSArray *assetLibraries;
@property(readonly, nonatomic) MSAssetLibraryController *assetLibraryController;
- (void)removeLibraryAction:(id)arg1;
- (void)importLibraryAction:(id)arg1;
- (void)checkImportStatus:(long long)arg1 forURL:(id)arg2;
- (double)tableView:(id)arg1 heightOfRow:(long long)arg2;
- (id)tableView:(id)arg1 objectValueForTableColumn:(id)arg2 row:(long long)arg3;
- (long long)numberOfRowsInTableView:(id)arg1;
- (void)tableViewSelectionDidChange:(id)arg1;
- (void)awakeFromNib;

// Remaining properties
@property(readonly, copy) NSString *debugDescription;
@property(readonly, copy) NSString *description;
@property(readonly) unsigned long long hash;
@property(readonly) Class superclass;

@end

