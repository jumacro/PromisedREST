/**
* Oauth Authentication system
*/
/**
* Passport loaded with its Strategies
*/
var Passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy;
var Config = require('../Config/Config'),
    Client = require('../Model/OauthClient'),
    Token = require('../Model/OauthToken'),
    User = require('../Model/User');

/**
* Create passport authentication -- Register Basic Strategy
*/
Passport.use(new BasicStrategy(
        function(username, password, callback) {
        var username = String(username);
        User.findOne({ username: username }, function (err, user) {
        if (err) { 
            return callback(err); 
        } else {
            // No user found with that username
            if (!user) { 
                return callback(null, false); 
            } else {
                // Make sure the password is correct
                user.verifyPassword(password, function(err, isMatch) {
                    if (err) { 
                        return callback(err); 
                    } else {
                        // Password did not match
                        if (!isMatch) { 
                            return callback(null, false); 
                        } else {
                            // Success
                            return callback(null, user);
                        }
                    }
                }); 
            }
        }
        });
        }
));

/**
* Create passport authentication -- Register Client Password Strategy
*/
Passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ clientId: username }, function (err, client) {
        if (err) { 
            return callback(err); 
        } else {
            // No client found with that id or bad password
            if (!client || client.secret !== password) { 
                return callback(null, false); 
            } else {
                // Success
                return callback(null, client);
            }
        }     
    });
  }
));

/**
* Create passport authentication -- Register Bearer Strategy
*/
Passport.use(new BearerStrategy(
  function(accessToken, callback) {
   Token.findOne({token: accessToken }, function (err, token) {
        if (err) { 
            return callback(err); 
        } else {
            // No token found
            if (!token) { 
                return callback(null, false); 
            } else {
                /*if (Math.round((Date.now() - (Date.parse(String(token.created_at).substr(4, 20)))) / 1000) > Config.security.tokenLife) {
                    Token.removeToken(accessToken, function(err) {
                        if (err)
                            return callback(err);
                    });
                    return callback('Token expired', false, {message: 'Token expired'});
                }*/
                User.findOne({ _id: token.userId }, function (err, user) {
                    if (err) { 
                        return callback(err); 
                    } else {
                        // No user found
                        if (!user) { 
                            return callback('Unknown user', false, {message: 'Unknown user'}); 
                        } else {
                            // Simple example with no scope
                            callback(null, user, { scope: '*' });   
                        }
                    }

                    

                    
                });

            }
        }
    });
  }
));

exports.isAuthenticated = Passport.authenticate(['basic', 'bearer'], { session : false });
exports.isClientAuthenticated = Passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = Passport.authenticate('bearer', { session: false });