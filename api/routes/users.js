import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../constants/param-validation';
import UserPipe from '../pipes/users';
//import MigrationController from '../controllers/Migration';

import Auth from '../helpers/Auth';


const router = express.Router(); // eslint-disable-line new-cap

const User = new UserPipe();

router.route('/admin/login')
    .post((req, res, next) => User.adminLogin(req, res, next))

/* router.route('/')
  .post(Auth.isAuthenticated, (req, res, next) => User.create(req, res, next))
  .get(Auth.isAuthenticated, (req, res, next) => User.getAll(req, res, next))
  .delete(Auth.isAuthenticated,  (req, res, next) => User.delete(req, res, next));
  
router.route('/:id')
  .put(Auth.isAuthenticated, (req, res, next) => User.edit(req, res, next)); */



export default router;
