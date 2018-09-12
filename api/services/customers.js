/** Modules */
/** Base controller */
import Users from './users';
/** Models */
import User from '../models/User';

const debug = require('debug')('promised-rest:Controller/User');

/** create model object */
const models = {
  userModel: User
};

class Customers extends Users {

  constructor() {
    super(models);
  }

  profile(req) {
    const userId = req.user.userId;
    const request = {
      query: {
        userId
      }
    };
    return super.getAll(request)
      .then((userData) => {
        if(userData) {
          const json = {
            name: `${userData.fname} ${userData.lname}`,
            email: userData.email
          };
        }
      })
  }

  create(req) {
    if (req.body) {
      const reqBody = req.body;
      reqBody.createdBy = req.user.userId;
      return super.create(reqBody);
    }
    const err = { code: 500, message: 'BADREQUEST' };
    return Promise.reject(err);
  }

  login(req) {
    return super.login(req);
  }
}


export default Customers;
