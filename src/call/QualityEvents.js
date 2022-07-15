/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

/**
 * The events that are triggered by {@link Call} instance.
 * Use {@link Call.qualityIssues#on} to subscribe on any of these events.
 *
 * @memberOf Voximplant
 * @enum {string}
 * @type {{PacketLoss: string, CodecMismatch: string, LocalVideoDegradation: string, IceDisconnected: string, HighMediaLatency: string, NoAudioSignal: string, NoAudioReceive: string, NoVideoReceive: string}}
 */
const QualityEvents = {
  /**
   * Invoked on packet loss detection.
   * Packet loss can lead to missing of entire sentences, award pauses in the middle of a conversation or robotic voice during the call.
   * 
   * Issue level may vary during the call.
   * 
   * Possible reasons:
   * 
   * * Network congestion
   * * Bad hardware (parts of the network infrastructure)
   *
   * Handler function receives {@link EventHandlers.PacketLossEvent} object as an argument.
   */
  PacketLoss : 'PacketLoss',

  /**
   * Invoked if local video is encoded by a codec different from specified in {@link CallSettings.preferredVideoCodec}.
   * 
   * Issue level is {@link QualityIssueLevel.CRITICAL} if video is not sent, {@link QualityIssueLevel.MAJOR} in case of codec mismatch 
   * or {@link QualityIssueLevel.NONE} if the issue is not detected.
   * 
   * Possible reasons:
   * 
   * * The video is not sent for some reasons. In this case codec will be null
   * * Different codecs are specified in the call endpoints
   * 
   * Handler function receives {@link EventHandlers.CodecMismatchEvent} object as an argument.
   */
  CodecMismatch : 'CodecMismatch',

  /**
   * Invoked if the video resolution sent to the endpoint is lower than a captured video resolution.
   * As a result it affects remote video quality on the remote participant side,
   * but do not affect the quality of local video preview on the android application.
   * 
   * The issue level may vary during the call.
   * 
   * Possible reasons:
   * 
   * * High CPU load during the video call
   * * Network issues such as poor internet connection or low bandwidth
   * 
   * Handler function receives {@link EventHandlers.LocalVideoDegradationEvent} object as an argument.
   */
  LocalVideoDegradation : 'LocalVideoDegradation',

  /**
   * Invoked if ICE connection is switched to the "disconnected" state during the call.
   * 
   * Issue level is always {@link QualityIssueLevel.CRITICAL}, because there is no media in the call until the issue is resolved.
   * 
   * Event may be triggered intermittently and be resolved just as spontaneously on less reliable networks, or during temporary disconnections.
   * 
   * Possible reasons:
   * 
   * * Network issues
   * 
   * Handler function receives {@link EventHandlers.IceDisconnectedEvent} object as an argument.
   */
  IceDisconnected : 'IceDisconnected',

  /**
   * Invoked if network-based media latency is detected in the call.
   * Network-based media latency is calculated based on rtt (round trip time) and jitter buffer.
   * Latency refers to the time it takes a voice/video packet to reach its destination.
   * Sufficient latency causes call participants to speak over the top of each other.
   * 
   * Issue level may vary during the call.
   * 
   * Possible reasons:
   * 
   * * Network congestion/delays
   * * Lack of bandwidth
   * 
   * Handler function receives {@link EventHandlers.HighMediaLatencyEvent} object as an argument.
   */
  HighMediaLatency : 'HighMediaLatency',

  /**
   * Invoked if no audio is captured by the microphone.
   * Issue level can be only {@link QualityIssueLevel.CRITICAL} if the issue is detected or 
   * {@link QualityIssueLevel.NONE} if the issue is not detected or resolved.
   * 
   * Possible reasons:
   * 
   * * Access to microphone is denied
   * * Category of AVAudioSession is not AVAudioSessionCategoryPlayAndRecord
   * 
   * Handler function receives {@link EventHandlers.NoAudioSignalEvent} object as an argument.
   */
  NoAudioSignal : 'NoAudioSignal',

  /**
   * Invoked if no audio is received on the remote audio stream.
   * Issue level can be only {@link QualityIssueLevel.CRITICAL} if the issue is detected or 
   * {@link QualityIssueLevel.NONE} if the issue is not detected or resolved.
   * 
   * If no audio receive is detected on several remote audio streams, the event will be invoked for each of the remote audio streams with the issue.
   * 
   * If the issue level is {@link QualityIssueLevel.CRITICAL}, the event will not be invoked with the level {@link QualityIssueLevel.NONE} in cases:
   * 
   * * The (conference) call ended
   * * The endpoint left the conference call - {@link Endpoint.Removed} is invoked
   * 
   * The issue is not detected for the following cases:
   * 
   * * The endpoint put the call on hold via {@link Call.setHold}
   * * The endpoint stopped sending audio during a call via {@link Call.sendAudio}
   * 
   * Possible reasons:
   * 
   * * Poor internet connection on the client or the endpoint
   * * Connection lost on the endpoint
   * 
   * Handler function receives {@link EventHandlers.NoAudioReceiveEvent} object as an argument.
   */
  NoAudioReceive : 'NoAudioReceive',

  /**
   * Invoked if no video is received on the remote video stream.
   * 
   * Issue level can be only {@link QualityIssueLevel.CRITICAL} if the issue is detected or 
   * {@link QualityIssueLevel.NONE} if the issue is not detected or resolved.
   * 
   * If no video receive is detected on several remote video streams, the event will be invoked for each of the remote video streams with the issue.
   * 
   * If the issue level is {@link QualityIssueLevel.CRITICAL}, the event will not be invoked with the level {@link QualityIssueLevel.NONE} in cases:
   * 
   * * The (conference) call ended
   * * The remote video stream was removed - {@link Endpoint.RemoteVideoStreamRemoved} is invoked
   * * The endpoint left the conference call - {@link Endpoint.Removed} is invoked
   * 
   * The issue is not detected for the following cases:
   * 
   * * The endpoint put the call on hold via {@link Call.setHold}
   * * The endpoint stopped sending video during a call via {@link Call.setSendVideo}
   * * Video receiving was stopped on the remote video stream via {@link RemoteVideoStream.stopReceiving}
   * 
   * Possible reasons:
   * 
   * * Poor internet connection on the client or the endpoint
   * * Connection lost on the endpoint
   * * The endpoint's application has been moved to the background state on an iOS device (camera usage is prohibited while in the background on iOS)
   * 
   * Handler function receives {@link EventHandlers.NoVideoReceiveEvent} object as an argument.
   */
  NoVideoReceive : 'NoVideoReceive'
}

export default QualityEvents;