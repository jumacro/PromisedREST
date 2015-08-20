var crypto = require('crypto'),
	Config = require('../Config/Config')

/**

	creates a hashed out of the passed password
	PHP implementation --- hash_hmac('sha512', text, key);

**/

exports.generateHash = function(pwd, callback){
	var hash = crypto.createHmac(Config.security.encryptions.encrypt_type).update(pwd).digest(Config.security.encryptions.encrypt_key);
  	callback(hash);
}