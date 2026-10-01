/**
 * Base error for login.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

/**
 * Internal error.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginInternalError extends LoginError {
  constructor(message = 'Internal error') {
    super(message);
    this.name = 'LoginInternalError';
  }
}

/**
 * Unknown login error.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginUnknownError extends LoginError {
  constructor(message = 'Unknown error') {
    super(message);
    this.name = 'LoginUnknownError';
  }
}

/**
 * User account is frozen.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginAccountFrozenError extends LoginError {
  constructor(message = 'Account frozen') {
    super(message);
    this.name = 'LoginAccountFrozenError';
  }
}

/**
 * Operation has been interrupted by another client operation.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginInterruptedError extends LoginError {
  constructor(message = 'Interrupted') {
    super(message);
    this.name = 'LoginInterruptedError';
  }
}

/**
 * Invalid password or token.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginInvalidPasswordError extends LoginError {
  constructor(message = 'Invalid password') {
    super(message);
    this.name = 'LoginInvalidPasswordError';
  }
}

/**
 * Operation is performed in incorrect state, for example if the client is not connected, currently logging in, or already logged in.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginInvalidStateError extends LoginError {
  constructor(message = 'Invalid client state') {
    super(message);
    this.name = 'LoginInvalidStateError';
  }
}

/**
 * Invalid username.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginInvalidUsernameError extends LoginError {
  constructor(message = 'Invalid username') {
    super(message);
    this.name = 'LoginInvalidUsernameError';
  }
}

/**
 * Monthly Active Users (MAU) limit is reached. Payment is required.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginMauAccessDeniedError extends LoginError {
  constructor(message = 'MAU limit reached') {
    super(message);
    this.name = 'LoginMauAccessDeniedError';
  }
}

/**
 * Login failed due to network issues.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginNetworkIssuesError extends LoginError {
  constructor(message = 'Network issues') {
    super(message);
    this.name = 'LoginNetworkIssuesError';
  }
}

/**
 * Login failed due to timeout.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginTimeoutError extends LoginError {
  constructor(message = 'Timeout') {
    super(message);
    this.name = 'LoginTimeoutError';
  }
}

/**
 * Token expired.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginTokenExpiredError extends LoginError {
  constructor(message = 'Token expired') {
    super(message);
    this.name = 'LoginTokenExpiredError';
  }
}

/**
 * Invalid argument passed to a login operation.
 *
 * @folder LoginErrors
 * @hideconstructor
 */
export class LoginInvalidArgumentError extends LoginError {
  constructor(message = 'Invalid argument') {
    super(message);
    this.name = 'LoginInvalidArgumentError';
  }
}
