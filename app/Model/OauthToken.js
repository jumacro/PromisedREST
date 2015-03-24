/**
* Oauth Token model
* Copyright(c) 2015 Mithun Das (https://github.com/mithundas79)
* MIT Licensed
*/

var mongoose 	= require('mongoose'),
	Token      = require('./Schema/OauthToken');

/**
* Add token
* @param string params
* @param function callback
*/
exports.addToken = function(params, callback) {
	
	var newToken = new Token(params);

	newToken.save(function(err) {
		// we've saved the token into the db here
  		callback(err);
	});
}

/**
* Match the income token with the authorized token
* @param string token
* @param function callback
*/
exports.checkToken = function(token, callback) {
	Token.findOne({
		token: token
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
exports.removeToken = function(token, callback) {
	Token.remove({
		token: token
	}, function(err) {
		callback(err);
	});
}

exports.removeTokenByParam = function(param, callback) {
	Token.remove(param, function(err) {
		callback(err);
	});
}