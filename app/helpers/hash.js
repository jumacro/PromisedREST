var crypto = require('crypto'),
	config = require('../../config/config')

/**

	creates a hashed out of the passed password
	PHP implementation --- hash_hmac('sha512', text, key);

**/

exports.generateHash = function(pwd, callback){
	var hash = crypto.createHmac(config.hash_method).update(pwd).digest(config.hash_key);
  	callback(hash);
}