//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "_MSSharedObject.h"

#import "MSSharedObject.h"

@class NSObject<NSCopying><NSCoding>, NSString;

@interface MSSharedObject : _MSSharedObject <MSSharedObject>
{
}

- (id)parentGroup;
- (unsigned long long)type;
- (BOOL)isOutOfSyncWithInstance:(struct MSModelObject *)arg1;
- (struct MSModelObject *)newInstance;
- (BOOL)isSharedObjectForInstance:(struct MSModelObject *)arg1;
- (void)unregisterInstance:(struct MSModelObject *)arg1;
- (void)registerInstance:(struct MSModelObject *)arg1;
- (void)objectDidInit;
- (id)initWithName:(id)arg1 sharedObjectID:(id)arg2 value:(struct MSModelObject *)arg3;
- (id)initWithName:(id)arg1 firstInstance:(struct MSModelObject *)arg2;

// Remaining properties
@property(readonly, copy) NSString *debugDescription;
@property(readonly, copy) NSString *description;
@property(readonly) unsigned long long hash;
@property(readonly, copy, nonatomic) NSString *name;
@property(readonly, copy, nonatomic) NSObject<NSCopying><NSCoding> *objectID;
@property(readonly) Class superclass;
@property(readonly, nonatomic) id <MSModelObjectCommon> valueGeneric; // @dynamic valueGeneric;

@end
