//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "MSCloudAPI.h"

@interface MSCloudShareAPI : MSCloudAPI
{
}

- (void)checkUploadStatusForShare:(id)arg1 completionHandler:(CDUnknownBlockType)arg2;
- (void)deleteShareWithID:(id)arg1 completionHandler:(CDUnknownBlockType)arg2;
- (void)fetchUserShareWithID:(id)arg1 completionHandler:(CDUnknownBlockType)arg2;
- (void)fetchUserSharesWithCompletionHandler:(CDUnknownBlockType)arg1;
- (id)baseURL;

@end

