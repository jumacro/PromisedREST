/** Modules */
/** User controller */
import User from '../users';
import Log from '../actionLogs';


const debug = require('debug')('promised-rest:Controller/Admin/User');

class Admins extends User {

  constructor() {
    super();
    this.log = new Log();
  }

  get(query) {
    let filters = null;
    if (query) {
      filters = query;
    }
    return super.get(filters);
  }
  
  create(postObj) {
    const self = this;
    let err = self.errorCodes.server;
    let hasname = false;
    if (postObj.fname || postObj.lname) {
      hasname = true;
    }
    
    if (!postObj.email || !postObj.phone || !postObj.password || !hasname) {
        err = self.errorCodes.validation.badData;
        return Promise.reject(err);
    }
    const params = {
        check: {
            email: postObj.email,
            phone: postObj.phone
        },
        security: {
            password: postObj.password
        },
        data: {
            fname: postObj.fname || postObj.lname,
            lname: postObj.lname || null,
            email: postObj.email,
            phone: postObj.phone,
            isSuper: postObj.isSuper || false,
            isActive: true,
            isAdmin: true,
            isMerchant: true,
            isCustomer: true
        }
    };
    
    return super.create(params)
      .then((createdData) => {
          // log entry
          if (postObj.isSuper) {
            self.log.adminUserCreate(createdData._id, createdData._id);
          } else {
            self.log.adminUserCreate(postObj.creator._id, createdData._id);
          }
          return Promise.resolve(createdData);
      })
      .catch(e => Promise.reject(e));
  }
  
  login(postObj) {
    const self = this;
    const queryObj = {
      query: {
        phone: postObj.username,
        isAdmin: true
      },
      security: {
        password: postObj.password
      }
    };
    return super.login(queryObj)
      .then((loginResponse) => {
        self.log.adminLogin(loginResponse.userId);
        const obj = {
          token: loginResponse.token
        }
        return Promise.resolve(obj);
      })
      .catch(e => Promise.reject(e));
  }
  
  logout(userId) {
    const self = this;
    return super.logout(userId)
      .then((logoutResponse) => {
        self.log.adminLogout(userId);
        return Promise.resolve(logoutResponse);
      })
      .catch(e => Promise.reject(e));
  }
  
  activate(userId, activer) {
    const self = this;
    return super.activate(userId)
      .then((response) => {
        self.log.activateAdmin(userId, activer._id);
        return Promise.resolve(response);
      })
      .catch(e => Promise.reject(e));
  }
  
  deactivate(userId, deactiver) {
    const self = this;
    return super.deactivate(userId)
      .then((response) => {
        self.log.deactivateAdmin(userId, deactiver._id);
        return Promise.resolve(response);
      })
      .catch(e => Promise.reject(e));
  }
}


export default Admins;
