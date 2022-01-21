/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import "RNVIAudioFileManager.h"


@interface RNVIAudioFileManager()
@property(nonatomic, strong) NSMutableDictionary<NSString *, VIAudioFile *> *audioFiles;
@end

@implementation RNVIAudioFileManager

+ (RNVIAudioFileManager *)getInstance {
    static dispatch_once_t onceToken;
    static RNVIAudioFileManager *audioFileManager;
    dispatch_once(&onceToken, ^{
        audioFileManager = [RNVIAudioFileManager new];
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
    [[RNVIAudioFileManager getInstance].audioFiles setObject:audioFile forKey:fileId];
}

+ (VIAudioFile *)getAudioFileById:(NSString *)fileId {
    if (fileId) {
        return [[RNVIAudioFileManager getInstance].audioFiles objectForKey:fileId];
    }
    return nil;
}

+ (NSString *)fileIdForAudioFile:(VIAudioFile *)audioFile {
    NSArray<NSString *> *fileId = [[RNVIAudioFileManager getInstance].audioFiles allKeysForObject:audioFile];
    if (fileId.count != 1) {
        return nil;
    }
    return [fileId objectAtIndex:0];
}

+ (void)removeAudioFile:(NSString *)fileId {
    if (fileId) {
        VIAudioFile *audioFile = [[RNVIAudioFileManager getInstance].audioFiles objectForKey:fileId];
        audioFile.delegate = nil;
        [[RNVIAudioFileManager getInstance].audioFiles removeObjectForKey:fileId];
    }
}

@end
