//
//     Generated by class-dump 3.5 (64 bit).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2013 by Steve Nygard.
//

#import "NSArray.h"

@interface NSArray (BCFoundation)
+ (id)arrayByMergingArrays:(id)arg1;
- (unsigned long long)indexOfSubArray:(id)arg1;
- (id)rotateTwoDimensionalArray;
- (id)uniqueObjects;
- (id)subArrayToIndex:(unsigned long long)arg1;
- (id)objectAtIndexOrNil:(unsigned long long)arg1;
- (BOOL)isValidIndex:(unsigned long long)arg1;
- (id)dictionaryBySplittingArrayUsingKey:(id)arg1;
- (id)arrayByAddingObjects:(id)arg1;
- (id)arrayByRemovingObjects:(id)arg1;
- (id)arrayByRemovingObject:(id)arg1;
- (id)sortedArrayUsingKey:(id)arg1;
- (id)sortedArray;
- (id)arrayByRemovingNull;
- (BOOL)containsOnlyObjectsOfClass:(Class)arg1;
- (id)mutableCopyDeep;
- (id)copyDeep;
- (BOOL)containsObjectOfClass:(Class)arg1;
- (id)reversedArray;
- (void)enumerateTailUsingBlock:(CDUnknownBlockType)arg1;
- (id)tail;
- (id)filteredByObjectsOfClass:(Class)arg1;
- (id)filterWithIndex:(CDUnknownBlockType)arg1;
- (id)filter:(CDUnknownBlockType)arg1;
- (void)enumerateWithIndex:(CDUnknownBlockType)arg1;
- (void)enumerate:(CDUnknownBlockType)arg1;
- (id)mapWithIndex:(CDUnknownBlockType)arg1;
- (id)map:(CDUnknownBlockType)arg1;
@end

