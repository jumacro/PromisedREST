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
    Hashes = require('jshashes'),
    Client = require('../Model/OauthClient'),
    AccessToken = require('../Model/OauthToken'),
    RefreshToken = require('../Model/OauthRefreshToken'),
    User = require('../Model/User');

/**
* Create passport authentication -- Register Basic Strategy
*/
Passport.use(new BasicStrategy(
        function(username, password, done) {
            var username = String(username);
            Client.checkClient(username, function(err, client) {
                if (err) {
                    return done(err);
                }
                if (!client) {
                    return done(null, false);
                }

                if (client.clientSecret != password) {
                    return done(null, false);
                }
                var info = {scope: '*'};
                return done(null, client, info);
            });
        }
));

/**
* Create passport authentication -- Register Client Password Strategy
*/
Passport.use(new ClientPasswordStrategy(
        function(clientId, clientSecret, done) {
            Client.checkClient(clientId, function(err, client) {
                if (err) {
                    return done(err);
                }
                if (!client) {
                    return done(null, false);
                }

                if (client.clientSecret != clientSecret) {
                    return done(null, false);
                }
                return done(null, client);
            });
        }
));

/**
* Create passport authentication -- Register Bearer Strategy
*/
Passport.use(new BearerStrategy(
        function(accessToken, done) {
            AccessToken.checkToken(accessToken, function(err, token) {
                if (err) {
                    return done(err);
                }
                if (!token) {
                    return done(null, false);
                }
                if (Math.round((Date.now() - (Date.parse(String(token.created_at).substr(4, 20)))) / 1000) > Config.security.tokenLife) {
                    AccessToken.removeToken(accessToken, function(err) {
                        if (err)
                            return done(err);
                    });
                    return done('Token expired', false, {message: 'Token expired'});
                }

                User.readUser(token.userId, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done('Unknown user', false, {message: 'Unknown user'});
                    }

                    var info = {scope: '*'}
                    done(null, user, info);
                });
            });
        }
));