/** Modules */
/** Base controller */
import Users from './users';
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

class Admins extends Users {

  constructor() {
    super(models);
  }

  getAll(req) {
    if (req.user.isAdmin) {
      return super.getAll(req);
    }
    const err = { code: 400, message: 'UNATHORIZED' };
    throw err;
  }

  create(req) {
    if (req.user.isAdmin) {
      if (req.body) {
        const reqBody = req.body;
        reqBody.isAdmin = true;
        reqBody.createdBy = req.user.userId;
        return super.create(reqBody);
      }
      const err = { code: 500, message: 'BADREQUEST' };
      throw err;
    }
    const err = { code: 400, message: 'UNATHORIZED' };
    throw err;
  }

  login(req) {
    return super.login(req);
  }
}


export default Admins;
