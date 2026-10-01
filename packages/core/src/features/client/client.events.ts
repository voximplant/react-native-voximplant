import type { BaseBusEvent } from '@voximplant/react-native-shared';
import type { ClientDisconnectReason } from './client.types';

/**
 * Enum representing client events.
 * @folder ClientEvents
 * @event
 */
export enum ClientEvent {
  /**
   * Triggered when the client is disconnected.
   *
   * Listener is called with [Core.ClientEvents.ClientDisconnected] and payload:
   * @cast Core.ClientEvents.ClientDisconnectedPayload
   */
  Disconnected = 'DISCONNECTED',
}

/**
 * @hidden
 */
export interface BaseClientEvent extends BaseBusEvent {
  name: ClientEvent;
}

/**
 * @folder ClientEvents
 */
export interface ClientDisconnectedPayload {
  /**
   * Disconnect reason
   */
  reason: ClientDisconnectReason;
}

/**
 * @folder ClientEvents
 */
export interface ClientDisconnected extends BaseClientEvent {
  readonly name: ClientEvent.Disconnected;
  readonly payload: ClientDisconnectedPayload;
}

/**
 * @folder ClientEvents
 */
export type AnyClientEvent = ClientDisconnected;
