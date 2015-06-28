/**
Channel controller
*/

var Channel = require('../Model/Channel'),
    User = require('../Model/User'),
    _ = require('underscore'),
    async = require('async'),
    Photo = require('../Model/Photo'),
    Post = require('../Model/Photo'),
    PostResponse = require('../Model/PostResponse'),
    Message = require('../Model/Message'),
    PushNotification   = require('../Component/PushNotification');

/** Channel CRUD **/

function getHistory(channelId, fn) {

    Message.find({_channelId: channelId})
           .lean()
           .select('_channelId _userId message created isRead')
           .populate({
                path: '_userId',
                select: 'public_details social_details photos'
            })
           .sort('-created')
           .exec(function(err, messages) {
                if(err) {
                    fn(err, false);
                } else {
                    Photo.populate(messages, { 
                        path: '_userId.photos',
                        select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
                    }, function(err, messages) {
                        if(err) {
                            fn(err, false);
                        } else {
                            fn(false, messages);
                        }
                    });
                    
                }
           });

}

exports.addChannel = function(req, res) {
    //console.log(req.body);
    var param = {};
        param._userId = req.body.userId;
        param._contactUserId = req.body.otherUserId;
    var post_message = req.body.post_message;
    var postId = req.body.postId;
    var response = req.body.response;
    var responseId = req.body.responseId;
    var responseReply = req.body.responseReply;
    var replierId = req.body.userId;

    Channel.checkNInsert(param, function(err, channel) {
        if(err) {
            res.status(500).json(err);
        } else {
            //console.log(channel);
            var channelId = channel._id;
            if(channel.firstTime) {
                var  msgParams = {
                        _channelId: channel._id,
                        _userId: param._userId,
                        message: post_message,
                        isRead: true
                    };
                    //creating reply params
                    var  msg2Params = {
                        _channelId: channel._id,
                        _userId: param._contactUserId,
                        message: response,
                        isRead: true
                    }
                    var msg3Params = {
                        _channelId: channel._id,
                        _userId: replierId,
                        message: responseReply
                    };
                    var messagesArr = [];
                    //insert operation
                    var history = [];
                    //console.log(msgParams);
                    //first message
                    Message.insert(msgParams, function(err, message) {
                        if(err) {
                            res.status(500).json(err);
                        } else {
                            //history.push = message;
                            //messagesArr[0] = message._id;
                            //first insert complete... initialize second insert
                            Channel.findByIdAndUpdate(channelId, {
                                $push: {
                                    messages: message._id
                                },
                                last_message: message._id
                            }, {upsert: true}, function(err) {
                                if(err) {
                                    res.status(500).json(err);
                                } else {
                                    //second message
                                    Message.insert(msg2Params, function(err, messageSec) {
                                        if(err) {
                                            res.status(500).json(err);
                                        } else {
                                            //push in Channels
                                            Channel.findByIdAndUpdate(channelId, {
                                                $push: {
                                                    messages: messageSec._id
                                                },
                                                last_message: messageSec._id
                                            }, {upsert: true}, function(err) {
                                                if(err) {
                                                    res.status(500).json(err);
                                                } else {
                                                    //PostResponse.remove({ _id: responseId}).exec();
                                                    Post.update({_id: postId}, {
                                                        $pull : { 
                                                            responses : responseId
                                                        }
                                                    }, function(err) {
                                                        if(err) {
                                                            res.status(500).json(err);
                                                        } else {
                                                            PostResponse.remove({_id: responseId}).exec();
                                                            //third message
                                                            Message.insert(msg3Params, function(err, messageThird) {
                                                                if(err) {
                                                                    res.status(500).json(err);
                                                                } else {
                                                                    Channel.findByIdAndUpdate(channelId, {
                                                                        $push: {
                                                                            messages: messageThird._id
                                                                        },
                                                                        last_message: messageThird._id
                                                                    }, {upsert: true}, function(err) {
                                                                        if(err) {
                                                                            res.status(500).json(err);
                                                                        } else {
                                                                            getHistory(channelId, function(err, history) {
                                                                                if(err) {
                                                                                    res.status(500).json(err);
                                                                                } else {
                                                                                    if(history) {
                                                                                        res.status(200).json(history);
                                                                                    } else {
                                                                                        res.status(404).json(null);
                                                                                    }
                                                                                    
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                    
                                                    
                                                }
                                            });
                                        }
                                    });       
                                    
                                }
                            });
                            
                        }

                    });
                
                
            } else {

                getHistory(channelId, function(err, history) {
                    if(history) {
                        res.status(200).json(history);
                    } else {
                        res.status(404).json(null);
                    }
                });              

            }     
        }
    });

}

exports.getAll = function(req, res) {
    Channel.find({})
           .lean()
           .exec(function(err, channels) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    if(channels) {
                        res.json(channels);
                    } else {
                        res.status(404).json(null);
                    }
                }    
            });
};

exports.getMyChannels = function(req, res) {
    var userId = req.params.userId;
    var params = [{
        _userId: userId
    }, {
        _contactUserId: userId
    }];
    Channel.find({})
           .or(params)
           .lean()
           .select('_userId _contactUserId messages last_message created')
           .populate({
                path: 'messages',
                match: { 
                    _userId: {
                        $ne: userId
                    }
                },
                select: 'message created'
           })
           .exec(function(err, channels) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    if(channels) {
                        //Populate contacted users photo
                        async.each(channels, function(channel, callback){
                            var _contactUserId = "";
                            if(channel._userId == userId) {
                                _contactUserId = channel._contactUserId;
                            }
                            if(channel._contactUserId == userId) {
                                _contactUserId = channel._userId;
                            }
                            User.findOne({_id: _contactUserId})
                                .lean()
                                .select('email social_details public_details preferences photos created')
                                .populate({
                                    path: 'photos',
                                    match: { photo_type: 'profile' },
                                    select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
                                })
                                .exec(function(err, user) {
                                    if(err) {
                                        res.status(500).json(err);
                                    } else {
                                        delete channel._userId;
                                        delete channel._contactUserId;
                                        if(user) {
                                            channel._contactUserId = user;
                                        }
                                        //console.log('I am here');
                                        //formatting the messages
                                        var msgArr = [];
                                        var msgCount = 0;
                                        var lastMessage = "";
                                        if(channel.messages) {
                                            msgArr = channel.messages;
                                            var lastindex = (channel.messages.length - 1);
                                            var last_message = channel.messages[lastindex];
                                            //console.log('I am here  3');
                                            channel.last_message = last_message;

                                            Message.count({
                                                _id: {
                                                    $in: msgArr
                                                }, 
                                                isRead: false
                                            }).exec(function(err, msgCount) {
                                                if(err) {
                                                    res.status(500).json(err);
                                                } else {
                                                    delete channel.messages;
                                                    channel.unReadMessages = msgCount;
                                                    callback();
                                                }
                                            })
                                            
                                        }
                                        
                                    }
                                });
                        }, function(err) {
                            if(err) {
                                res.status(500).json(err);
                            } else {
                                if(channels) {
                                    res.status(200).json(channels);
                                } else {
                                    res.status(404).json(null);
                                }
                                
                            }
                        }); 
                    } else {
                        res.status(404).json(null);
                    }
                    
                    
                }    
            });
};


exports.getMyMessages = function(req, res) {
    var userId = req.params.userId;
    var params = [{
        _userId: userId
    }, {
        _contactUserId: userId
    }];
    Channel.find({})
           .or(params)
           .lean()
           .select('_id')
           .exec(function(err, channels) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    if(channels) {
                        var channelIds = _.pluck(channels, "_id");
                        console.log(channelIds);
                        Message.find({
                            _channelId: {
                                $in: channelIds
                            }
                        })
                        .lean()
                        .select('_channelId _userId message')
                        .populate({
                            path: '_userId',
                            select: 'public_details.first_name public_details.last_name photos created'
                        })
                        .sort('-created')
                        .limit(100)
                        .exec(function(err, messages) {
                            if(err) {
                                res.status(500).json(err);
                            } else {
                                if(messages && messages.length) {
                                    Photo.populate(messages, { 
                                        path: '_userId.photos',
                                        select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
                                    }, function(err, messages) {
                                        if(err) {
                                            res.status(500).json(err);
                                        } else {
                                            if(messages) {
                                                res.json(messages);
                                            } else {
                                                res.status(404).json(null);
                                            }
                                        }
                                    });
                                } else {
                                    res.status(404).json(null);
                                }
                            }
                        });
                    } else {
                        res.status(404).json(null);
                    }
                    
                }    
            });
};

exports.getAllMessages = function(req, res) {
    var userId = req.params.userId;
    var params = { _userId: userId };
    Channel.find()
           .or([
                 { _userId: userId },
                 { _contactUserId: userId }
            ])
           .lean()
           .select('_id messages')
           .exec(function(err, channels) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    console.log(channels);
                    if(channels) {
                        var messages = _.pluck(channels, "messages");
                        console.log(messages);
                        Message.find({
                            _id: {
                                $in: messages
                            }
                        })
                        .lean()
                        .select('_userId message')
                        .populate({
                            path: '_userId',
                            select: 'public_details.first_name public_details.last_name photos created'
                        })
                        .sort('-created')
                        .limit(100)
                        .exec(function(err, messages) {
                            if(err) {
                                res.status(500).json(err);
                            } else {
                                if(messages && messages.length) {
                                    Photo.populate(messages, { 
                                        path: '_userId.photos',
                                        select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
                                    }, function(err, messages) {
                                        if(err) {
                                            res.status(500).json(err);
                                        } else {
                                            if(messages) {
                                                res.json(messages);
                                            } else {
                                                res.status(404).json(null);
                                            }
                                        }
                                    });
                                } else {
                                    res.status(404).json(null);
                                }
                            }
                        });
                    } else {
                        res.status(404).json(null);
                    }
                    
                }    
            });
};

exports.getChannelMessages = function(req, res) {
    var channelId = req.params.channelId;

    getHistory(channelId, function(err, history) {
                    if(err) {
                        res.status(500).json(err);
                    } else {
                        if(history) {
                            res.json(history);
                        } else {
                            res.status(404).json(null);
                        }
                    }
                });    
}

exports.readChannelMessages = function(req, res) {
    var channelId = req.params.channelId;
    var userId = req.params.userId;

    Message.update({
        _channelId: channelId,
        _userId : {
            $ne: userId
        }
    }, {
        $set: { isRead: true }
    }, {
        multi: true
    }).exec(function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(200).json({ message: "OK" });
        }
    });
}

exports.readUserMessages = function(req, res) {
    var userId = req.params.userId;

    Message.update({
        _userId: userId
    }, {
        $set: { isRead: true }
    }, {
        multi: true
    }).exec(function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(200).json({ message: "OK" });
        }
    });
}




exports.deleteAll = function(req, res) {
    
    Channel.remove({}, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            Message.remove({}, function(err) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.json({ message: 'Channels deleted!' });
                }
            })
            
        }
    });
};

exports.deleteMyChannels = function(req, res) {

    var userId = req.params.userId;
    var params = { _userId: userId };
    Channel.find(params)
           .lean()
           .select('messages')
           .exec(function(err, channels) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    if(channels) {
                        Message.remove({ 
                                _channelId: {
                                    $in : channels.messages
                                }
                            }).exec();
                        Channel.remove(params).exec();
                        res.json({ message: 'Channels deleted!' });
                    } else {
                        res.status(404).json(null);
                    }
                }    
            });
};