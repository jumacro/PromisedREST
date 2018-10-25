import HttpStatus from 'http-status';

import APIError from './APIError';

class ErrorHandler {

  constructor(error) {
    this.Error = error;
    if (this.Error.name) {
      if (this.Error.name === 'MongoError') {
        if ((this.Error.code === 11000) || (this.Error.code === 11001)) {
          const fieldArr = this.Error.errmsg.split(':');
          const fieldStr = fieldArr[2];
          const fieldName = fieldStr.substring(0, fieldStr.lastIndexOf('_1')).trim();
          const message = `${fieldName.toUpperCase()}:EXISTS`;
          return new APIError(message, 409);
        }
      }
      if (this.Error.name === 'ValidationError') {
        const messageArr = this.Error.message.split(':');
        const message = messageArr[(messageArr.length - 1)];
        return new APIError(message, 422);
      }
    }
    if (this.Error.message) {
      return new APIError(this.Error.message, this.Error.code);
    }
    return this.Error;
  }
}

export default ErrorHandler;
