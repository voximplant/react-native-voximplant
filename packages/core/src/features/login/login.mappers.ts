import {
  assertUnreachable,
  isNativeError,
} from '@voximplant/react-native-shared';
import { isLoginErrorCode, isLoginTokens, LoginErrorCode } from './internal';
import {
  LoginAccountFrozenError,
  LoginInternalError,
  LoginInterruptedError,
  LoginInvalidArgumentError,
  LoginInvalidPasswordError,
  LoginInvalidStateError,
  LoginInvalidUsernameError,
  LoginMauAccessDeniedError,
  LoginNetworkIssuesError,
  LoginTimeoutError,
  LoginTokenExpiredError,
  LoginUnknownError,
  type LoginError,
} from './login.errors';
import type { LoginResult, LoginTokens } from './login.types';

/**
 * @hidden
 */
export const toLoginError = (err: unknown): LoginError => {
  if (!isNativeError(err, isLoginErrorCode)) {
    return new LoginUnknownError();
  }

  switch (err.code) {
    case LoginErrorCode.AccountFrozen:
      return new LoginAccountFrozenError(err.message);
    case LoginErrorCode.InternalError:
      return new LoginInternalError(err.message);
    case LoginErrorCode.Interrupted:
      return new LoginInterruptedError(err.message);
    case LoginErrorCode.InvalidArgument:
      return new LoginInvalidArgumentError(err.message);
    case LoginErrorCode.InvalidPassword:
      return new LoginInvalidPasswordError(err.message);
    case LoginErrorCode.InvalidState:
      return new LoginInvalidStateError(err.message);
    case LoginErrorCode.InvalidUsername:
      return new LoginInvalidUsernameError(err.message);
    case LoginErrorCode.MauAccessDenied:
      return new LoginMauAccessDeniedError(err.message);
    case LoginErrorCode.NetworkIssues:
      return new LoginNetworkIssuesError(err.message);
    case LoginErrorCode.Timeout:
      return new LoginTimeoutError(err.message);
    case LoginErrorCode.TokenExpired:
      return new LoginTokenExpiredError(err.message);
    case LoginErrorCode.Unknown:
      return new LoginUnknownError(err.message);
    default:
      assertUnreachable(err.code);
      return new LoginUnknownError();
  }
};

/**
 * @hidden
 */
export const mapLoginResult = (nativeResult: LoginResult): LoginResult => {
  return {
    displayName: nativeResult.displayName,
    loginTokens: isLoginTokens(nativeResult.loginTokens)
      ? mapLoginTokens(nativeResult.loginTokens)
      : null,
  };
};

/**
 * @hidden
 */
export const mapLoginTokens = (nativeTokens: LoginTokens): LoginTokens => {
  return {
    accessExpire: nativeTokens.accessExpire,
    accessToken: nativeTokens.accessToken,
    refreshExpire: nativeTokens.refreshExpire,
    refreshToken: nativeTokens.refreshToken,
  };
};
