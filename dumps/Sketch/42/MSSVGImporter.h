//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "NSObject.h"

#import "MSImporter.h"

@class NSString, SVGImporter;

@interface MSSVGImporter : NSObject <MSImporter>
{
    SVGImporter *_importer;
    id _graph;
}

+ (id)svgImporter;
@property(retain, nonatomic) id graph; // @synthesize graph=_graph;
@property(retain, nonatomic) SVGImporter *importer; // @synthesize importer=_importer;
- (void).cxx_destruct;
- (BOOL)shouldCollapseSinglePage;
- (BOOL)shouldExpandPages;
- (id)secondPhaseSubtitleForValue:(long long)arg1 maximum:(long long)arg2;
- (id)firstPhaseSubtitle;
- (void)finishImporting;
- (id)importAsLayer;
- (void)importIntoGroup:(id)arg1 name:(id)arg2 progress:(CDUnknownBlockType)arg3;
- (unsigned long long)prepareToImportFromData:(id)arg1;
- (unsigned long long)prepareToImportFromURL:(id)arg1;

// Remaining properties
@property(readonly, copy) NSString *debugDescription;
@property(readonly, copy) NSString *description;
@property(readonly) unsigned long long hash;
@property(readonly) Class superclass;

@end

