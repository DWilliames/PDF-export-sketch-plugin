//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "NSObject.h"

#import "MSCoding.h"
#import "NSCopying.h"
#import "NSFastEnumeration.h"

@class NSMutableArray, NSString;

@interface MSPointArray : NSObject <MSCoding, NSCopying, NSFastEnumeration>
{
    NSMutableArray *points;
}

+ (id)pointArray;
- (void).cxx_destruct;
- (unsigned long long)countByEnumeratingWithState:(CDStruct_70511ce9 *)arg1 objects:(id *)arg2 count:(unsigned long long)arg3;
- (id)description;
- (BOOL)pointAtIndex:(unsigned long long)arg1 isEqualToPoint:(struct CGPoint)arg2;
- (void)removeAllPoints;
- (void)replacePointAtIndex:(unsigned long long)arg1 withPoint:(struct CGPoint)arg2;
- (id)copyWithZone:(struct _NSZone *)arg1;
- (void)encodeAsJSON:(id)arg1;
- (id)initWithUnarchiver:(id)arg1;
- (void)encodeWithArchiver:(id)arg1;
- (void)setPoints:(id)arg1;
- (id)points;
- (unsigned long long)countOfPoints;
- (void)removePoint:(struct CGPoint)arg1;
- (void)removePointAtIndex:(unsigned long long)arg1;
- (unsigned long long)indexOfPoint:(struct CGPoint)arg1;
- (struct CGPoint)pointAtIndex:(unsigned long long)arg1;
- (void)insertPoint:(struct CGPoint)arg1 atIndex:(unsigned long long)arg2;
- (void)addPoint:(struct CGPoint)arg1;
- (BOOL)isEqual:(id)arg1;
- (id)init;
- (id)treeAsDictionary;

// Remaining properties
@property(readonly, nonatomic) NSString *archiveReferenceIdentifier_bc;

@end

