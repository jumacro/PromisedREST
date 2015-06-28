/**
Friend controller
*/

var Friend = require('../Model/Friend');

/** Friend CRUD **/

/**
* Friend posts /// before inserting it expires all the post with status true
**/
exports.postUserFriends = function(req, res) {
    var params = req.body;
    params._userId = req.params.userId;
    Friend.insert(params, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(201).json({ message: 'Friend is added!' });
        }
    });
    
};

/**
* Get user friends
**/
exports.getUserFriends = function(req, res) {
    var userId = req.params.userId;
    Friend.find({ _userId: userId }, function(err, friends) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(friends);
        }    
    });
};

/**
* Delete friend
**/
exports.deleteFriend = function(req, res) {
    var friendId = req.params.id;
    Friend.remove({ _id: friendId }, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.json({ message: 'Friend is deleted!' });
        }
    });
}