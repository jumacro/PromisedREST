/** Modules */
/** Base controller */
import Index from './index';
/** Models */

import AdminService from '../services/admin/users';
import CustomerService from '../services/customer/users';
/** constants */
import settings from '../../constants/settings';



const debug = require('debug')('ip-api:Pipes/User');



class User extends Index {

  constructor(serviceType) {
    super(serviceType);
    this.user = new AdminService();
    this.authErr = { codeObj: this.errorCodes.auth.unauth };
    if (serviceType === 'CUSTOMER') {
      this.user = new CustomerService();
    }
    // this.userSrv = new UserWebService();
  }
  
  create(req, res, next) {
    const self = this;
    const admin = req.user;
    debug(admin);
    // process.exit();
    if (admin.isAdmin) {
      const postObj = req.body;
      postObj.creator = admin;
      self.user.create(postObj)
        .then((response) => {
          const resultObj = {
            codeObj: self.successCodes.created,
            data: response
          }
          super._createResponse(res, resultObj);
        })
        .catch((err) => {
          debug(err);
          super._throwError(next, err);
        });
    } else {
      super._throwError(next, self.authErr);
    }
  }
  
  activate(req, res, next) {
    const self = this;
    const admin = req.user;
    const userId = req.params.id;
    debug(admin);
    // process.exit();
    if (admin.isAdmin) {
      self.user.activate(userId, admin)
        .then((response) => {
          const resultObj = {
            codeObj: self.successCodes.activate,
            data: null
          }
          super._createResponse(res, resultObj);
        })
        .catch((err) => {
          debug(err);
          super._throwError(next, err);
        });
    } else {
      super._throwError(next, self.authErr);
    }
  }
  
  deactivate(req, res, next) {
    const self = this;
    const admin = req.user;
    const userId = req.params.id;
    debug(admin);
    // process.exit();
    if (admin.isAdmin) {
      self.user.activate(userId, admin)
        .then((response) => {
          const resultObj = {
            codeObj: self.successCodes.deactivate,
            data: null
          }
          super._createResponse(res, resultObj);
        })
        .catch((err) => {
          debug(err);
          super._throwError(next, err);
        });
    } else {
      super._throwError(next, self.authErr);
    }
  }
  
  createSuper(req, res, next) {
    const self = this;
    const postObj = req.body;
    postObj.isSuper = true;
    self.user.create(postObj)
      .then((response) => {
        const resultObj = {
          codeObj: self.successCodes.created,
          data: response
        }
        super._createResponse(res, resultObj);
      })
      .catch((err) => {
        debug(err);
        super._throwError(next, err);
      });
  }
  
  login(req, res, next) {
    const self = this;
    const postObj = req.body;
    // debug(postObj);
    // process.exit();
    let err = self.errorCodes.validation.badData;
    if (postObj.username && postObj.password) {
      self.user.login(postObj)
        .then((response) => {
          const resultObj = {
            codeObj: self.successCodes.read,
            data: response
          }
          super._createResponse(res, resultObj);
        })
        .catch((err) => {
          debug(err);
          super._throwError(next, err);
        });
    } else {
      super._throwError(next, err);
    }
  }
  
  logout(req, res, next) {
    const self = this;
    const userId = req.user._id;
    self.user.logout(userId)
        .then((response) => {
          const resultObj = {
            codeObj: self.successCodes.read,
            data: null
          }
          super._createResponse(res, resultObj);
        })
        .catch((err) => {
          debug(err);
          super._throwError(next, err);
        });
  }

  get(req, res, next) {
    const self = this;
    self.user.get(req)
      .then((response) => {
        // debug(users);
        const resultObj = {
          codeObj: self.successCodes.read,
          data: response
        };
        super._createResponse(res, resultObj);
      })
      .catch((err) => {
        debug(err);
        super._throwError(next, err);
      });
  }

  
}


export default User;
