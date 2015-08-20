/**
User controller
*/

/** Load modules **/
async = require('async'),
    _ = require('underscore');

/** Load models **/
var User  = require('../Models/User'),
    Device  = require('../Models/Device');



function ageGetter(birthday) {
    var today = new Date(),
        birthDate = new Date(birthday),
        age = today.getFullYear() - birthDate.getFullYear(),
        m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}



function getArrayOfUser(params, skip, limit, fn) {
    var options = {};
    if(params) {
        options = params;
    }
    User.find(options)
        .lean()
        .select('email social_details public_details created online status')
        .skip(skip)
        .limit(limit)
        .exec(function(err, users) { 
            if (err) {
                fn(err, false);
            } else {
                if(users && users.length) {
                    fn(false, users);
                } else {
                    fn(false, false);
                }
            }
        });
}

function getUserData(params, fn) {
    User.findOne(params)
        .lean()
        .select('email social_details public_details created online') 
        .exec(function(err, user) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                if(!user) {
                    fn(false, false);
                } else {
                    fn(false, user);                                             
                }
            }
        });
}


function userCheck(checkQuery, fn) {
    User.findOne(checkQuery)
        .select('email social_details')
        .lean()
        .exec(function(err, user) {
            if(err) {
                console.log("Found problem, UsersController L344");
                console.log(err);
                fn(err, false);
            } else {
                if(user) {
                    fn(false, user);
                } else {
                    fn(false, false);
                }
            }
        });
}

/**
* User post
*/

function userPost(params, fn) {
    params.public_details.age = ageGetter(params.public_details.birthday);
    
    User.insert(params, function(err, user) {
        if(err) {
            console.log("Found problem, UsersController L356");
            console.log(err);
            fn(err, false);
        } else {
            fn(false, user);            
        }
    });
}

function userUpdate(userId, params, fn){    

    if(params.public_details) {
        if(params.public_details.age) {
            delete params.public_details.age;
        }
        if(params.public_details.birthday) {
            params.public_details.age = ageGetter(params.public_details.birthday);
        }
    }
    
    
    var options = {
        upsert: true
    }
    //console.log(params);
    User.findByIdAndUpdate(userId, params, options, function(err, user) {
            if(err) {
                console.log("Found problem, UsersController L467");
                console.log(err);
                fn(err, false);
            } else {
                if(user) {
                    fn(false, user);
                } else {
                    fn(false, false);
                }
                
            }
        });

}

function checkNPostUser(params, fn) {
    var query = {
        $or:[ 
                { email: params.email }, 
                { 'social_details.facebookId':params.social_details.facebookId }
        ]
    };
    userCheck(query, function(err, user) {
        if(err) {
            fn(err, false);
        } else {
            if(user) {
                var userId = user._id;                
                userUpdate(userId, params, function(err, user) {
                    if(err) {
                        console.log(err);
                        console.log("Found problem, UsersController L549");
                        fn(err, false);
                    } else {
                        fn(false, user);
                    }
                });
            } else {
                userPost(params, function(err, user) {
                    if(err) {
                        console.log(err);
                        console.log("Found problem, UsersController L557");
                        fn(err, false);
                    } else {
                        fn(false, user);
                    }
                });
            }
        }
    });
}

/**************************************************************************************************************************************

                    EXPORT FUNCTION STARTS

***************************************************************************************************************************************/


exports.welcome = function(req, res) {
    res.status(200).json({ message: 'Welcome!' });
}


/** User CRUD **/

/**
* Post users
**/
exports.postUsers = function(req, res) {
    //console.log(req.body);
    var params = req.body;
    checkNPostUser(params, function(err, user) {
        if(err) {
            console.log(err);
            console.log("Found problem, UsersController L589");
            res.status(500).json(err);
        } else {
            if(user) {
                res.status(201).json(user);
            } else {
                res.status(204).json(user);
            }
            
        }
    });
};

/**
* Update user by id
**/
exports.updateUser = function(req, res) {
    var userId = req.params.id;
    var params = req.body;
    
    userUpdate(userId, params, function(err, user) {
        if(err) {
            console.log(err);
            console.log("Found problem, UsersController L555");
            res.status(500).json(err);
        } else {
            res.status(200).json(user);
        }
    });
    
}

exports.checkNAddDevice = function(req, res) {
    var userId = req.params.id;
    var params = req.body;
    
    userUpdate(userId, params, function(err, user) {
        if(err) {
            console.log("Found problem, UsersController L572");
            console.log(err);
            res.status(500).json(err);
        } else {
            res.status(200).json(user);
        }
    });
    
}

/**
* Get all users
**/
exports.getUsers = function(req, res) {
    var skip = 0;
    var limit = 50;

    if(req.query.skip) {
        skip = req.query.skip;
    }

    if(req.query.limit) {
        limit = req.query.limit;
    }
    User.find({})
        .lean()
        .select('email social_details public_details created online status')
        .skip(skip)
        .limit(limit)
        .exec(function(err, users) { 
            if (err) {
                res.status(500).json(err);
            } else {
                if(users && users.length) {
                    res.status(200).json(users);
                } else {
                    res.status(204).json(users);
                }
            }
        });
};

/**
* Get a single user by id
**/
exports.getUser = function(req, res) {

    var userId = req.params.id;
    var params = { _id: userId };
    getUserData(params, function(err, user) {
        if(err) {
            console.log("Found problem, UsersController L621");
            console.log(err);
            res.status(500).json(err);
        } else {
            if(user) {
                res.status(200).json(user);
            } else {
                res.status(204).json(user);
            }
        }
    });
    
};

/**
* Get a single user by facebookId
*/
exports.getUserByFbId = function(req, res) {
    var facebookId = req.params.facebookId;
    var params = { "social_details.facebookId" : facebookId };
    getUserData(params, function(err, user) {
        if(err) {
            console.log("Found problem, UsersController L639");
            console.log(err);
            res.status(500).json(err);
        } else {
            if(user) {
                res.status(200).json(user);
            } else {
                res.status(204).json(user);
            }
        }
    });
    
};

/**
* Delete user
**/
exports.deleteUser = function(req, res) {
    var userId = req.params.id;

    User.remove({ _id: userId }).exec(function(err) {
        if(err) {
            console.log("Found problem, UsersController L783");
            console.log(err);
            res.status(500).json(err);
        } else {
            Device.remove({_userId: userId}).exec();
            res.json({ message: 'User is deleted!' });
        }
    });


}