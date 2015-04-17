/**
* Oauth Authentication system
*/
/**
* Passport loaded with its Strategies
*/
var Passport = require('passport'),
    LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;
var Config = require('../Config/Config');

/**
* Create passport authentication -- Register Basic Strategy
*/
Passport.use(new LocalAPIKeyStrategy(
	function(apikey, done) {
		console.log(apikey + "APIKEY");
		
		if(Config.apiKey === apikey) {
			return done(null, true);
		} else {
			return done({ message: 'Unknown apikey : ' + apikey });
		}
	}
));

exports.isAuthenticated = Passport.authenticate('localapikey', { 
	session: false, 
	failureRedirect: '/api/' + Config.apiVersion + '/unauthorized',
	failureFlash: true
});