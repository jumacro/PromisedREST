
/*
 * GET users listing.
 */
var user = require('../models/user');
var userToken = require('../models/userToken');
var auth = require('../helpers/auth');
var authPhp = require('../helpers/auth_php');
var Hashes = require('jshashes');
var config = require('../../config/config');

exports.createUser = function(req, res) {
    var params = req.body;
    user.createUser(params, function(data) {
        res.json({message: 'User inserted successfully'});
    });
}

exports.createUserUsingGet = function(req, res) {
    var params = {
        username: req.query.username,
        email: req.query.email,
        password: req.query.password
    };
    user.createUser(params, function(data) {
        res.json({message: 'User inserted successfully'});
    });
}

exports.getAllUsers = function(req, res) {
    user.getAllUsers(function(data) {
        res.json(data);
    });
}

exports.getAUser = function(req, res) {
    var user_id = req.params.user_id;
    user.getAUser(user_id, function(data) {
        res.json(data);
    });
}

exports.updateUser = function(req, res) {
    var user_id = req.params.user_id;
    var params = req.body;
    user.updateUser(user_id, params, function(data) {
        res.json({message: 'User updated successfully'});
    });
}

exports.delAUser = function(req, res) {
    var user_id = req.params.user_id;
    user.delAUser(user_id, function(data) {
        res.json({message: 'User deleted successfully'});
    });
}

exports.loginUser = function(req, res) {
    var params = req.body;
    user.getAUserByUsername(params.username, function(data) {
        if (data.count > 0) {
            var password = new Hashes.SHA256().hex_hmac(config.hash_key, params.password);
            console.log(password);
            user.checkLogin(params.username, password, function(loginResult) {
                if (loginResult != null) {
                    var token = "testtoken";
                    var expires = new Date(Date.now() + 3600000);
                    var tokenParams = {
                        user_id: loginResult.id,
                        token: token,
                        expires: expires,
                        user_agent: 'test agent'

                    }
                    /*auth.login(tokenParams, function(tokenData){
                     res.json({ token: token, data: loginResult}); 
                     });*/
                    res.json({token: token, data: loginResult});

                } else {
                    res.json({message: 'Wrong password!'})
                }

            });
        } else {
            //user not found
            res.json({message: 'Wrong username!'});
        }
    });
}


exports.loginUserApi = function(req, res) {
    var params = req.body;
    authPhp.phpApiLogin(params.username, params.password, function(loginResult) {
        if (loginResult == 'Failed') {
            res.json({message: "Failed"});
        } else {
            //var result = loginResult
            res.json(loginResult);
        }
        //res.json({message: loginResult});
    });
}
