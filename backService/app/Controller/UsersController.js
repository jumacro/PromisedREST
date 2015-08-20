/**
User controller
*/

var User  = require('../Model/User'),
    UserBlock  = require('../Model/UserBlock'),
    Device  = require('../Model/Device'),
    async = require('async'),
    _ = require('underscore'),
    Post  = require('../Model/Post'),
    PostResponse  = require('../Model/PostResponse'),
    Report  = require('../Model/Report'),
    Channel  = require('../Model/Channel'),
    Message  = require('../Model/Message'),
    Photo = require('../Model/Photo'),
    Image = require('../Component/Image'),
    Feed  = require('../Component/Feed'),
    Job  = require('../Component/Jobs');


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

function attachUserPosts(userPosts) {
    if(userPosts) {
        if(userPosts.length) {
            var lastIndex = userPosts[userPosts.length - 1];
            var lastPostId = userPosts[lastIndex];
        }
    }
}

function getUserData(params, fn) {
    User.findOne(params)
        .lean()
        .select('email social_details public_details preferences photos posts blockedUsers created online matchedUsers')
        .populate({
            path: 'posts',
            match: { status: true },
            select: 'post_message photos venue created responses' //no photos and only response count
        })        
        .populate({
            path: 'photos',
            match: { photo_type: 'profile' },
            select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
        })
        .populate({
            path: 'blockedUsers',
            select: 'public_details.first_name public_details.last_name created'
        })
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

function getUserFeedData(params, skip, limit, fn) {
    User.findOne(params)
        .lean()
        .select('matchedUsers')
        .exec(function(err, user) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                var feeds = [];
                if(!user) {
                    fn(false, false);
                } else {

                    //console.error(user);
                    if(user.matchedUsers) {
                        if(user.matchedUsers.length) {
                            Feed.feedPosts(user.matchedUsers, skip, limit, function(err, feeds) {
                                if(err) {
                                    fn(err, false);
                                } else {
                                    fn(false, feeds);                                
                                }                            
                            });
                        }else{
                            fn(false, feeds);
                        }
                        
                    } else {
                        fn(false, feeds);
                    }
                    
                }
            }
        });
}

function processMultiplePhotos(userId, photos, fn) {
    //console.log('processing starts')
    //photos.photo
    //user._id
    //Delete all photos of the user profile first
    User.findOne({_id: userId})
        .lean()
        .exec(function(err, user) {
            if(err) {

                callback(err);
            } else {
                if(user) {
                    var allPhotos = user.photos;
                    User.update({_id: userId}, {
                        $pull : { 
                            photos : {
                                $in : allPhotos
                            } 
                        }
                    }, function(err) {
                        if(err) {

                            callback(err);
                        } else {
                            Photo.remove({_userId: userId}).exec();
                            async.each(photos, function(photo, callback) {
                                //console.log('async started');
                                var newPhoto = {};
                                //check for cloudinary upload
                                Image.uploadImage(photo, function(image, state) {
                                    //console.log(state);
                                    if(state == 'old') {
                                        newPhoto = image;
                                        newPhoto._userId = userId;
                                        newPhoto.photo_type = 'profile'; 
                                        //console.log(image);
                                    } else {
                                        if(image.err) {
                                            callback(image.err);
                                        } else {
                                            newPhoto._userId = userId;
                                            newPhoto.photo_type = 'profile'; 
                                            newPhoto.cloudinary = image;
                                        }
                                        
                                    }
                                    //console.log(newPhoto);
                                    //is newPhoto?
                                    if(newPhoto) {
                                        
                                        //start insert
                                        Photo.insert(newPhoto, function(err, resPhoto) {
                                            if(err) {
                                                callback(err);
                                            } else {
                                                //update photos[]
                                                User.findByIdAndUpdate(resPhoto._userId, {
                                                    $push: {
                                                        photos: resPhoto._id
                                                    }
                                                }, function(err) {
                                                    if(err) {
                                                        callback(err);
                                                    } else {
                                                        ///console.log('user updated');
                                                        callback();
                                                    }
                                                });
                                            }
                                        });    
                                    }
                                    
                                });

                            }, function(err){
                                if(err) {
                                    fn(err);
                                } else {
                                    //console.log('All photos have been processed successfully');
                                    fn(false);           
                                }
                            });
                        }
                    });
                } else {
                    callback();
                }
            }
        });
}



function userPost(params, fn) {
    params.public_details.age = ageGetter(params.public_details.birthday);
    var photos = {};
    photos.photo = params.photos;
    User.insert(params, function(err, user) {
        if(err) {
            fn(err, false)
        } else {
            if(photos.photo.length) {
                processMultiplePhotos(user._id, photos.photo, function(err) {
                    if(err) {
                        fn(err, false);
                    } else {
                        //run parallal process to create matches
                        if(user.preferences) {
                            Job.getMatchedUsers(user, function(err, userIds) {
                                if(err) {
                                    //nothing to do
                                } else {
                                    User.update({
                                        _id: user._id 
                                    }, {
                                        $set: { matchedUsers: userIds }
                                    }).exec(function(err) {
                                        if(err) {
                                            console.log("Update failed" + err);
                                        } else {
                                            console.log('match updated');
                                        }
                                    }); 
                                }
                            });
                        }
                        
                        if(params.devices) {
                            var deviceParams = {
                                _userId: user._id,
                                _deviceId: params.devices.deviceId,
                                type: params.devices.deviceType
                            };
                            //console.log(deviceParams);
                            Device.insert(deviceParams, function(err, device) {
                                if(err) {
                                    //console.log(err);
                                    fn(err, false);
                                } else {
                                    var options = { _id: user._id };
                                    getUserData(options, function(err, user) {
                                        if(err) {
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
                            });
                        } else {
                            var options = { _id: user._id };
                            getUserData(options, function(err, user) {
                                if(err) {
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
                        
                    }
                });
            }
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
    
    var photos = {};
    if(params.photos) {
        photos.photo = params.photos;
        delete params.photos;
    }
    
    
    var options = {
        upsert: true
    }
    //console.log(params);
    User.findByIdAndUpdate(userId, params, options, function(err) {
            if(err) {
                console.log(err);
                fn(err, false);
            } else {
                var paramOptions = { _id: userId };
                //console.log('problem is here line 231');
                //check if thr is any photto
                if(photos.photo) {
                    //first delete all photos
                    processMultiplePhotos(userId, photos.photo, function(err) {
                        if(err) {
                            fn(err, false);
                        } else {
                            
                            getUserData(paramOptions, function(err, user) {
                                if(err) {
                                    fn(err, false);
                                } else {
                                    fn(false, user);
                                }
                            });
                        }
                    });
                
                    
                }else{
                    console.log('problem is here line 251');
                    getUserData(paramOptions, function(err, user) {
                        if(err) {
                            console.log(err);
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
    userPost(params, function(err, user) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(201).json(user);
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
    User.find({})
        .lean()
        .select('email social_details public_details preferences photos posts blockedUsers matchedUsers created online status')
        .populate({
            path: 'posts',
            match: { status: true },
            select: 'post_message photos venue created responses' //no photos and only response count
        })
        .populate({
            path: 'photos',
            match: { photo_type: 'profile' },
            select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
        })
        .exec(function(err, users) { 
            if (err) {
                res.status(500).json(err);
            } else {
                if(users && users.length) {
                    res.status(200).json(users);
                } else {
                    res.status(404).json(null);
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
            res.status(500).json(err);
        } else {
            res.status(200).json(user);
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
            res.status(500).json(err);
        } else {
            res.status(200).json(user);
        }
    });
    
};

/**
* Get user feed by user id
**/
exports.getFeeds = function(req, res) {
    var userId = req.params.userId;
    var params = { _id: userId };
    var skip = 0;
    var limit = 50;

    if(req.query.skip) {
        skip = req.query.skip;
    }

    if(req.query.limit) {
        limit = req.query.limit;
    }

    getUserFeedData(params, skip, limit, function(err, feeds){
        if(err) {
            res.status(500).json(err);
        } else {
           res.status(200).json(feeds);
        }
    });
    
};

/**
* Get user feed by user fbId
**/
exports.getFeedsByFbId = function(req, res) {
    var facebookId = req.params.facebookId;
    var params = { "social_details.facebookId" : facebookId };
    var skip = 0;
    var limit = 50;

    if(req.query.skip) {
        skip = req.query.skip;
    }

    if(req.query.limit) {
        limit = req.query.limit;
    }

    getUserFeedData(params, skip, limit, function(err, feeds){
        if(err) {
            res.status(500).json(err);
        } else {
           res.status(200).json(feeds);
        }
    });
    
};


/**
* Delete user
**/
exports.deleteUser = function(req, res) {
    var userId = req.params.id;
    
    //remove user posts
   Post.find({_userId: userId})
        .select('_id')
        .exec(function(err, posts) {
            if(posts) {
                var $postId = _.pluck(posts, "_id");
                PostResponse.remove({
                    _postId: {
                        $in: $postId
                    }
                }).exec(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        Post.remove({_userId: userId}).exec();
                        
                    }
                });
            }
            
        });
    PostResponse.remove({_userId: userId}).exec();
    //remove channels
    Channel.find({_userId: userId})
           .select('_id')
           .exec(function(err, channels) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    if(channels) {
                        var $channelId = _.pluck(channels, "_id");
                        Message.remove({_channelId: {
                            $in: $channelId
                        }}).exec();
                        Channel.remove({_userId: userId}).exec();
                    }
                    
                }
           });
    Channel.find({_contactUserId: userId})
           .select('_id')
           .exec(function(err, channels) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    if(channels) {
                        var $channelId = _.pluck(channels, "_id");
                        Message.remove({_channelId: {
                            $in: $channelId
                        }}).exec();
                        Channel.remove({_userId: userId}).exec();
                    }
                    
                }
           });
    Photo.remove({_userId: userId}).exec();
    UserBlock.remove({_userId: userId}).exec();
    Device.remove({_userId: userId}).exec();
    Report.remove({_userId: userId}).exec();
    Message.remove({_userId: userId}).exec();

    User.remove({ _id: userId }).exec(function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.json({ message: 'User is deleted!' });
        }
    });


}

/** User level routes **/
/**
* Login resource 
* Checks the input user credentials and verify the user password
* Returns the message
* On success, returns user data
**/
exports.login = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ username: username }, function (err, user) {
        if (err) { 
            res.status(500).json(err);
        } else {
            if(!user) {
                res.status(500).json({ message: 'Wrong username/password'});
            }  else {
                user.verifyPassword(password, function(err, isMatch) {
                    if (err) { 
                        res.status(500).json(false, err);
                    } else {
                        if (!isMatch) { 
                            res.status(401).json({ message: 'Wrong username/password', data: null});
                        } else {
                            // Success
                            res.status(200).json({ message: 'Login sucess', data: user});
                        }
                    }
                });
            }
        }
    });
};

/**
* Logout resource 
* Logs out user
* Returns the message
**/
exports.logout = function(req, res) {
    res.status(200).json({ message: 'User is logged out' });
};

/**
* Change password resource
**/

exports.changePassword = function(req, res) {
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    //var userId = 
};