/** Modules */
/** Base controller */
import Index from './index';
/** Models */
import Users from '../controllers/users';
/** constants */
import settings from '../../constants/settings';
import statusCodes from '../../constants/codes';


const debug = require('debug')('promised-rest:HTTP/User');



class UserPipe extends Index {

  constructor() {
    this.userCtrl = new Users();
  }

  getAll(req, res, next) {
    this.userCtrl.getAll(req)
      .then((response) => {
        // debug(users);
        const resultObj = {
          codeObj: statusCodes.success,
          data: response
        };
        super._createResponse(res, resultObj);
      })
      .catch((err) => {
        debug(err);
        super._throwError(next, err);
      });
  }

  getAUser(req, res, next) {
    this.userCtrl.getAUser(req)
      .then((response) => {
        // debug(users);
        const resultObj = {
          codeObj: statusCodes.success,
          data: response
        };
        super._createResponse(res, resultObj);
      })
      .catch((err) => {
        debug(err);
        super._throwError(next, err);
      });
  }

  create(req, res, next) {
    this.userCtrl.create(req)
      .then((response) => {
        // debug(users);
        const resultObj = {
          codeObj: statusCodes.success,
          data: response
        };
        super._createResponse(res, resultObj);
      })
      .catch((err) => {
        debug(err);
        super._throwError(next, err);
      });
  }

  edit(req, res, next) {
    this.userCtrl.edit(req)
      .then((response) => {
        // debug(users);
        const resultObj = {
          codeObj: statusCodes.success,
          data: response
        };
        super._createResponse(res, resultObj);
      })
      .catch((err) => {
        debug(err);
        super._throwError(next, err);
      });
  }

  delete(req, res, next) {
    this.userCtrl.delete(req)
      .then((response) => {
        // debug(users);
        const resultObj = {
          codeObj: statusCodes.success,
          data: response
        };
        super._createResponse(res, resultObj);
      })
      .catch((err) => {
        debug(err);
        super._throwError(next, err);
      });
  }

  login(req, res, next) {
    this.userCtrl.login(req)
      .then((response) => {
        // debug(users);
        const resultObj = {
          codeObj: statusCodes.success,
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


export default UserController;
