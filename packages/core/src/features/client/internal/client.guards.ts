import { ClientDisconnectReason } from '../client.types';

/**
 * @hidden
 */
export const isClientDisconnectReason = (
  reason: string
): reason is ClientDisconnectReason =>
  Object.values<string>(ClientDisconnectReason).includes(reason);
