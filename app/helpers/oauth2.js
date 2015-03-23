var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');
var config = require('../../config/config');
var UserModel = require('../models/user.js');
var ClientModel = require('../models/oauthClientModel.js');
var AccessTokenModel = require('../models/oauthTokenModel.js');
var RefreshTokenModel = require('../models/oauthRefreshTokenModel.js');
var Hashes = require('jshashes');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
    UserModel.findOne(username, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        var password_hash = new Hashes.SHA256().hex_hmac(config.hash_key, password);
        if (user.password !== password_hash) {
            return done(null, false);
        }

        RefreshTokenModel.remove(user.userId, client.clientId, function(err) {
            if (err)
                return done(err);
        });
        AccessTokenModel.remove2(user.userId, client.clientId, function(err) {
            if (err)
                return done(err);
        });

        var tokenValue = crypto.randomBytes(32).toString('base64');
        var refreshTokenValue = crypto.randomBytes(32).toString('base64');
        var token = AccessTokenModel.add({token: tokenValue, clientId: client.clientId, userId: user.id}, function(err, token) {
            if (err) {
                return done(err);
            }
            done(null, tokenValue, refreshTokenValue, {'expires_in': config.security.tokenLife});
        });
        var info = {scope: '*'}
        var refreshToken = RefreshTokenModel.add({token: refreshTokenValue, clientId: client.clientId, userId: user.id}, function(err) {
            if (err) {
                return done(err);
            }
        });

    });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({token: refreshToken}, function(err, token) {
        if (err) {
            return done(err);
        }
        if (!token) {
            return done(null, false);
        }
        if (!token) {
            return done(null, false);
        }

        UserModel.getAUser(token.userId, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }

            RefreshTokenModel.remove(user.userId, client.clientId, function(err) {
                if (err)
                    return done(err);
            });
            AccessTokenModel.remove2(user.userId, client.clientId, function(err) {
                if (err)
                    return done(err);
            });

            var tokenValue = crypto.randomBytes(32).toString('base64');
            var refreshTokenValue = crypto.randomBytes(32).toString('base64');
            var token = AccessTokenModel.add({token: tokenValue, clientId: client.clientId, userId: user.id}, function(err, token) {
                if (err) {
                    return done(err);
                }
                done(null, tokenValue, refreshTokenValue, {'expires_in': config.security.tokenLife});
            });
            var refreshToken = RefreshTokenModel.add({token: refreshTokenValue, clientId: client.clientId, userId: user.id}, function(err) {
                if (err) {
                    return done(err);
                }
            });
        });
    });
}));

// token endpoint
exports.token = [
    passport.authenticate(['basic','oauth2-client-password'], {session: false}),
    server.token(),
    server.errorHandler()
]