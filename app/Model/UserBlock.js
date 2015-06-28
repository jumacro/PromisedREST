/**
* UserBlock schema
* Stores the user data of blocked profiles
* Copyright(c) 2015 Virgin Labs
*/

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BlockSchema = new Schema({
    _userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    _blockedUserId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    report: {
        type: String,
        default: ''
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
Schema method to add User by passed params
**/
BlockSchema.statics.insert = function(params, callback) {
    var newBlock = {};
    for (prop in params) {
        newBlock[prop] = params[prop];
    }
    var block = new this(newBlock);
    block.save(function(err, blockRes) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, blockRes);
        }

    });

};


module.exports = mongoose.model('UserBlock', BlockSchema);