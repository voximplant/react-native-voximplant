import type { BaseBusEvent } from '@voximplant/react-native-shared';
import type { VideoSourceStopReason } from '../video.types';
import type { CameraVideoSourceErrorCode } from './internal';

/**
 * @folder Video.CameraVideoSourceEvents
 * @event
 */
export enum CameraVideoSourceEvent {
  /**
   * Triggered when the camera video source is started.
   */
  Started = 'STARTED',
  /**
   * Triggered when the camera video source is stopped.
   */
  Stopped = 'STOPPED',
  /**
   * Triggered when the camera video source fails.
   */
  Failed = 'FAILED',
}

/**
 * @hidden
 */
export interface BaseCameraVideoSourceEvent extends BaseBusEvent {
  name: CameraVideoSourceEvent;
}

/**
 * @folder Video.CameraVideoSourceEvents
 */
export interface CameraVideoSourceStarted extends BaseCameraVideoSourceEvent {
  name: CameraVideoSourceEvent.Started;
}

/**
 * @folder Video.CameraVideoSourceEvents
 */
export interface CameraVideoSourceStoppedPayload {
  /**
   * Reason for the camera video source to stop
   */
  reason: VideoSourceStopReason;
}

/**
 * @folder Video.CameraVideoSourceEvents
 */
export interface CameraVideoSourceStopped extends BaseCameraVideoSourceEvent {
  name: CameraVideoSourceEvent.Stopped;
  payload: CameraVideoSourceStoppedPayload;
}

/**
 * @folder Video.CameraVideoSourceEvents
 */
export interface CameraVideoSourceFailedPayload {
  /**
   * Code for the camera video source failure
   */
  code: CameraVideoSourceErrorCode;
  /**
   * Message for the camera video source failure
   */
  message: string;
}

/**
 * @folder Video.CameraVideoSourceEvents
 */
export interface CameraVideoSourceFailed extends BaseCameraVideoSourceEvent {
  name: CameraVideoSourceEvent.Failed;
  payload: CameraVideoSourceFailedPayload;
}

/**
 * @folder Video.CameraVideoSourceEvents
 */
export type AnyCameraVideoSourceEvent =
  | CameraVideoSourceStarted
  | CameraVideoSourceStopped
  | CameraVideoSourceFailed;
