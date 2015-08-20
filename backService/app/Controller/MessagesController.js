/**
Message controller
*/

var Message = require('../Model/Message'),
    Photo = require('../Model/Photo');

exports.getAll = function(req, res) {
    Message.find({}, function(err, msgs) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.json(msgs);
        }
    })
}

exports.getHistory = function(req, res) {
    var channelId = req.params.channelId;

    Message.find({_channelId: channelId})
           .lean()
           .select('_userId message created')
           .populate({
                path: '_userId',
                select: 'public_details.first_name public_details.last_name photos created'
            })
           .exec(function(err, messages) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    Photo.populate(messages, { 
                        path: '_userId.photos',
                        match: { photo_type: 'profile' },
                        select: 'cloudinary.public_id cloudinary.format created'
                    }, function(err, messages) {
                        if(err) {
                            res.status(500).json(err);
                        } else {
                            res.status(200).json(messages);
                        }
                    });
                    
                }
           });
}

exports.clearHistory = function(req, res) {
    var channelId = req.params.channelId;
    Channel.findOne({_id: channelId})
        .lean()
        .select('messages')
        .exec(function(err, channel) {
            if(err) {
                res.status(500).json(err);
            } else {
                if(channel) {
                    var messages = channel.messages;
                    Channel.update({_id: channelId}, {
                        $pull : { 
                            messages : {
                                $in : messages
                            } 
                        }
                    }, function(err) {
                        if(err) {
                            res.status(500).json(err);
                        } else {
                            Message.remove({_channelId: channelId}).exec();
                            res.json({ message: 'Messages are deleted!' });
                        }
                    });
                }
            }
        });
};