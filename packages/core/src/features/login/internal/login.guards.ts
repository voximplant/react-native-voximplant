import type { LoginTokens } from '../login.types';
import { LoginErrorCode } from './login.errors';

/**
 * @hidden
 */
const LOGIN_TOKEN_KEYS: (keyof LoginTokens)[] = [
  'accessExpire',
  'accessToken',
  'refreshExpire',
  'refreshToken',
];

/**
 * @hidden
 */
export const isLoginTokens = (
  tokens: LoginTokens | null
): tokens is LoginTokens =>
  tokens != null &&
  LOGIN_TOKEN_KEYS.every((k) => typeof tokens[k] !== 'undefined');

/**
 * @hidden
 */
export const isLoginErrorCode = (code: string): code is LoginErrorCode =>
  Object.values(LoginErrorCode).includes(code as LoginErrorCode);
