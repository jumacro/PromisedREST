/** Modules */
/** Base controller */
import Base from './base';
/** Models */
import User from '../models/User';

import Auth from '../helpers/Auth';
import DateHelper from '../helpers/Date';

/** constants */
import settings from '../../constants/settings';



const debug = require('debug')('ip-api:Controller/User');

/** create model object */
const models = {
  userModel: User
};

class Users extends Base {

  constructor() {
    super(models);
    this.err = { code: 500 };
    this.date = new DateHelper();
  }

  get(query) {
    let filters = null;
    if (query) {
      filters = query;
    }
    return this.model.userModel.allusers(filters);
  }
  
  create(params) {
    const self = this;
    const data = {
      email: params.check.email,
      phone: params.check.phone
    };
    const saveParam = params.data;
    const auth = new Auth();
    return self.model.userModel.checkExistance(data)
      .then((userExists) => {
        if (!userExists) {
          auth.txtPassword = params.security.password;
          return auth.createPasswordHash(params.security.password)
              .then((passwordObj) => {
                saveParam.password = passwordObj.password;
                saveParam.salt = passwordObj.salt;
                return self.model.userModel.add(saveParam);
              });
        }
        self.err.code = self.errorCodes.validation.exists;
        throw self.err;
      })
      .catch(e => Promise.reject(e));
  }
  
  login(obj) {
    const self = this;
    const auth = new Auth();
    return self.model.userModel.findOne(obj.query)
      .lean()
      .exec()
      .then((foundUser) => {
        
        if (foundUser) {
          // check password
          auth.inputedPassword = obj.security.password;
          auth.salt = foundUser.salt;
          auth.existingPassword = foundUser.password;
          auth.payload = {
            query: obj.query
          };
          const passwordVerification = auth.verifyPassword();
          if (passwordVerification) {
            if (!foundUser.isActive) {
              self.err.code = self.errorCodes.auth.locked;
              throw self.err;
            }
            
            const lastLoginDate = this.date.serverNow(); 
            // update user model at background
            self.model.userModel.updateLogin(foundUser._id, true, lastLoginDate)
              .then((updated) => {
                debug('updated logged in status');
              })
              .catch((err) => {
                debug('error in updating logged in status');
                debug(err);
              });
              // forground generate response jwt
            const tokenObj = auth.generateToken()
            const returnObj = tokenObj;
            returnObj.userId = foundUser._id;
            return Promise.resolve(returnObj);
          }
        }
        self.err.code = self.errorCodes.auth.invalidCred;
        throw self.err;
      })
      .catch(e => Promise.reject(e));
  }
  
  logout(userId) {
    const self = this;
    return self.model.userModel.updateLogin(userId, false)
      .then(response => Promise.resolve(response))
      .catch(e => Promise.reject(e));
  }
  
  activate(userId) {
    const self = this;
    return self.model.userModel.editStatus(userId, true)
      .then(response => Promise.resolve(response))
      .catch(e => Promise.reject(e));
  }
  
  deactivate(userId) {
    const self = this;
    return self.model.userModel.editStatus(userId, false)
      .then(response => Promise.resolve(response))
      .catch(e => Promise.reject(e));
  }
  
  
}


export default Users;
