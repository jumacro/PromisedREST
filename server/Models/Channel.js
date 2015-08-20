/**
* Channel schema
* Two way communication schema
* Copyright(c) 2015 Virgin Labs
* MIT Licensed
*/

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//var relative tables

var Message = require('./Message');

var ChannelSchema = new Schema({
    _firstUserId: {  
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    _secondUserId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

ChannelSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Message.remove({_channelId: this._id}).exec();
    next();
});




/** 
Schema method to add Channel by passed params
**/
ChannelSchema.statics.checkNInsert = function(params, callback) {
    var Channel = this;
    Channel.findOne()
    .or([
         { $and: [{_firstUserId: params._firstUserId}, {_secondUserId: params._secondUserId}] },
         { $and: [{_firstUserId: params._secondUserId}, {_secondUserId: params._firstUserId}] }
    ])
    .lean()
    .exec(function(err, channel) {
        if(err) {
            callback(err, false);
        } else {
            if(channel) {
                //channel is found
                channel.firstTime = false;
                callback(false, channel);
            } else {
                //no channel found
                //insert operation starts
                var newChannel = {};
                newChannel._firstUserId = params._firstUserId;
                newChannel._secondUserId = params._secondUserId;
                //console.log(newChannel);
                var channel = new Channel(newChannel);
                channel.save(function(err, channel) {
                    if(err) {
                        console.log(newChannel);
                        callback(err, false);
                    } else {
                        channel.firstTime = true;
                        callback(false, channel);
                    }
                });

            }
        }
    });

};


module.exports = mongoose.model('Channel', ChannelSchema);