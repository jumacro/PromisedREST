
var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    user = require('../models/user'),
    hash = require('./hash');

passport.use(new BasicStrategy(
  function(username, password, callback) {
      console.log(username);
      console.log(password);
    user.findOne({ username: username }, function (err, User) {
          console.log(User);
          if (err) { return callback(err); }

          // No user found with that username
          if (!User) { return callback(null, false); }

          // Make sure the password is correct
          hash.generateHash(password, function(hashed){
              User.verifyPassword(hashed, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, User);
              });
          });

    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });
