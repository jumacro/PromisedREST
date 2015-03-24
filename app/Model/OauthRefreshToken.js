/**
* Oauth Refresh Token model
* Copyright(c) 2015 Mithun Das (https://github.com/mithundas79)
* MIT Licensed
*/

var mongoose 	= require('mongoose'),
	RefreshToken      = require('./Schema/OauthRefreshToken');

/**
* Add token
* @param string params
* @param function callback
*/
exports.addToken = function(params, callback) {
	var newToken = new RefreshToken(params);
	newToken.save(function(err) {
		// we've saved the token into the db here
  		callback(err);
	});
}

/**
* Read token
* @param string token
* @param function callback
*/
exports.readToken = function(refreshToken, callback) {
	RefreshToken.findOne({
			token: refreshToken
		}, function(err, token) {
			callback(err, token);
		}
	);
}

/**
* Match the income token with the authorized token
* @param string token
* @param function callback
*/
exports.checkToken = function(userId,  clientId, callback) {
	RefreshToken.findOne({
		_userId   : userId,
		_clientId : clientId
	}, function(err, data) {
		callback(err, data);
	});
}

/**
* Remove token
* @param string userId
* @param string clientId
* @param function callback
*/
exports.removeToken = function(userId,  clientId, callback) {
	RefreshToken.remove({
		_userId   : userId,
		_clientId : clientId
	}, function(err) {
		callback(err);
	});
}