import express from 'express';

import UserPipes from '../pipes/user';

import Auth from '../middlewares/Auth';

const router = express.Router(); // eslint-disable-line new-cap

const User = new UserPipes('CUSTOMER');


router.route('/logout')
    .get(Auth.isAuthenticated, (req, res, next) => User.logout(req, res, next));
      
router.route('/login')
    .post((req, res, next) => User.login(req, res, next)); 
 

export default router;

