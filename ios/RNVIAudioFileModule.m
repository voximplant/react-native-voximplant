
#import "RNVIAudioFileModule.h"
#import "RNVIAudioFileManager.h"
#import "RNVIConstants.h"
#import "RNVIUtils.h"

@interface RNVIAudioFileModule()
@end

@implementation RNVIAudioFileModule
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[
        kEventAudioFileStarted,
        kEventAudioFileStopped
    ];
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_REMAP_METHOD(initWithFile, initWithFile:(NSDictionary *)params responseCallback:(RCTResponseSenderBlock)callback) {
    NSString *filename = [params objectForKey:@"name"];
    NSString *filetype = [params objectForKey:@"type"];
    if (!filename || !filetype) {
        callback(@[[NSNull null], @"Invalid arguments"]);
        return;
    }
    NSString *path = [[NSBundle mainBundle] pathForResource:filename ofType:filetype];
    if (!path) {
        callback(@[[NSNull null], @"Failed to locate audio file"]);
        return;
    }
    NSURL *fileURL = [NSURL fileURLWithPath:path];
    VIAudioFile *audioFile = [[VIAudioFile alloc] initWithURL:fileURL looped:false];
    audioFile.delegate = self;
    NSString *fileId = [NSUUID UUID].UUIDString;
    [RNVIAudioFileManager addAudioFile:audioFile fileId:fileId];
    callback(@[fileId]);
}

RCT_REMAP_METHOD(loadFile, loadFile:(NSDictionary *)params responseCallback:(RCTResponseSenderBlock)callback) {
    NSString *stringURL = [params objectForKey:@"url"];
    NSURL *url = [NSURL URLWithString:stringURL];
    NSURLSessionDataTask *task = [NSURLSession.sharedSession dataTaskWithURL:url
                                                           completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (error) {
            callback(@[[NSNull null], @"Failed to load audio file"]);
        } else {
            VIAudioFile *audioFile = [[VIAudioFile alloc] initWithData:data looped:false];
            audioFile.delegate = self;
            NSString *fileId = [NSUUID UUID].UUIDString;
            [RNVIAudioFileManager addAudioFile:audioFile fileId:fileId];
            callback(@[fileId, [NSNull null]]);
        }
    }];
    [task resume];
}

RCT_REMAP_METHOD(play, play:(NSString *)fileId looped:(BOOL)looped) {
    VIAudioFile * audioFile = [RNVIAudioFileManager getAudioFileById:fileId];
    audioFile.looped = looped;
    [audioFile play];
}

RCT_EXPORT_METHOD(stop:(NSString *)fileId) {
    VIAudioFile * audioFile = [RNVIAudioFileManager getAudioFileById:fileId];
    [audioFile stop];
}

RCT_EXPORT_METHOD(releaseResources:(NSString *)fileId) {
    [RNVIAudioFileManager removeAudioFile:fileId];
}

- (void)audioFile:(VIAudioFile *)audioFile didStartPlaying:(NSError *)playbackError {
    NSString *fileId = [RNVIAudioFileManager fileIdForAudioFile:audioFile];
    NSNumber *result = [NSNumber numberWithBool:(playbackError == nil)];
    if (fileId) {
        [self sendEventWithName:kEventAudioFileStarted body:@{
            kEventParamName        : kEventNameAudioFileStarted,
            kEventParamResult      : result,
            kEventParamError       : [RNVIUtils convertAudioFileErrorToString:playbackError.code],
            kEventParamAudioFileId : fileId
        }];
    }
}

- (void)audioFile:(VIAudioFile *)audioFile didStopPlaying:(NSError *)playbackError {
    NSString *fileId = [RNVIAudioFileManager fileIdForAudioFile:audioFile];
    NSNumber *result = [NSNumber numberWithBool:(playbackError == nil)];
    if (fileId) {
        [self sendEventWithName:kEventAudioFileStopped body:@{
            kEventParamName        : kEventNameAudioFileStopped,
            kEventParamResult      : result,
            kEventParamError       : [RNVIUtils convertAudioFileErrorToString:playbackError.code],
            kEventParamAudioFileId : fileId
        }];
    }
}

@end
