/**
* Friend schema
* Stores the user friends
* Copyright(c) 2015 Virgin Labs
* MIT Licensed
*/

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var FriendSchema = new Schema({
    _userId: {
        type: ObjectId,  // Me: the user
        required: true,
        ref: 'User'
    },
    _friendUserId: {
        type: ObjectId, // My friends user id
        required: true,
        ref: 'User'
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


module.exports = mongoose.model('Friend', FriendSchema);