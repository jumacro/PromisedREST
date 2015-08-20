/**
* Message schema
* Stores the user messages
* Copyright(c) 2015 Virgin Labs
* MIT Licensed
*/

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
    _channelId: {  
        type: ObjectId,
        required: true,
        ref: 'Channel'
    },
    _userId: { 
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/** 
Schema method to add Message by passed params
**/
MessageSchema.statics.insert = function(params, callback) {
    console.log(params);
    var newMessage = {};
    for (prop in params) {
        newMessage[prop] = params[prop];
    }
    var message = new this(newMessage);
    message.save(function(err, message) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, message);
        }

    });

};


module.exports = mongoose.model('Message', MessageSchema);