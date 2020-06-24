/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import <VoxImplant/VoxImplant.h>

@interface VIAudioFileManager : NSObject

+ (void)addAudioFile:(VIAudioFile *)audioFile fileId:(NSString *)fileId;
+ (VIAudioFile *)getAudioFileById:(NSString *)fileId;
+ (NSString *)fileIdForAudioFile:(VIAudioFile *)audioFile;
+ (void)removeAudioFile:(NSString *)fileId;

@end
