import {
  createEventBus,
  createReadonlyWatchable,
  generateUUID,
  updateReadonlyWatchableValue,
  type AddEventListener,
  type DispatchEvent,
  type ListenerOptions,
  type ReadonlyWatchable,
  type RemoveEventListener,
} from '@voximplant/react-native-shared';
import {
  toConnectionError,
  type ConnectOptions,
} from '../../features/connection';
import {
  mapLoginResult,
  mapLoginTokens,
  toLoginError,
  type LoginResult,
  type LoginTokens,
} from '../../features/login';
import {
  toPushTokenError,
  type PushConfig,
  type PushPayload,
} from '../../features/push';
import NativeCore from '../../specs/core.native-spec';
import { ClientEvent, type AnyClientEvent } from './client.events';
import { ClientState } from './client.types';

/**
 * Client for managing the connection to the Voximplant cloud.
 * @hideconstructor
 */
export abstract class Client {
  private static instance: Client | null = null;

  /**
   * Returns the client instance.
   */
  public static getInstance(): Client {
    if (!Client.instance) {
      Client.instance = new ClientImpl();
    }
    return Client.instance;
  }

  protected constructor() {}

  /**
   * Watchable property that allows getting the current client state and observing its changes.
   */
  abstract readonly state: ReadonlyWatchable<ClientState>;

  /**
   * @reinterpret Core.DocClientAddEventListener
   */
  abstract addEventListener: AddEventListener<AnyClientEvent>;

  /**
   * @reinterpret Core.DocClientRemoveEventListener
   */
  abstract removeEventListener: RemoveEventListener<AnyClientEvent>;

  /**
   * Connects to the Voximplant Cloud.
   *
   * Returns a promise that is resolved when the connection is established.
   *
   * @param options Connect options.
   * @throws
   * - [Core.ConnectionErrors.ConnectionInvalidStateError] If the client is not disconnected
   * - [Core.ConnectionErrors.ConnectionNetworkIssuesError] If the connection closes because of network issues
   * - [Core.ConnectionErrors.ConnectionTimeoutError] If the connection times out
   * - [Core.ConnectionErrors.ConnectionInterruptedError] If [Core.Client.disconnect] has interrupted the connection
   */
  abstract connect(options: ConnectOptions): Promise<void>;

  /**
   * Disconnects from the Voximplant Cloud.
   *
   * Returns a promise that is resolved when the connection is closed.
   */
  abstract disconnect(): Promise<void>;

  /**
   * Logs in to the Voximplant Cloud with a password.
   *
   * Returns a promise that is resolved to a [Core.LoginResult] object.
   *
   * @param username Username.
   * @param password Password.
   * @throws One of [Core.LoginError]
   */
  abstract login(username: string, password: string): Promise<LoginResult>;

  /**
   * Logs in to the Voximplant Cloud with a one-time key.
   *
   * Returns a promise that is resolved to a [Core.LoginResult] object.
   *
   * @param username Username.
   * @param hash One-time key hash.
   * @throws One of [Core.LoginError]
   */
  abstract loginWithOneTimeKey(
    username: string,
    hash: string
  ): Promise<LoginResult>;

  /**
   * Logs in to the Voximplant Cloud with an access token.
   *
   * Returns a promise that is resolved to a [Core.LoginResult] object.
   *
   * @param username Username.
   * @param accessToken Access token.
   * @throws One of [Core.LoginError]
   */
  abstract loginWithAccessToken(
    username: string,
    accessToken: string
  ): Promise<LoginResult>;

  /**
   * Generates a one-time login key for the automated login process.
   *
   * For additional information please see the [guide](/docs/guides/sdk/authorization-onetimekey).
   *
   * Returns a promise that is resolved to the one-time key string.
   *
   * @param username Username.
   * @throws One of [Core.LoginError]
   */
  abstract requestOneTimeKey(username: string): Promise<string>;

  /**
   * Refreshes login tokens required for [Core.Client.loginWithAccessToken].
   *
   * Returns a promise that is resolved to a [Core.LoginTokens] object.
   *
   * @param username Username.
   * @param refreshToken Refresh token.
   * @throws One of [Core.LoginError]
   */
  abstract refreshTokens(
    username: string,
    refreshToken: string
  ): Promise<LoginTokens>;

  /**
   * Handles an incoming push notification payload.
   *
   * @param pushPayload Push notification payload.
   */
  abstract handlePushNotification(pushPayload: PushPayload): void;

  /**
   * Registers the device for push notifications.
   *
   * @param config Push notification configuration.
   * @throws
   * - [Core.PushTokenErrors.PushTokenInvalidTokenError] If the push token is invalid
   * - [Core.PushTokenErrors.PushTokenCancelledError] If the maximum number of unprocessed requests is reached
   * - [Core.PushTokenErrors.PushTokenConnectionClosedError] If the connection to the Voximplant Cloud has closed while a push token request is in progress
   * - [Core.PushTokenErrors.PushTokenTimeoutError] If the operation is not completed in time
   */
  abstract registerForPushNotifications(config: PushConfig): Promise<void>;

  /**
   * Unregisters the device from push notifications.
   *
   * @param config Push notification configuration.
   * @throws
   * - [Core.PushTokenErrors.PushTokenInvalidTokenError] If the push token is invalid
   * - [Core.PushTokenErrors.PushTokenCancelledError] If the maximum number of unprocessed requests is reached
   * - [Core.PushTokenErrors.PushTokenConnectionClosedError] If the connection to the Voximplant Cloud has closed while a push token request is in progress
   * - [Core.PushTokenErrors.PushTokenTimeoutError] If the operation is not completed in time
   */
  abstract unregisterFromPushNotifications(config: PushConfig): Promise<void>;
}

const watchableKey = generateUUID();

/**
 * @hidden
 */
class ClientImpl extends Client {
  public readonly state: ReadonlyWatchable<ClientState>;

  public addEventListener: AddEventListener<AnyClientEvent>;
  public removeEventListener: RemoveEventListener<AnyClientEvent>;
  private readonly dispatchEvent: DispatchEvent<AnyClientEvent>;

  constructor() {
    super();
    const { addEventListener, removeEventListener, dispatchEvent } =
      createEventBus<AnyClientEvent>();
    this.addEventListener = addEventListener;
    this.removeEventListener = removeEventListener;
    this.dispatchEvent = dispatchEvent;

    this.state = createReadonlyWatchable(
      NativeCore.getClientState(),
      watchableKey
    );
    this.bridgeNativeEvents();
  }

  public async connect(options: ConnectOptions): Promise<void> {
    try {
      await NativeCore.connect(options);
      updateReadonlyWatchableValue(
        this.state,
        NativeCore.getClientState(),
        watchableKey
      );
    } catch (err) {
      throw toConnectionError(err);
    }
  }

  public disconnect(): Promise<void> {
    return NativeCore.disconnect();
  }

  public async login(username: string, password: string): Promise<LoginResult> {
    try {
      const res = await NativeCore.login(username, password);
      return mapLoginResult(res);
    } catch (err) {
      throw toLoginError(err);
    }
  }

  public async loginWithOneTimeKey(
    username: string,
    hash: string
  ): Promise<LoginResult> {
    try {
      const res = await NativeCore.loginWithOneTimeKey(username, hash);
      return mapLoginResult(res);
    } catch (err) {
      throw toLoginError(err);
    }
  }

  public async loginWithAccessToken(
    username: string,
    accessToken: string
  ): Promise<LoginResult> {
    try {
      const res = await NativeCore.loginWithAccessToken(username, accessToken);
      return mapLoginResult(res);
    } catch (err) {
      throw toLoginError(err);
    }
  }

  public async requestOneTimeKey(username: string): Promise<string> {
    try {
      return await NativeCore.requestOneTimeKey(username);
    } catch (err) {
      throw toLoginError(err);
    }
  }

  public async refreshTokens(
    username: string,
    refreshToken: string
  ): Promise<LoginTokens> {
    try {
      const res = await NativeCore.refreshTokens(username, refreshToken);
      return mapLoginTokens(res);
    } catch (err) {
      throw toLoginError(err);
    }
  }

  public handlePushNotification(pushPayload: PushPayload): void {
    NativeCore.handlePushNotification(pushPayload);
  }

  public async registerForPushNotifications(config: PushConfig): Promise<void> {
    try {
      return await NativeCore.registerForPushNotifications(config);
    } catch (err) {
      throw toPushTokenError(err);
    }
  }

  public async unregisterFromPushNotifications(
    config: PushConfig
  ): Promise<void> {
    try {
      return await NativeCore.unregisterFromPushNotifications(config);
    } catch (err) {
      throw toPushTokenError(err);
    }
  }

  private bridgeNativeEvents(): void {
    NativeCore.onClientDisconnected((reason) => {
      updateReadonlyWatchableValue(
        this.state,
        NativeCore.getClientState(),
        watchableKey
      );

      this.dispatchEvent({
        name: ClientEvent.Disconnected,
        payload: {
          reason,
        },
      });
    });

    NativeCore.onClientReconnected(() => {
      updateReadonlyWatchableValue(
        this.state,
        NativeCore.getClientState(),
        watchableKey
      );
    });

    NativeCore.onClientReconnecting(() => {
      updateReadonlyWatchableValue(
        this.state,
        NativeCore.getClientState(),
        watchableKey
      );
    });
  }
}

/**
 * @interface
 * @internal
 *
 * Registers a handler for the specified event.
 *
 * One event can have more than one handler; handlers are executed in order of their registration.
 */
export type DocClientAddEventListener = (
  /**
   * Event name
   */
  eventName: ClientEvent,
  /**
   * Handler function that is triggered when an event of the specified type occurs
   */
  listener: (event: AnyClientEvent) => void | Promise<void>,
  /**
   * Object that specifies characteristics about the event listener
   */
  options: ListenerOptions
) => void;

/**
 * @interface
 * @internal
 *
 * Removes a previously registered handler for the specified event.
 */
export type DocClientRemoveEventListener = (
  /**
   * Event name
   */
  eventName: ClientEvent,
  /**
   * Handler function to remove from the event target
   */
  listener: (event: AnyClientEvent) => void | Promise<void>
) => void;
