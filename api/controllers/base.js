/** Modules */
import jwt from 'jsonwebtoken';
import settings from '../../constants/settings';

const debug = require('debug')('promised-rest:Controller/Base');



class Base {

  constructor(modelObj) {
    this.model = modelObj;
    this.tokenKey = settings.security.api.appSecret;
    this.tokenExpiry = {
      expiresIn: settings.security.tokenLife
    };
  }

  generateToken(userId) {
    // debug(loginPhoneNo);
    const payload = {
      userId
    };
    debug('TokenKey: ' + this.tokenKey);
    debug('TokenExpiry: ' + this.tokenExpiry.expiresIn);
    const token = jwt.sign(payload, this.tokenKey, this.tokenExpiry);
    const returnData = {
      token: `JWT ${token}`
    };
    return returnData;
  }

}

export default Base;
