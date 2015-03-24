/**
* Oauth v2.0 -- Authentication class
*/
var Oauth2orize = require('oauth2orize'),
    Passport = require('passport'),
    Crypto = require('crypto'),
    Config = require('../Config/Config'),
    Hashes = require('jshashes'),
    Client = require('../Model/OauthClient'),
    AccessToken = require('../Model/OauthToken'),
    RefreshToken = require('../Model/OauthRefreshToken'),
    User = require('../Model/User');

// create OAuth 2.0 server
var Server = Oauth2orize.createServer();

// Exchange username & password for access token.
Server.exchange(Oauth2orize.exchange.password(function(client, username, password, scope, done) {
    User.readUserByUsername(username, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        var password_hash = new Hashes.SHA256().hex_hmac(Config.encrypt_key, password);
        if (user.password !== password_hash) {
            return done(null, false);
        }

        RefreshToken.removeToken(user.userId, client.clientId, function(err) {
            if (err)
                return done(err);
        });
        var accessTokenParams = {
            _userId : user.userId,
            _clientId : client.clientId
        };
        AccessToken.removeTokenByParam(accessTokenParams, function(err) {
            if (err)
                return done(err);
        });

        var tokenValue = Crypto.randomBytes(32).toString('base64');
        var refreshTokenValue = Crypto.randomBytes(32).toString('base64');
        //Add token
        var accessTokenNVP = {
            token: tokenValue, 
            _clientId: client.clientId, 
            _userId: user.id
        };
        var token = AccessToken.addToken(accessTokenNVP, function(err) {
            if (err) {
                return done(err);
            }
            done(null, tokenValue, refreshTokenValue, {'expires_in': Config.security.tokenLife});
        });
        var info = {scope: '*'};
        //Add refresh token
        var refreshAccessTokenNVP = {
            token: refreshTokenValue, 
            _clientId: client.clientId, 
            _userId: user.id
        };
        var refreshToken = RefreshToken.addToken(refreshAccessTokenNVP, function(err) {
            if (err) {
                return done(err);
            }
        });

    });
}));

// Exchange refreshToken for access token.
Server.exchange(Oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {



    //remove this whole part
    RefreshToken.readToken(refreshToken, function(err, token) {
        if (err) {
            return done(err);
        }
        if (!token) {
            return done(null, false);
        }
        if (!token) {
            return done(null, false);
        }

        User.readUser(token.userId, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }

            RefreshToken.removeToken(user.userId, client.clientId, function(err) {
                if (err)
                    return done(err);
            });
            var accessTokenParams = {
                _userId : user.userId,
                _clientId : client.clientId
            };
            AccessToken.removeTokenByParam(accessTokenParams, function(err) {
                if (err)
                    return done(err);
            });

            var tokenValue = Crypto.randomBytes(32).toString('base64');
            var refreshTokenValue = Crypto.randomBytes(32).toString('base64');
            //Add token
            var accessTokenNVP = {
                token: tokenValue, 
                _clientId: client.clientId, 
                _userId: user.id
            };
            var token = AccessToken.addToken(accessTokenNVP, function(err) {
                if (err) {
                    return done(err);
                }
                done(null, tokenValue, refreshTokenValue, {'expires_in': Config.security.tokenLife});
            });
            var info = {scope: '*'};
            //Add refresh token
            var refreshAccessTokenNVP = {
                token: refreshTokenValue, 
                _clientId: client.clientId, 
                _userId: user.id
            };
            var refreshToken = RefreshToken.addToken(refreshAccessTokenNVP, function(err) {
                if (err) {
                    return done(err);
                }
            });
        });
    });
}));

// token endpoint
exports.token = [
    Passport.authenticate(['basic','oauth2-client-password'], {session: false}),
    Server.token(),
    Server.errorHandler()
]