export const Msgs = {
  users: {
    NOT_FOUND: () => 'User not found',
    NOT_FOUND_BY_EMAIL: (email: string) =>
      `User with email '${email}' not found`,
  },
  auth: {
    USER_ALREADY_EXISTS: () => 'User already exists',
    INVALID_OTP: () => 'Invalid or expired OTP',
    USER_NOT_FOUND: () => 'User not found',
    INVALID_CREDENTIALS: () => 'Invalid email or password',
    UNAUTHORIZED: () => 'Unauthorized access',
    token: {
      INVALID: () => 'Invalid or expired token',
      REQUIRED: () => 'Authentication token is required',
    },
  },

  common: {
    NOT_FOUND: (resource: string) => `${resource} not found`,
    SERVER_ERROR: () => 'An unexpected error occurred. Please try again later.',
    ACCESS_DENIED: () => 'You do not have permission to perform this action',
    MISSING_ENV: (key: string) => `Missing environment variable: ${key}`,
  },
};
