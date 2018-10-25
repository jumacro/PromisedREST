import crypto from 'crypto';

const debug = require('debug')('ip-api:Helpers/Encrypt');


class Encrypt {
  constructor(password) {
    this.password = password;
    this.length = 16;
  }

  _makeSalt() {
    return crypto.randomBytes(Math.ceil(this.length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, this.length);
  }

  hashPassword() {
    const salt = this._makeSalt();
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(this.password);
    const passwordHash = hash.digest('hex');
    return {
      salt,
      passwordHash
    };
  }

  verifyPassword(savedSalt, savedPassword) {
    
    const salt = savedSalt;
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(this.password);
    const passwordHash = hash.digest('hex');
    
    if (passwordHash === savedPassword) {
      return true;
    }
    return false;
  }


}

export default Encrypt;
