export const AUTH_COOKIE_NAME = 'token';
export const AUTH_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day
export const AUTH_TOKEN_EXPIRES_IN = '1d';

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  maxAge: AUTH_COOKIE_MAX_AGE,
});

// Note: no maxAge here — Express's clearCookie() sets expires to the past,
// but a maxAge in the merged options overwrites that with a future date,
// which would silently fail to clear the cookie.
export const getClearAuthCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'None',
});
