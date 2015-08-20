/**
* Device schema
* Stores the user data of blocked profiles
* Copyright(c) 2015 Virgin Labs
*/

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var DeviceSchema = new Schema({
    _userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    _deviceId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default : 'iphone',
        enum : ['iphone', 'android']
    },
    created  : {
        type: Date,
        default: Date.now
    }
});

/** 
Schema method to add User by passed params
**/
DeviceSchema.statics.insert = function(params, callback) {
    var newDevice = {};
    for (prop in params) {
        newDevice[prop] = params[prop];
    }
    var block = new this(newDevice);
    block.save(function(err, blockRes) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, blockRes);
        }

    });

};


module.exports = mongoose.model('Device', DeviceSchema);