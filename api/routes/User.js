import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../constants/param-validation';
import UserController from '../controllers/User';
//import MigrationController from '../controllers/Migration';

import Auth from '../helpers/Auth';

const router = express.Router(); // eslint-disable-line new-cap

const User = new UserController();

//const Migration = new MigrationController();



router.route('/password/reset/request')
      .post((req, res, next) => User.setPasswordResetLink(req, res, next));

router.route('/password/reset/checkToken/')
      .post((req, res, next) => User.checkPasswordResetToken(req, res, next));

router.route('/password/reset/update')
      .post((req, res, next) => User.updatePassword(req, res, next));

router.route('/:fieldName/:fieldValue')
      .delete((req, res, next) => User.deleteUser(req, res, next));

router.route('/accept/:inviteCode')
      /** GET /v1.0/companies/:company_id - Get user */
       .get((req, res, next) => User.acceptInvitation(req, res, next));

router.route('/password/update')
      .put(Auth.isAuthenticated, (req, res, next) => User.editPassword(req, res, next));

router.route('/update')
      .put(Auth.isAuthenticated, (req, res, next) => User.editUser(req, res, next));

router.route('/upload/photo')
      .put(Auth.isAuthenticated, (req, res, next) => User.updatePhoto(req, res, next));

router.route('/getByInput')
      .post(Auth.isAuthenticated, (req, res, next) => User.getUserByEmailORPhone(req, res, next));

router.route('/switchProfile')
      .put(Auth.isAuthenticated, (req, res, next) => User.switchProfile(req, res, next));

router.route('/set/default-picture')
      .put((req, res, next) => User.changeDefaultPhoto(req, res, next));

/* router.route('/test/update-rating')
      .get((req, res, next) => User.updateAllUserRating(req, res, next)); */
      
//router.route('/test/start-migration')
  //    .get((req, res, next) => Migration.createUser(req, res, next));
      
router.route('/jwt/check')
      .get(Auth.isAuthenticated, (req, res, next) => User.checkJWT(req, res, next));

router.route('/getOneById/:userId')
      .get((req, res, next) => User.getOneById(req, res, next));
      
/* router.route('/test/fraud-check/:price')
      .get((req, res, next) => User.testFraudCode(req, res, next));

router.route('/test/fraud-reset')
      .get((req, res, next) => User.resetFraudCheck(req, res, next)); */

export default router;
