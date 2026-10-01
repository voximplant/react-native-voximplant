/**
 * Auth parameters that can be used to log in via an access token.
 */
export interface LoginTokens {
  /**
   * Time in seconds for the access token to expire.
   */
  accessExpire: number;
  /**
   * Access token that can be used before accessExpire.
   */
  accessToken: string;
  /**
   * Time in seconds for the refresh token to expire.
   */
  refreshExpire: number;
  /**
   * Refresh token that can be used one time before refreshExpire.
   */
  refreshToken: string;
}

/**
 * Interface that is provided when the login process is completed successfully.
 */
export interface LoginResult {
  /**
   * Display name of the logged in user.
   */
  displayName: string;

  /**
   * Auth parameters that can be used to log in via an access token.
   */
  loginTokens: LoginTokens | null;
}
