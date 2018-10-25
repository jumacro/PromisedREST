import express from 'express';

import UserPipes from '../../pipes/user';

import Auth from '../../middlewares/Auth';

const router = express.Router(); // eslint-disable-line new-cap

const User = new UserPipes('ADMIN');

router.route('/')
    .post(Auth.isAuthenticated, (req, res, next) => User.create(req, res, next))
    .get(Auth.isAuthenticated, (req, res, next) => User.get(req, res, next));

router.route('/logout')
    .get(Auth.isAuthenticated, (req, res, next) => User.logout(req, res, next));
    
router.route('/super')
    .post((req, res, next) => User.createSuper(req, res, next));
      
router.route('/login')
    .post((req, res, next) => User.login(req, res, next)); 
    
router.route('/activate/:id')
    .get(Auth.isAuthenticated, (req, res, next) => User.activate(req, res, next));
    
router.route('/deactivate/:id')
    .get(Auth.isAuthenticated, (req, res, next) => User.deactivate(req, res, next));

export default router;

