/** Modules */
/** Base controller */
import Base from './Base';
/** Models */
import User from '../models/User';


/** helpers */
import Encrypt from '../helpers/Encrypt';
/** constants */
import settings from '../../constants/settings';


const debug = require('debug')('promised-rest:Controller/User');

/** create model object */
const models = {
  userModel: User
};

class Users extends Base {

  constructor() {
    super(models);
    this.Auth = new Auth();
  }

  getAll(req) {
    if (req.user.isAdmin) {
      let filters = null;
      if (req.query) {
        filters = req.query;
      }
      return this.model.userModel.allusers(filters);
    }
    const err = { code: 400, message: 'UNATHORIZED' };
    throw err;
  }

  create(req) {
    if (req.user.isAdmin) {
      if (req.body) {
        const saveParams = req.body;
        if (!saveParams.username || !saveParams.password) {
          const passwordObj = UserController._createPasswordHash(saveParams.password);
          const password = passwordObj.password;
          const salt = passwordObj.salt;
          saveParams.password = password;
          saveParams.salt = salt;
          return this.model.userModel.add(saveParams);
        }
      }
      const err = { code: 500, message: 'BADREQUEST' };
      throw err;
    }
    const err = { code: 400, message: 'UNATHORIZED' };
    throw err;
  }

  /**
   * Verifies the inputedPassword with the existingPassword
   * @param {*} existingPassword
   * @param {*} salt
   * @param {*} inputedPassword
   * @return Boolean
   */
  static _verifyPassword(inputedPassword, salt, existingPassword) {
    const encrypt = new Encrypt(inputedPassword);
    return encrypt.verifyPassword(salt, existingPassword);
  }

  /**
   * Creates the password hash and salt
   * @param {*} txtPassword
   * @return JSON Object passwordObject
   */
  static _createPasswordHash(txtPassword) {
    const encrypt = new Encrypt(txtPassword);
    const passwordStr = encrypt.hashPassword();
    const hashedPassword = passwordStr.passwordHash;
    const salt = passwordStr.salt;
    const passwordObject = {
      password: hashedPassword,
      salt
    };
    return passwordObject;
  }

  generateToken(userObj) {
    const userData = userObj;
    
    return super.generateToken(userData._id);
  }

  login(req) {
    const username = req.body.username;
    const password = req.body.password;
    return this.model.userModel.getAUser({ username })
      .then((userData) => {
        if (userData) {
          if (userData.isActive) {
            const passwordVerification = Users._verifyPassword(
              password, userData.salt, userData.password
            );
            if (passwordVerification) {
              const params = {
                isLoggedIn: true,
                lastLoginDate: new Date()
              };
              this.model.userModel.update({ _id: userData._id }, params)
                .then((updated) => {
                  debug('updated logged in status');
                })
                .catch((err) => {
                  debug('error in updating logged in status');
                  debug(err);
                })
              return super.generateToken(user);
            }
            const err = { code: 400, message: 'WRONGUSER' };
            throw err;
          }
          const err = { code: 400, message: 'DEACTIVE' };
          throw err;
        }
        const err = { code: 400, message: 'WRONGUSER' };
        throw err;
      })
  }
}


export default Users;
