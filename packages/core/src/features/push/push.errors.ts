/**
 * Base error for push token.
 *
 * @folder PushTokenErrors
 * @hideconstructor
 */
export class PushTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PushTokenError';
  }
}

/**
 * Internal error.
 *
 * @folder PushTokenErrors
 * @hideconstructor
 */
export class PushTokenInternalError extends PushTokenError {
  constructor(message = 'Internal error') {
    super(message);
    this.name = 'PushTokenInternalError';
  }
}

/**
 * Unknown push token error.
 *
 * @folder PushTokenErrors
 * @hideconstructor
 */
export class PushTokenUnknownError extends PushTokenError {
  constructor(message = 'Unknown error') {
    super(message);
    this.name = 'PushTokenUnknownError';
  }
}

/**
 * Operation is cancelled because the maximum number of unprocessed requests is reached.
 *
 * @folder PushTokenErrors
 * @hideconstructor
 */
export class PushTokenCancelledError extends PushTokenError {
  constructor(message = 'Cancelled') {
    super(message);
    this.name = 'PushTokenCancelledError';
  }
}

/**
 * Connection to the Voximplant Cloud is closed while processing push token registration request.
 *
 * @folder PushTokenErrors
 * @hideconstructor
 */
export class PushTokenConnectionClosedError extends PushTokenError {
  constructor(message = 'Connection closed') {
    super(message);
    this.name = 'PushTokenConnectionClosedError';
  }
}

/**
 * Push token is invalid, for example an empty string.
 *
 * @folder PushTokenErrors
 * @hideconstructor
 */
export class PushTokenInvalidTokenError extends PushTokenError {
  constructor(message = 'Invalid token') {
    super(message);
    this.name = 'PushTokenInvalidTokenError';
  }
}

/**
 * Operation is not completed in time.
 *
 * @folder PushTokenErrors
 * @hideconstructor
 */
export class PushTokenTimeoutError extends PushTokenError {
  constructor(message = 'Timeout') {
    super(message);
    this.name = 'PushTokenTimeoutError';
  }
}

/**
 * Invalid argument passed to a push token operation.
 *
 * @folder PushTokenErrors
 * @hideconstructor
 */
export class PushTokenInvalidArgumentError extends PushTokenError {
  constructor(message = 'Invalid argument') {
    super(message);
    this.name = 'PushTokenInvalidArgumentError';
  }
}
