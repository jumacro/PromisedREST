var config = require('../../config/config');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var UserModel = require('../models/user.js');
var ClientModel = require('../models/oauthClientModel.js');
var AccessTokenModel = require('../models/oauthTokenModel.js');
var RefreshTokenModel = require('../models/oauthRefreshTokenModel.js');
var Hashes = require('jshashes');
//
passport.use(new BasicStrategy(
        function(username, password, done) {
            ClientModel.findOne({clientId: String(username)}, function(err, client) {
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

passport.use(new ClientPasswordStrategy(
        function(clientId, clientSecret, done) {
            ClientModel.findOne({clientId: clientId}, function(err, client) {
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

passport.use(new BearerStrategy(
        function(accessToken, done) {
            AccessTokenModel.findOne({token: accessToken}, function(err, token) {
                if (err) {
                    return done(err);
                }
                if (!token) {
                    return done(null, false);
                }
                if (Math.round((Date.now() - (Date.parse(String(token.created_at).substr(4, 20)))) / 1000) > config.security.tokenLife) {
                    AccessTokenModel.remove(accessToken, function(err) {
                        if (err)
                            return done(err);
                    });
                    return done('Token expired', false, {message: 'Token expired'});
                }

                UserModel.getAUser(token.userId, function(err, user) {
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