/**
Post controller
*/

var Post = require('../Model/Post'),
    PostResponse = require('../Model/PostResponse'),
    async = require('async'),
    Image = require('../Component/Image'),
    User = require('../Model/User'),
    Photo = require('../Model/Photo');


function getPostData(params, fn) {
    Post.findOne(params)
        .lean()  
        .populate({
            path: 'photos',
            match: { photo_type: 'post' },
            select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
        })
        .populate({
            path: 'responses',
            select: 'response _userId isRead created'
        })
        .exec(function(err, post) {
            if(err) {
                fn(err, false);
            } else {
                if(!post) {
                    fn(false, false);
                } else {
                    User.populate(post, { 
                        path: 'responses._userId',
                        select: 'public_details.first_name public_details.last_name photos created'
                    }, function(err, post) {
                        if(err) {
                            fn(err, false);
                        } else {
                            Photo.populate(post, { 
                                path: 'responses._userId.photos',
                                select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
                            }, function(err, post) {
                                if(err) {
                                    fn(err, false);
                                } else {
                                    fn(false, post);  
                                }
                            });
                        }
                    });
                                      
                }
            }
        });
}



function processMultiplePhotos(postId, photos, fn) {
    //photos.photo
    //user._id
    //Delete all photos of the user profile first
    Post.findOne({_id: postId})
        .lean()
        .exec(function(err, post) {
            if(err) {
                callback(err);
            } else {
                if(post) {
                    console.log("delete all  photo instances");
                    var allPhotos = post.photos;
                    Post.update({_id: postId}, {
                        $pull : { 
                            photos : {
                                $in : allPhotos
                            } 
                        }
                    }, function(err) {
                        if(err) {
                            callback(err);
                        } else {
                            console.log("async starts");
                            Photo.remove({_postId: postId}).exec();
                            async.each(photos, function(photo, callback) {
                                var newPhoto = {};
                                //console.log(photo);
                                //check for cloudinary upload
                                Image.uploadImage(photo.path, function(image, state) {
                                    if(state == 'old') {
                                        newPhoto = image;
                                        //console.log(image);
                                    } else {
                                        if(image.err) {
                                            callback(image.err);
                                        } else {
                                            newPhoto._userId = post._userId;
                                            newPhoto._postId = postId;
                                            newPhoto.photo_type = 'post'; 
                                            newPhoto.cloudinary = image;
                                        }
                                        
                                    }
                                    //is newPhoto?
                                    //console.log(newPhoto);
                                    if(newPhoto) {
                                        //console.log(newPhoto);
                                        //start insert
                                        Photo.insert(newPhoto, function(err, resPhoto) {
                                            if(err) {
                                                callback(err);
                                            } else {
                                                //update photos[]
                                                Post.findByIdAndUpdate(resPhoto._postId, {
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
                                    console.log('All photos have been processed successfully');
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

function postAdd(params, fn) {
    var photos = {};
    photos.photo = params.photo;
    //console.log(params);
    Post.insert(params, function(err, post) {
        if(err) {
            console.log(err);
            fn(err, false)
        } else {
            //console.log("else part");
            ///console.log(params);
            ///console.log(photos.photo.length);
            if(photos.photo) {
                console.log("starting photo procesing");
                processMultiplePhotos(post._id, photos.photo, function(err) {
                    if(err) {
                        fn(err, false);
                    } else {
                        var postId = post._id;
                        var userId = post._userId;
                        User.findByIdAndUpdate(userId, {
                            $push: {
                                posts: post._id
                            }
                        }, function(err) {
                                if(err) {
                                    fn(err, false);
                                } else {
                                    var options = { _id: postId };
                                    console.log(options);
                                    getPostData(options, function(err, post) {
                                        if(err) {
                                            fn(err, false);
                                        } else {
                                            if(post) {
                                                fn(false, post);
                                            } else {
                                                fn(false, false);
                                            }
                                        }
                                    });
                                }
                        });
                        

                    }
                });

            } else {
                var options = { _id: post._id };
                console.log(options);
                getPostData(options, function(err, post) {
                    if(err) {
                        fn(err, false);
                    } else {
                        if(post) {
                            fn(false, post);
                        } else {
                            fn(false, false);
                        }
                    }
                });
            }
        }
    });
}

function expireAll(userId, fn) {
    Post.update({
        _userId: userId, 
        status: true 
    }, {
        $set: { status: false }
    }, {
        multi: true
    }).exec(function(err) {
        if(err) {
            fn(err)
        } else {
            fn();
        }
    });
}

/** Post CRUD **/

/**
* Post posts /// before inserting it expires all the post with status true
**/
exports.postUserPosts = function(req, res) {
    var params = req.body;
    params.photo = [];
    if(req.files) {
        params.photo = req.files.photos;
    }    
    params._userId = req.params.userId;
    //console.log(req.files);
    //User.update(query, update).exec(callback);
    expireAll(params._userId, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            postAdd(params, function(err, post) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    var created = post.created;
                    var expire = post.expiryTime;
                    console.log(created.getHours());
                    console.log(expire.getHours());
                    res.status(201).json(post);
                }
            });
        }
    });
};

/**
* Get all posts
**/
exports.getPosts = function(req, res) {
    Post.find({})
        .lean()  
        .populate({
            path: 'photos',
            match: { photo_type: 'post' },
            select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
        })
        .populate({
            path: 'responses',
            select: 'response _userId isRead created'
        })
        .exec(function(err, posts) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(posts);
            }    
        });
};

/**
* Get user posts
**/
exports.getUserPosts = function(req, res) {
    var userId = req.params.userId;
    Post.find({ _userId: userId })
        .lean()  
        .populate({
            path: 'photos',
            match: { photo_type: 'post' },
            select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
        })
        .populate({
            path: 'responses',
            select: 'response _userId isRead created'
        })
        .sort('-created')
        .exec(function(err, posts) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(posts);
            }    
        });
};

exports.getUserActivePost = function(req, res) {
    var userId = req.params.userId;
    var options = {_userId: userId, status: true};
    getPostData(options, function(err, post) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(post);
        }
    });
};
/**
* Get a single post by id
**/
exports.getPost = function(req, res) {
    var postId = req.params.id;
    var options = {_id: postId};
    getPostData(options, function(err, post) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(post);
        }
    });
    
};


/**
* Update post by id
**/
exports.updatePost = function(req, res) {
    var postId = req.params.id;
    var params = req.body;
    console.log(params);
    Post.findByIdAndUpdate(postId, params, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            var options = {_id: postId}
            getPostData(options, function(err, post) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(post);
                }
            })
        }
    });
}

exports.expirePost = function(req, res) {
    var postId = req.params.id;
    var params = { status: false }
    //console.log(params);
    Post.findByIdAndUpdate(postId, params, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            var options = {_id: postId}
            getPostData(options, function(err, post) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(post);
                }
            })
        }
    });
};




exports.deleteUserPosts = function(req, res) {
    var userId = req.params.userId;
    User.findOne({_id: userId})
        .lean()
        .select('posts')
        .exec(function(err, user) {
            if(err) {
                res.status(500).json(err);
            } else {
                if(user) {
                    var allPosts = user.posts;
                    User.update({_id: userId}, {
                        $pull : { 
                            posts : {
                                $in : allPosts
                            } 
                        }
                    }, function(err) {
                        if(err) {
                            res.status(500).json(err);
                        } else {
                            Post.remove({_userId: userId}).exec();
                            PostResponse.remove({ 
                                _postId: {
                                    $in : allPosts
                                }
                            }).exec();
                            Photo.remove({ 
                                _postId: {
                                    $in : allPosts
                                }
                            }).exec();
                            res.json({ message: 'Posts are deleted!' });
                        }
                    });
                }
            }
        });
}

exports.deletePost = function(req, res) {
    var postId = req.params.id;

    Post.findOne({_id:postId})
        .lean()
        .select('_userId')
        .exec(function(err, post) {
            var userId = post._userId;
            User.update({_id: userId}, {
                $pull : { 
                    posts : postId
                }
            }, function(err) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    Post.remove({_id: postId}).exec();
                    PostResponse.remove({ _postId: postId}).exec();
                    Photo.remove({ _postId: postId}).exec();
                    res.json({ message: 'Post deleted!' });
                }
            });
        });
}


//update all posts to have expiry time

exports.updateAllPosts = function(req, res) {
    Post.find(function(err, posts) {
      posts.forEach(function(post) {
        var dateNow = new Date(post.created);
        dateNow.setHours(dateNow.getHours() + 2); //set time after 2 hrs from now
        post.expiryTime = dateNow;
        post.save();
      });
    });
}

exports.getAllPosts = function(req, res) {
    Post.find(function(err, posts) {
        res.json(posts);
    });
}