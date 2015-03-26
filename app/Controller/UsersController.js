/**
User controller
*/

var User = require('../Model/User');

exports.welcome = function(req, res) {
    res.json({ message: 'Welcome!' });
}

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
    var params = req.body;
    //console.log(params);
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    user.save(function(err) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.json({ message: 'User added to repositary!' });
        }

    });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.json(users);
        }    
    });
};