/**
* Photo schema
* Stores the user photos
* Copyright(c) 2015 Virgin Labs
* MIT Licensed
*/

var mongoose = require('mongoose'),
    User     = require('./User'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var PhotoSchema = new Schema({
    _userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    _postId: {
        type: ObjectId,
        ref: 'Post'
    },
    photo_type: {  // Valid values are 'profile', 'post'
        type: String,
        default : 'profile',
        enum : ['profile', 'post']
    },
    location: {  //store coordinates in this order: longitude, latitude.
        index: '2d',
        type: [Number],
        default: [0,0]
    },
    cloudinary: {
        public_id: {
            type: String
        },
        version: {
            type: Number
        },
        signature: {
            type: String
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        format: {
            type: String
        },
        tags: {
            type:[String]
        },
        bytes: {
            type: Number
        },
        etag: {
            type: String
        },
        url: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    created  : {
        type: Date,
        default: Date.now
    },
    modified  : {
        type: Date,
        default: Date.now
    }
});

/** 
Schema method to add Photo by passed params
**/
PhotoSchema.statics.insert = function(params, callback) {
    //console.log(params);
    var newPhoto = {};
    for (prop in params) {
        newPhoto[prop] = params[prop];
    }
    var photo = new this(newPhoto);
    
    photo.save(function(err, photo) {
        if (err) {
            //console.log(err);
            callback(err, false);
        } else {
            console.log(photo);
            callback(false, photo);
        }

    });

};

/** 
Schema method to update Photo by passed params
**/
PhotoSchema.statics.edit = function(postId, params, callback) {
    this.findOne({ _id: postId }, function(err, post) {
        if(err) {
            callback(err);
        } else {
            //update post
            //console.log(params);
            for (prop in params) {
                post.prop = params[prop];

                if(prop.indexOf('.') !== -1) {
                    //brk it
                    var propArr = prop.split('.');
                    console.log(propArr[0]);
                    if(propArr.length = 2) {
                        post[propArr[0]][propArr[1]] = params[prop];
                    }
                    if(propArr.length = 3) {
                        post[propArr[0]][propArr[1]][propArr[2]] = params[prop];
                    }

                }

            }
            //console.log(post.social_details.foursquareId);
            //save the post
            post.save(function(err, photo) {
                if(err) {
                    callback(err, false);
                } else {
                    callback(false, photo);
                }
            });

        }
    });

};

PhotoSchema.statics.deleteAllPhotos = function(userId, fn) {
    this.remove({ _userId: userId, photo_type: 'profile' }, function(err) {
        if(err) {
            fn(err);
        } else {
            fn(false);
        }
    });
}


module.exports = mongoose.model('Photo', PhotoSchema);