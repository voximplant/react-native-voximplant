import { ClientDisconnectReason, ClientState } from '../client.types';

/**
 * @hidden
 */
export const isClientDisconnectReason = (
  reason: string
): reason is ClientDisconnectReason =>
  Object.values<string>(ClientDisconnectReason).includes(reason);

/**
 * @hidden
 */
export const isClientState = (state: string): state is ClientState =>
  Object.values<string>(ClientState).includes(state);
