/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import "VIAudioFileManager.h"


@interface VIAudioFileManager()
@property(nonatomic, strong) NSMutableDictionary<NSString *, VIAudioFile *> *audioFiles;
@end

@implementation VIAudioFileManager

+ (VIAudioFileManager *)getInstance {
    static dispatch_once_t onceToken;
    static VIAudioFileManager *audioFileManager;
    dispatch_once(&onceToken, ^{
        audioFileManager = [VIAudioFileManager new];
    });
    return audioFileManager;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.audioFiles = [NSMutableDictionary dictionary];
    }
    return self;
}

+ (void)addAudioFile:(VIAudioFile *)audioFile fileId:(NSString *)fileId {
    [[VIAudioFileManager getInstance].audioFiles setObject:audioFile forKey:fileId];
}

+ (VIAudioFile *)getAudioFileById:(NSString *)fileId {
    if (fileId) {
        return [[VIAudioFileManager getInstance].audioFiles objectForKey:fileId];
    }
    return nil;
}

+ (NSString *)fileIdForAudioFile:(VIAudioFile *)audioFile {
    NSArray<NSString *> *fileId = [[VIAudioFileManager getInstance].audioFiles allKeysForObject:audioFile];
    if (fileId.count != 1) {
        return nil;
    }
    return [fileId objectAtIndex:0];
}

+ (void)removeAudioFile:(NSString *)fileId {
    if (fileId) {
        VIAudioFile *audioFile = [[VIAudioFileManager getInstance].audioFiles objectForKey:fileId];
        audioFile.delegate = nil;
        [[VIAudioFileManager getInstance].audioFiles removeObjectForKey:fileId];
    }
}

@end
