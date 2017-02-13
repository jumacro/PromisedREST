import express from 'express';
//import validate from 'express-validation';
//import paramValidation from '../../config/param-validation';
import User from '../Controllers/User';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /v1.0/users - Get all users */
  .get(User.getAll)

  /** POST /v1.0/users - Create user */
  .post(User.create);

router.route('/:_id')

  /** GET /v1.0/users/:userId - Get a user by id */
  .get(User.getById)

  /** PUT /v1.0/users/:userId - Update a user */
  .put(User.update);

  /** DELETE /v1.0/users/:userId - Delete a user */
  //.delete(User.remove); //TODO

router.route('/login')
  /** GET /v1.0/users/login - Login user */
  .get(User.login)

router.route('/data/:chat_name')
  /** GET /v1.0/users/data/:chat_name - Get a user by chatname */
      .get(User.getByChatName); 

router.route('/:_id/companies/:_company_id')
  /** GET /v1.0/users/:_id/companies/:_company_id - Get all the collegues of a user for his/her company */
      .get(User.getByCompany); 

router.route('/:_id/activities/:_company_id')
  /** GET /v1.0/users/:_id/activities/:_company_id - Get the recent activities of a user */
      .get(User.recentActivities); 


router.route('/import/companies/:_company_id')
  /** GET /v1.0/users/import/companies/:_company_id - Import user data */
      .post(User.importByChatnameArray);

export default router;