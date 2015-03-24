/**
* Oauth Client model
* Copyright(c) 2015 Mithun Das (https://github.com/mithundas79)
* MIT Licensed
*/

var mongoose 	= require('mongoose'),
	Client      = require('./Schema/OauthClient');

/**
* Check a particular client by the stored client Id
* @param string clientId
* @param function callback
*/
exports.checkClient = function(clientId, callback) {
	Client.findOne({
		_clientId: clientId
	}, function(err, data) {
		callback(err, data);
	});
}