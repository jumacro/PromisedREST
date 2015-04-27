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

// Create endpoint /api/user/:id for GET
exports.getUser = function(req, res) {
    var userId = req.params.id;
    User.findOne({ _id: userId }, function(err, user) {
        if(err) {
            console.log(err);
            res.end();
        } else {
            res.json(user);
        }
    });
    
};

exports.updateUser = function(req, res) {
    var userId = req.params.id;
    var param = req.body;
    User.findOne({ _id: userId }, function(err, user) {
        if(err) {
            console.log(err);
            res.end();
        } else {
            //update user
            for (prop in req.body) {
                user[prop] = req.body[prop];
            }
            //save the user
            user.save(function(err) {
                if(err) {
                    console.log(err);
                    res.end();
                } else {
                    res.json({ message: 'User is updated!' });
                }
            });

        }
    });
}

exports.deleteUser = function(req, res) {
    var userId = req.params.id;
    User.remove({ _id: userId }, function(err) {
        if(err) {
            console.log(err);
            res.end();
        } else {
            res.json({ message: 'User is deleted!' });
        }
    });
}

exports.login = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ username: username }, function (err, user) {
        if (err) { 
            res.json(err);
        } else {
            if(!user) {
                res.json({ error: 400, message: 'Wrong username/password'});
            }  else {
                user.verifyPassword(password, function(err, isMatch) {
                    if (err) { 
                        res.json(false, err);
                    } else {
                        if (!isMatch) { 
                            res.json({ error: 400, message: 'Wrong username/password'});
                        } else {
                            // Success
                            res.json({ error: 0, message: 'Login sucess', data: user});
                        }
                    }
                });
            }
        }
    });
}

exports.logout = function(req, res) {
    res.json({ message: 'User is logged out' });
}