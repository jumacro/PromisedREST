/** Modules */
import jwt from 'jsonwebtoken';
import settings from '../../constants/settings';
import codes from '../../constants/codes';

const debug = require('debug')('ip-api:Controller/Base');



class Base {

  constructor(modelObj) {
    this.model = modelObj;
    this.tokenKey = settings.security.api.appSecret;
    this.tokenExpiry = {
      expiresIn: settings.security.tokenLife
    };
    this.successCodes = codes.http.success;
    this.errorCodes = codes.http.error;
  }

  generateToken(query) {
    // debug(loginPhoneNo);
    const payload = {
      query
    };
    const token = jwt.sign(payload, this.tokenKey, this.tokenExpiry);
    const returnData = {
      token: `JWT ${token}`
    };
    return returnData;
  }

}

export default Base;
