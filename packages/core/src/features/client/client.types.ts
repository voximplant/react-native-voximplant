/**
 * Enum that represents the states of a client.
 */
export enum ClientState {
  /**
   * Client is disconnected.
   */
  Disconnected = 'DISCONNECTED',

  /**
   * Client is disconnecting.
   */
  Disconnecting = 'DISCONNECTING',

  /**
   * Client is connecting.
   */
  Connecting = 'CONNECTING',

  /**
   * Client is connected.
   */
  Connected = 'CONNECTED',

  /**
   * Client is logging in.
   */
  LoggingIn = 'LOGGING_IN',

  /**
   * Client is logged in.
   */
  LoggedIn = 'LOGGED_IN',

  /**
   * Client is reconnecting.
   */
  Reconnecting = 'RECONNECTING',
}

/**
 * Enum that represents reasons why the client was disconnected.
 */
export enum ClientDisconnectReason {
  /**
   * Client was already disconnected.
   */
  AlreadyDisconnected = 'ALREADY_DISCONNECTED',

  /**
   * Client disconnected because the app moved to the background.
   */
  AppMovedToBackground = 'APP_MOVED_TO_BACKGROUND',

  /**
   * Client disconnected by user request.
   */
  UserInitiated = 'USER_INITIATED',

  /**
   * Connection to the Voximplant Cloud was lost.
   */
  ConnectionLost = 'CONNECTION_LOST',
}
