/**
* Post/Dips schema
* Stores the user posting
* Copyright(c) 2015 Virgin Labs
* MIT Licensed
*/

var mongoose = require('mongoose'), 
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//var relative tables

var Photo = require('./Photo'),
    PostResponse = require('./PostResponse');

var PostSchema = new Schema({
    _userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    post_message : {
        type: String,
        required: true
    },
    photos: [
        { type: ObjectId, ref: 'Photo' }
    ],
    responses: [
        { type: ObjectId, ref: 'PostResponse' }
    ],
    status : {
        type: Boolean,
        default: true
    },
    venue: {
        icon: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        location: {  //store coordinates in this order: longitude, latitude.
            index: '2d',
            type: [Number],
            default: [0,0]
        },
        address: {
            type: String,
            default: ''
        },
        foursquareId: {
            type: String,
            default: ''
        }
    },
    expiryTime : {
        type: Date,
        default: function() {
            // 2 hrs from now
            return new Date(new Date().valueOf() + (60000*120));
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

PostSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Photo.remove({_postId: this._id}).exec();
    PostResponse.remove({_postId: this._id}).exec();
    next();
});


/** 
Schema method to add Post by passed params
**/
PostSchema.statics.insert = function(params, callback) {
    //delete params.photo;
    //console.log(params);
    //console.log(decodeURIComponent(params.data));
    var formData = JSON.parse(decodeURIComponent(params.data));
    formData._userId = params._userId;
    console.log(formData);
    var newPost = {};
    for (prop in formData) {
        newPost[prop] = formData[prop];
    }
    var post = new this(newPost);
    
    post.save(function(err, post) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, post);           
        }

    });

};

/** 
Schema method to update Post by passed params
**/
PostSchema.statics.edit = function(postId, params, callback) {
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
            post.save(function(err, post) {
                if(err) {
                    callback(err, false);
                } else {
                    callback(false, post);
                }
            });

        }
    });

};


module.exports = mongoose.model('Post', PostSchema);