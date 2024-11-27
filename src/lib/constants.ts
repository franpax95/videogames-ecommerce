export enum API_ERROR {
  INVALID_CREDENTIALS = '__INVALID_CREDENTIALS__',
  INCORRECT_CREDENTIALS = '__INCORRECT_CREDENTIALS__',
  SERVER_ERROR = '__SERVER_ERROR__',
  SESSION_EXPIRED = '__SESSION_EXPIRED__',
  SESSION_INVALID = '__SESSION_INVALID__',
  METHOD_NOT_ALLOWED = '__METHOD_NOT_ALLOWED__'
}

export enum STRAPI_API_VALIDATION_MESSAGES {
  CHANGE_PASSWORD_MISMATCH = 'Passwords do not match',
  CHANGE_PASSWORD_SAME_PASSWORD = 'Your new password must be different than your current password',
  CHANGE_PASSWORD_BAD_CURRENT_PASSWORD = 'The provided current password is invalid'
}

const constants = {
  cookies: {
    sessionCookieId: 'app-session'
  },
  endpoints: {
    address: 'addresses',
    addressType: 'address-types',
    auth: 'auth',
    user: 'users'
  }
};

export default constants;
