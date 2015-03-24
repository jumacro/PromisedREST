/**
* Basic Authentication class
*/
var Passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    Config = require('../Config/Config'),
    Hash = require('./Hash'),
    User = require('../Model/User');

/** Use the basic strategy **/
Passport.use(new BasicStrategy(
    function(username, password, callback) {
        if (Config.debug) { console.log(username); }

        User.readUserByUsername(username, function(err, user){
            if (Config.debug) { console.log(users); }

            if(err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Make sure the password is correct
            Hash.generateHash(password, function(hashed){
              if (user.password === hashed)  {
                return callback(null, User); //Password imatch
              }else{
                return callback(null, false); //Success
              }
            });
        });
    }
));

exports.isAuthenticated = Passport.authenticate('basic', { session : false });
