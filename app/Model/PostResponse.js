/**
* Post/Dips Response schema
* Stores the user posting
* Copyright(c) 2015 Virgin Labs
* MIT Licensed
*/

var mongoose = require('mongoose'), 
    mongooseScheduler = require('mongoose-scheduler'), 
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var PostResponseSchema = new Schema({
    _userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    _postId: {
        type: ObjectId,
        required: true,
        ref: 'Post'
    },
    response : {
        type: String,
        required: true
    },
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
    isRead : {
        type: Boolean,
        default: false
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

/*PostResponseSchema.plugin(mongooseScheduler, {
    field: 'created', 
    interval: '2h',
    keys: 'post_message status created', 
    callback: function(post){
        post.update(post._id, {
            status: false
        }, function(err) {
            config.log(err);
        });
    }, 
  });*/



/** 
Schema method to add PostResponse by passed params
**/
PostResponseSchema.statics.insert = function(params, callback) {

    var newPostResponse = {};
    for (prop in params) {
        newPostResponse[prop] = params[prop];
    }
    var postResponse = new this(newPostResponse);
    postResponse.save(function(err, postResponse) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, postResponse);
        }

    });
};


module.exports = mongoose.model('PostResponse', PostResponseSchema);