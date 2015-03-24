/**
* User model
* Copyright(c) 2015 Mithun Das (https://github.com/mithundas79)
* MIT Licensed
*/

var mongoose = require('mongoose'),
    User     = require('./Schema/User');

/**
* User create method
*/
exports.createUser = function(callback) {
    var userData = {
        username: 'testAccount',
        password: '123456',
        email: 'test@test.com',
        emailVerified: 1,
        verificationToken: ''
    };
    var users = new User(userData);
    users.save(function (err) {
        if (err) {
            callback(err)
        }else{
            callback(false)
        }
    });
}



/**
* User create method
*/
exports.updateUser = function(callback) {
    var userData = {
        username: 'testAccount',
        password: '123456',
        email: 'test@test.com',
        emailVerified: 1,
        verificationToken: ''
    };
    var users = new User(userData);
    users.save(function (err) {
        if (err) {
            callback(err)
        }else{
            callback(false)
        }
    });
}

/**
* Delete method
* @param function callback
*/
exports.deleteUser = function(callback) {
    User.findOneAndRemove({
        _id : id
    }, function(err) {
        callback(err);
    });
}

/**
* Read users (by Id)
* @params mixed userId
* @params function callback
*/
exports.readUser = function(userId, callback) {
    User.findById(userId, function(err, data) {
        callback(err, data);
    });
}

/**
* Read users (by Username)
* @params string username
* @params function callback
*/
exports.readUserByUsername = function(username, callback) {
    User.findOne({
        username: username
    }, function(err, data) {
        callback(err, data);
    });
}