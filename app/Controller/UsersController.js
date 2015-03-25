/**
User controller
*/

var User = require('../Model/User'),
    Auth = require('../Component/Auth');



exports.register = function(req, res) {
	var params = req.body;
	User.createUser(params, function(err) {
		if (err) {
    		res.json({ status: 'error'});
    	} else {
    		res.json({ status: 'success'});
    	}
	});
}

exports.login = function(req, res) {
    var params = req.body;
    Auth.login(params, function(err, data) {
    	if (err) {
    		res.json({ status: 'error', data: false});
    	} else {
    		res.json({ status: 'success', data: data});
    	}
    });
    
}

exports.welcome = function(req, res) {
	res.json({ status: 'success', message: 'Welcome to our api'});
}
