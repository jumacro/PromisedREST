var User  = require('../Model/User'),
	_    = require('underscore'),
    Post  = require('../Model/Post'),
    Feed  = require('../Component/Feed'),
    PostResponse = require('../Model/PostResponse'),
    Channel  = require('../Model/Channel')
    Message  = require('../Model/Message');

function checkForFeeds(matchedUsers, created, fn) {
	if(matchedUsers) {
		Post.find({ _userId: {
			$in: matchedUsers
		}, created : { 
			$gte: created
		}, status: true }).exec(function(err, posts) {
			if(err) {
				fn(err, false);
			} else {
				//console.log(posts);
				if(posts && posts.length) {
					fn(false, true);
				} else {
					fn(false, false);
				}
			}
		});
	} else {
		fn(false, false);
	}
}

function checkForResponses(posts, fn) {
	if(posts) {
		PostResponse.find({
			_postId: {
				$in: posts
			},
			isRead: false
		}).exec(function(err, responses) {
			if(err) {
				fn(err, false);
			} else {
				//console.log(responses);
				if(responses && responses.length) {
					fn(false, true);
				} else {
					fn(false, false);
				}
			}
		});
	} else {
		fn(false, false);
	}
}

function checkForMessages(userId, fn) {
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
		   		if(err) {
		   			fn(err, false);
		   		} else {
		   			if(channels && channels.length) {
		   				var channelIds = _.pluck(channels, "_id");
		   				console.log(channelIds);
		   				Message.find({ 
		   					_channelId: {
		   						$in: channelIds
		   					},
		   					isRead: false,
		   					_userId: {
		   						$ne: userId
		   					}
		   				})
		   				.lean()
		   				.exec(function(err, messages) {
		   					if(err) {
		   						fn(err, false);
		   					} else {
		   						if(messages && messages.length) {
		   							fn(false, true);
		   						} else {
		   							fn(false, false);
		   						}
		   					}
		   				});
		   			} else {
		   				fn(false, false);
		   			}
		   		}
		   });
}


exports.notify = function(req, res) {
	var userId = req.params.userId;
	var dateObj = new Date();
	var created = dateObj.toISOString();
	var eventObj = {
		feeds: false,
		responses: false,
		messages: false,
		date: created
	};
	//console.log()

	if(req.query.created) {
		created = req.query.created;
	}
	console.log(created);

	User.findOne({_id: userId})
		.lean()
		.exec(function(err, user) {
			if(err) {
				res.status(500).json(err);
			} else {
				if(user) {
					//console.log(user);
					//console.log('here');
					//console.log(user.online);
					if(!user.online) {
						//console.log('here');
						User.update({_id: userId},{
							$set : {
								online: true
							}
						} ).exec();
					}
					checkForFeeds(user.matchedUsers, created, function(err, feeds) {
						if(err) {
							res.status(500).json(err);
						} else {
							if(feeds) {
								eventObj.feeds = true
							}
							checkForResponses(user.posts, function(err, responses) {
								if(err) {
									res.status(500).json(err);
								} else {
									if(responses) {
										eventObj.responses = true;
									}
									checkForMessages(userId, function(err, messages) {
										if(err) {
											res.status(500).json(err);
										} else {
											if(messages) {
												eventObj.messages = true;
											}
											res.json(eventObj);
										}
									})
								}
							})
						}
					})
										
					
				} else {
					res.status(404).json(null);
				}
			}
		});
}