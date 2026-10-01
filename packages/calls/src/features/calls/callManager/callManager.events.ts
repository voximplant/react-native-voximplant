import type {
  BaseBusEvent,
  ExtraHeaders,
} from '@voximplant/react-native-shared';
import type { CallId } from '../call';

/**
 * @folder CallManagerEvents
 * @event
 */
export enum CallManagerEvent {
  /**
   * Triggered when an incoming call arrives to the current user.
   *
   * Listener is called with [Calls.CallManagerEvents.CallManagerIncomingCall] and payload:
   * @cast Calls.CallManagerEvents.CallManagerIncomingCallPayload
   */
  IncomingCall = 'INCOMING_CALL',
}

/**
 * @hidden
 */
export interface BaseCallManagerEvent extends BaseBusEvent {
  name: CallManagerEvent;
}

/**
 * @folder CallManagerEvents
 */
export interface CallManagerIncomingCallPayload {
  /**
   * Call id
   */
  callId: CallId;
  /**
   * Whether the incoming call has video
   */
  withVideo: boolean;
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder CallManagerEvents
 */
export interface CallManagerIncomingCall extends BaseCallManagerEvent {
  name: CallManagerEvent.IncomingCall;
  payload: CallManagerIncomingCallPayload;
}

/**
 * @folder CallManagerEvents
 */
export type AnyCallManagerEvent = CallManagerIncomingCall;
