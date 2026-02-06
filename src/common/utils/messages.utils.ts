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
  },
};
