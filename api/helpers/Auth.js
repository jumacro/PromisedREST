import jwt from 'jsonwebtoken';
import settings from '../../constants/settings';
import codes from '../../constants/codes';
/** helpers */
import Encrypt from '../helpers/Encrypt';

const debug = require('debug')('ip-api:Helpers/Auth');

class Auth {
    constructor() {
        this.tokenKey = settings.security.api.appSecret;
        this.tokenExpiry = {
          expiresIn: settings.security.tokenLife
        };
        this.successCodes = codes.http.success;
        this.errorCodes = codes.http.error;
        this.inputedPassword = null;
        this.salt = null;
        this.existingPassword = null;
        this.payload = null;
        this.txtPassword = null;
    }

    generateToken() {
        const token = jwt.sign(this.payload, this.tokenKey, this.tokenExpiry);
        debug(token);
        const returnData = {
          token: `JWT ${token}`
        };
        return returnData;
    }
    
    /**
    * Verifies the inputedPassword with the existingPassword
    * @param {*} existingPassword
    * @param {*} salt
    * @param {*} inputedPassword
    * @return Boolean
    */
    verifyPassword() {
        const self = this;
        const encrypt = new Encrypt(self.inputedPassword);
        return encrypt.verifyPassword(self.salt, self.existingPassword);
    }

    /**
    * Creates the password hash and salt
    * @param {*} txtPassword
    * @return JSON Object passwordObject
    */
    createPasswordHash() {
        const self = this;
        const encrypt = new Encrypt(self.txtPassword);
        const passwordStr = encrypt.hashPassword();
        const hashedPassword = passwordStr.passwordHash;
        const salt = passwordStr.salt;
        const passwordObject = {
          password: hashedPassword,
          salt
        };
        return Promise.resolve(passwordObject);
    }
}

export default Auth;
