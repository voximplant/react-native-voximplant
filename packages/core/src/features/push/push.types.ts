import { type UnknownObject } from '@voximplant/react-native-shared';

/**
 * Interface that represents the push configuration.
 */
export interface PushConfig {
  /**
   * Push token.
   */
  token: string;

  /**
   * Bundle ID.
   */
  bundleId?: string;
}

/**
 * Interface that represents the push payload.
 */
export type PushPayload = UnknownObject;
