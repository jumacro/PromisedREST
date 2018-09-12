import passport from 'passport';
import passportJwt from 'passport-jwt';
import settings from '../../constants/settings';

import User from '../models/User';

const debug = require('debug')('promised-rest:Helpers/Auth');

const tokenKey = settings.security.api.appSecret;
const extractJwt = passportJwt.ExtractJwt;
const jwtOptions = {
  jwtFromRequest: extractJwt.fromAuthHeader(),
  secretOrKey: tokenKey
};

const JwtStrategy = passportJwt.Strategy;
const AuthStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  debug(jwtPayload);
  
  User.findOne({
    _id: jwtPayload.userId
  })
  .select('-password -salt -phoneVerificationCode')
  .lean().exec()
  .then((foundUser) => {
     
    if (foundUser) {
      if (!foundUser.isLoggedIn) {
        const err = { code: 401, message: 'LOGGEDIN' };
        throw err;
      }
      if (!foundUser.isActive) {
        const err = { code: 401, message: 'LOCKED' };
        throw err;
      }
      const user = foundUser;
      user.userId = foundUser._id;
      // debug(user);
      return done(null, user);
    }
    const err = { code: 401, message: 'UNAUTHORIZED' };
    throw err;
  })
  .catch(err => done(err, null));
  
});

passport.use(AuthStrategy);

const isAuthenticated = passport.authenticate('jwt', { session: false });

export default { isAuthenticated };
