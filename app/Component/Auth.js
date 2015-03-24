/**
* Basic Authentication class
*/
var Config = require('../Config/Config'),
    Hash = require('./Hash'),
    User = require('../Model/User');

exports.login = function(params, callback) {
    var username = params.username;
    var password = params.password;
    //check if the username is correct
    User.readUserByUsername(username, function(err, user){
        if(err) { 
            callback(false, null); 
        } else {
            if (!user) { 
                callback(false, null); 
            } else {
                // Make sure the password is correct
                Hash.generateHash(password, function(hashed){
                  if (password === hashed)  {
                    callback(true, user); //Password missmatch
                  }else{
                    callback(false, null); //Success
                  }
                });
            }
        }
    });
}
