import type { VideoStreamType } from '../video';

/**
 * ICE candidate type.
 *
 * @folder Stats
 */
export enum CandidateType {
  /**
   * Host candidate.
   */
  Host = 'HOST',

  /**
   * Peer reflexive candidate.
   */
  PeerReflexive = 'PEER_REFLEXIVE',

  /**
   * Relay candidate.
   */
  Relay = 'RELAY',

  /**
   * Server reflexive candidate.
   */
  ServerReflexive = 'SERVER_REFLEXIVE',

  /**
   * Unknown candidate type.
   */
  Unknown = 'UNKNOWN',
}

/**
 * Network type used for the connection.
 *
 * @folder Stats
 */
export enum NetworkType {
  /**
   * Cellular network.
   */
  Cellular = 'CELLULAR',

  /**
   * Ethernet connection.
   */
  Ethernet = 'ETHERNET',

  /**
   * Wi‑Fi connection.
   */
  Wifi = 'WIFI',

  /**
   * WiMAX connection.
   */
  Wimax = 'WIMAX',

  /**
   * VPN connection.
   */
  Vpn = 'VPN',

  /**
   * Unknown network type.
   */
  Unknown = 'UNKNOWN',
}

/**
 * Interface that represents the media connectivity statistics.
 *
 * @folder Stats
 */
export interface ConnectionStatsReport {
  /**
   * Available outgoing bitrate calculated by the underlying congestion control by combining the available bitrate
   * for all the outgoing RTP streams with the current selected candidate pair.
   */
  availableOutgoingBitrate: number;

  /**
   * Represents the latest round trip time measured in seconds
   */
  rtt: number;

  /**
   * Local ICE candidate type
   */
  localCandidateType: CandidateType | null;

  /**
   * Remote ICE candidate type
   */
  remoteCandidateType: CandidateType | null;

  /**
   * Network type used for the connection
   */
  networkType: NetworkType;
}

/**
 * Interface that represents statistics for all active outgoing audio streams.
 *
 * @folder Stats
 */
export interface LocalAudioStatsReport {
  /**
   * Audio codec name for an audio stream
   */
  codec: string | null;

  /**
   * Total number of bytes sent within an audio stream
   */
  bytesSent: number;
  /**
   * Total number of packets sent within an audio stream
   */
  packetsSent: number;

  /**
   * Total number of audio packets lost for the audio stream
   */
  packetsLost: number;
  /**
   * Audio level value is in the 0..1 range (linear), where 1.0 represents 0 dBov, 0 represents silence, and
   * 0.5 represents approximately 6 dBSPL change in the sound pressure level from 0 dBov.
   */
  audioLevel: number;
}

/**
 * Statistics for the video stream layers.
 *
 * @folder Stats
 */
export interface LocalVideoLayerStats {
  /**
   * Encoding layer identifier.
   *
   * Returns null for calls and if the simulcast feature is disabled for a conference.
   */
  rid: string | null;

  /**
   * Total number of bytes sent within a video stream
   */
  bytesSent: number;
  /**
   * Total number of packets sent within a video stream
   */
  packetsSent: number;
  /**
   * Total number of video packets lost for the video stream
   */
  packetsLost: number;
  /**
   * Video frame width sent within a video stream at the moment of the statistics collection
   */
  frameWidth: number;
  /**
   * Video frame height sent within a video stream at the moment of the statistics collection
   */
  frameHeight: number;
  /**
   * Number of complete frames in the last second
   */
  fps: number;
}

/**
 * Interface that represents statistics for an outgoing local video stream.
 *
 * @folder Stats
 */
export interface LocalVideoStatsReport {
  /**
   * Video codec name for a video stream
   */
  codec: string | null;
  /**
   * Statistics for the video stream layers
   */
  layers: LocalVideoLayerStats[];
  /**
   * Total number of bytes sent within a video stream
   */
  bytesSent: number;
  /**
   * Total number of packets sent within a video stream
   */
  packetsSent: number;
  /**
   * Video stream type
   */
  type: VideoStreamType;
  /**
   * Width of the video frame captured by a video source
   */
  sourceFrameWidth: number;
  /**
   * Height of the video frame captured by a video source
   */
  sourceFrameHeight: number;
  /**
   * Number of complete source frames in the last second
   */
  sourceFps: number;
}

/**
 * Interface that represents statistics for incoming audio streams.
 *
 * @folder Stats
 */
export interface RemoteAudioStatsReport {
  /**
   * Audio codec name for an audio stream
   */
  codec: string | null;
  /**
   * Total number of bytes received within an audio stream
   */
  bytesReceived: number;
  /**
   * Total number of packets received within an audio stream
   */
  packetsReceived: number;
  /**
   * Total number of audio packets lost for an audio stream
   */
  packetsLost: number;
  /**
   * Audio level value is in the 0..1 range (linear), where 1.0 represents 0 dBov, 0 represents silence,
   * and 0.5 represents approximately 6 dBSPLchange in the sound pressure level from 0 dBov.
   */
  audioLevel: number;
}

/**
 * Interface that represents statistics for incoming video streams.
 *
 * @folder Stats
 */
export interface RemoteVideoStatsReport {
  /**
   * Video codec name for a video stream
   */
  codec: string | null;
  /**
   * Total number of bytes received within a video stream
   */
  bytesReceived: number;
  /**
   * Total number of packets received within a video stream
   */
  packetsReceived: number;
  /**
   * Total number of video packets lost for a video stream
   */
  packetsLost: number;
  /**
   * Video frame width received within a video stream at the moment of the statistics collection
   */
  frameWidth: number;
  /**
   * Video frame height received within a video stream at the moment of the statistics collection
   */
  frameHeight: number;
  /**
   * Number of complete frames in the last second
   */
  fps: number;
  /**
   * Type of the video stream
   */
  type: VideoStreamType;
}

/**
 * Type that represents local audio streams reports by a local audio stream id.
 *
 * @folder Stats
 */
export type LocalAudioStreamStatsReport = Record<string, LocalAudioStatsReport>;

/**
 * Type that represents local video streams reports by a local video stream id.
 *
 * @folder Stats
 */
export type LocalVideoStreamStatsReport = Record<string, LocalVideoStatsReport>;

/**
 * Type that represents remote audio streams reports by a remote audio stream id.
 *
 * @folder Stats
 */
export type RemoteAudioStreamStatsReport = Record<
  string,
  RemoteAudioStatsReport
>;

/**
 * Type that represents remote video streams reports by a remote video stream id.
 *
 * @folder Stats
 */
export type RemoteVideoStreamStatsReport = Record<
  string,
  RemoteVideoStatsReport
>;
