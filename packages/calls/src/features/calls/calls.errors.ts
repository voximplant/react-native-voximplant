import { CallErrorCode } from './internal';

/**
 * Base error for calls.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallError extends Error {
  public readonly code: CallErrorCode;

  constructor(code: CallErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'CallError';
  }
}

/**
 * Call is already in the requested state.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallAlreadyInThisStateError extends CallError {
  constructor(message = 'Call is already in this state') {
    super(CallErrorCode.AlreadyInThisState, message);
    this.name = 'CallAlreadyInThisStateError';
  }
}

/**
 * Operation is incorrect.
 *
 * For example, rejecting an outgoing call.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallIncorrectOperationError extends CallError {
  constructor(message = 'Incorrect operation') {
    super(CallErrorCode.IncorrectOperation, message);
    this.name = 'CallIncorrectOperationError';
  }
}

/**
 * Internal error occurred.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallInternalError extends CallError {
  constructor(message = 'Internal error') {
    super(CallErrorCode.InternalError, message);
    this.name = 'CallInternalError';
  }
}

/**
 * Operation cannot be performed because the call is in an invalid state.
 *
 * For example, the call is not connected or is reconnecting.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallInvalidCallStateError extends CallError {
  constructor(message = 'Invalid call state') {
    super(CallErrorCode.InvalidCallState, message);
    this.name = 'CallInvalidCallStateError';
  }
}

/**
 * Operation cannot be performed because the call is on hold.
 *
 * Unhold the call and repeat the operation.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallMediaIsOnHoldError extends CallError {
  constructor(message = 'Media is on hold') {
    super(CallErrorCode.MediaIsOnHold, message);
    this.name = 'CallMediaIsOnHoldError';
  }
}

/**
 * Operation is rejected.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallRejectedError extends CallError {
  constructor(message = 'Rejected') {
    super(CallErrorCode.Rejected, message);
    this.name = 'CallRejectedError';
  }
}

/**
 * Operation is not completed in time.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallTimeoutError extends CallError {
  constructor(message = 'Timeout') {
    super(CallErrorCode.Timeout, message);
    this.name = 'CallTimeoutError';
  }
}

/**
 * Operation cannot be performed due to a missing system permission.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallPermissionRequiredError extends CallError {
  constructor(message = 'Permission required') {
    super(CallErrorCode.PermissionRequired, message);
    this.name = 'CallPermissionRequiredError';
  }
}

/**
 * Unknown error.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallUnknownError extends CallError {
  constructor(message = 'Unknown error') {
    super(CallErrorCode.Unknown, message);
    this.name = 'CallUnknownError';
  }
}

/**
 * Operation cannot be performed because of an invalid argument.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallInvalidArgumentError extends CallError {
  constructor(message = 'Invalid argument') {
    super(CallErrorCode.InvalidArgument, message);
    this.name = 'CallInvalidArgumentError';
  }
}

/**
 * Operation was interrupted by another operation.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallInterruptedError extends CallError {
  constructor(message = 'Interrupted') {
    super(CallErrorCode.Interrupted, message);
    this.name = 'CallInterruptedError';
  }
}

/**
 * Operation cannot be performed because the camera was not found.
 *
 * @folder CallErrors
 * @hideconstructor
 */
export class CallCameraNotFoundError extends CallError {
  constructor(message = 'Camera not found') {
    super(CallErrorCode.CameraNotFound, message);
    this.name = 'CallCameraNotFoundError';
  }
}
