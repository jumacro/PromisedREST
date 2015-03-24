var crypto = require('crypto'),
	Config = require('../Config/Config')

/**

	creates a hashed out of the passed password
	PHP implementation --- hash_hmac('sha512', text, key);

**/

exports.generateHash = function(pwd, callback){
	var hash = crypto.createHmac(Config.encrypt_type).update(pwd).digest(Config.encrypt_key);
  	callback(hash);
}