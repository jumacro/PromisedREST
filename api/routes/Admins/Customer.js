import express from 'express';

import UserPipes from '../../pipes/user';

import Auth from '../../middlewares/Auth';

const router = express.Router(); // eslint-disable-line new-cap

const User = new UserPipes('CUSTOMER');

router.route('/')
    .post(Auth.isAuthenticated, (req, res, next) => User.create(req, res, next))
    .get(Auth.isAuthenticated, (req, res, next) => User.get(req, res, next));
    
router.route('/activate/:id')
    .get(Auth.isAuthenticated, (req, res, next) => User.activate(req, res, next));
    
router.route('/deactivate/:id')
    .get(Auth.isAuthenticated, (req, res, next) => User.deactivate(req, res, next));

 

export default router;

