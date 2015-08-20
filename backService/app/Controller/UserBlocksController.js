/**
User controller
*/

var User = require('../Model/User'), 
    Block = require('../Model/UserBlock');

// endpoint /user/:id/blocks
exports.getMyBlocklist = function(req, res) {
    var userId = req.params.userId;
    Block.find({ _userId: userId })
         .lean()
         .populate({
            path: '_blockedUserId'
         })
         .exec(function(err, blocks) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.json({ status: 1, error: false, data: blocks});
                }
            });
}

function blockAUser(params, fn) {
    Block.insert(params, function(err, blockRes) {
        if(err) {
            fn(err);
        } else {
            //console.log(blockRes._id);
            User.findByIdAndUpdate(params._userId, {
                $push: {
                    blockedUsers: blockRes._blockedUserId
                }
            }, function(err) {
                if(err) {
                    fn(err);
                } else {
                    fn(null);
                }
            });
            
        }
    });
}

// Create endpoint /user/:userId/blocks for POST
exports.blockUser = function(req, res) {
    var params = req.body;
    params._userId = req.params.userId;
    var checkOptions = {
        _userId: params._userId,
        _blockedUserId: params._blockedUserId
    };
    Block.findOne(checkOptions)
         .lean()
         .exec(function(err, blockPres) {
            if(blockPres) {
                res.status(200).json({ message: 'The user is already in your block list!' });
            } else {
                blockAUser(params, function(err) {
                    if(err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).json({ message: 'Block performed!' });
                    }
                })
            }
         });
    ;
    
};

exports.removeAllBlocks = function(req, res) {
    Block.remove({}, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            User.update({}, {
                $set: {
                    blockedUsers: []
                }
            }, { multi: true }, function(err) {
                if(err) {
                    console.log(err);
                }
            });
            res.json({ message: 'Block removed!' });
        }
    })
}

exports.allBlocks = function(req, res) {
    Block.find({}, function(err, blocks) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.json(blocks);
        }
    })
}


exports.removeBlock = function(req, res) {
    var blockId = req.params.id;

    Block.remove({ _id: blockId }, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            User.findByIdAndUpdate(userId, {
                $pull: {
                    blockedUsers: blockId
                }
            }, function(err) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.json({ message: 'Block removed!' });
                }
            });
            
        }
    });
}

exports.removeUserBlock = function(req, res) {
    var blockedUserId = req.params.blockedUserId;
    var userId = req.params.userId;
    Block.findOne({ 
        _userId: userId, 
        _blockedUserId: blockedUserId
    }).lean().exec(function(err, blockRes) {
        if(err) {
            res.status(500).json(err);
        } else {
            if(blockRes) {
                User.findByIdAndUpdate(userId, {
                    $pull: {
                        blockedUsers: blockRes._id
                    }
                }, function(err) {
                    if(err) {
                        res.status(500).json(err);
                    } else {
                        Block.remove({ 
                            _userId: userId, 
                            _blockedUserId: blockedUserId
                        }).exec();
                        res.json({ message: 'Block removed!' });
                    }
                });
            } else {
                res.status(404).json(null);
            }
        }
    });
}