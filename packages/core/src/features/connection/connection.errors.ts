/**
 * Base error for connection.
 *
 * @folder ConnectionErrors
 * @hideconstructor
 */
export class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}

/**
 * Internal error.
 *
 * @folder ConnectionErrors
 * @hideconstructor
 */
export class ConnectionInternalError extends ConnectionError {
  constructor(message: string = 'Internal error') {
    super(message);
    this.name = 'ConnectionInternalError';
  }
}

/**
 * Unknown connection error.
 *
 * @folder ConnectionErrors
 * @hideconstructor
 */
export class ConnectionUnknownError extends ConnectionError {
  constructor(message: string = 'Unknown error') {
    super(message);
    this.name = 'ConnectionUnknownError';
  }
}

/**
 * Connection to the Voximplant Cloud has been interrupted by [Core.Client.disconnect].
 *
 * @folder ConnectionErrors
 * @hideconstructor
 */
export class ConnectionInterruptedError extends ConnectionError {
  constructor(message: string = 'Interrupted') {
    super(message);
    this.name = 'ConnectionInterruptedError';
  }
}

/**
 * Invalid state, for example if [Core.Client.connect] is called when the client is not disconnected.
 *
 * @folder ConnectionErrors
 * @hideconstructor
 */
export class ConnectionInvalidStateError extends ConnectionError {
  constructor(message: string = 'Invalid client state') {
    super(message);
    this.name = 'ConnectionInvalidStateError';
  }
}

/**
 * Connection to the Voximplant Cloud is closed due to network issues.
 *
 * @folder ConnectionErrors
 * @hideconstructor
 */
export class ConnectionNetworkIssuesError extends ConnectionError {
  constructor(message: string = 'Network issues') {
    super(message);
    this.name = 'ConnectionNetworkIssuesError';
  }
}

/**
 * Connect failed due to timeout.
 *
 * @folder ConnectionErrors
 * @hideconstructor
 */
export class ConnectionTimeoutError extends ConnectionError {
  constructor(message: string = 'Timeout') {
    super(message);
    this.name = 'ConnectionTimeoutError';
  }
}

/**
 * Invalid argument passed to a connection operation.
 *
 * @folder ConnectionErrors
 * @hideconstructor
 */
export class ConnectionInvalidArgumentError extends ConnectionError {
  constructor(message: string = 'Invalid argument') {
    super(message);
    this.name = 'ConnectionInvalidArgumentError';
  }
}
