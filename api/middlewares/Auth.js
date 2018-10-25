import passport from 'passport';
import passportJwt from 'passport-jwt';
import settings from '../../constants/settings';
import statusCodes from '../../constants/codes';
import User from '../models/User';

const debug = require('debug')('ip-api:Middleware/Auth');

const authErr = statusCodes.http.error.auth;


const tokenKey = settings.security.api.appSecret;
const extractJwt = passportJwt.ExtractJwt;
const jwtOptions = {
  jwtFromRequest: extractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: tokenKey
};

// debug(jwtOptions.jwtFromRequest);

const JwtStrategy = passportJwt.Strategy;
const AuthStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  
  
  User.findOne(jwtPayload.query)
  .select('phone email isAdmin isMerchant isCustomer isActive')
  .lean().exec()
  .then((foundUser) => {
    // const loggederr = { code: authErr.loggedIn };
    const lockederr = { code: authErr.locked };
    if (foundUser) {
      if (!foundUser.isActive) {
        throw lockederr;
      }
      
      const user = foundUser;
      // debug(user);
      return done(null, user);
    }
    const err = authErr.unauth;
    throw err;
  })
  .catch(err => done(err, null));
  
});

passport.use(AuthStrategy);

const isAuthenticated = passport.authenticate('jwt', { session: false });

export default { isAuthenticated };
