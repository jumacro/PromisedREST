/**
* Authentication --- Fondoo API
* The Auth system uses the Passport.Basic Strategy
* @version 1.1
*/
/**
* Passport loaded with its Strategies
*/
var Passport = require('passport'),
    //LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;
    BasicStrategy = require('passport-http').BasicStrategy;
var Config = require('../Config/Config'); //Config loaded

/**
* Create passport authentication -- Register Basic Strategy
*/
Passport.use(new BasicStrategy(
  function(username, password, done) {
    if(Config.security.api.appId === username) {
        if(Config.security.api.appSecret === password) {
            return done(null, true);
        } else {
            return done(null, false);
        }
    } else {
        return done(null, false);
    }
  }
));

/**
* Export the Authentication request handler
*/
exports.isAuthenticated = Passport.authenticate('basic', { session : false });