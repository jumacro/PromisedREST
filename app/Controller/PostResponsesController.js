/*
PostResponse Controller
*/
var PostResponse = require('../Model/PostResponse'),
	Post   = require('../Model/Post'),
	Photo  = require('../Model/Photo'),
	async = require('async'),
	User   = require('../Model/User'),
    PushNotification   = require('../Component/PushNotification');

function sendPushNotification (replierId, notifierId) {

    User.findOne({ _id: replierId })
        .lean()
        .select('public_details')
        .exec(function(err, user) {
            if(user) {
                var message = user.public_details.first_name + " just responded to your Dip!"
                PushNotification.sendNotifications(message, "soundName", notifierId);
            }
        });

}

function pushResponses(postResponse, fn) {
	Post.findByIdAndUpdate(postResponse._postId, {
        $push: {
            responses: postResponse._id
        }
    }, {upsert: true}, function(err) {
        if(err) {
            fn(err);
        } else {
            fn(false);
        }
    });
}


function postResponse(params, fn) {

	PostResponse.insert(params, function(err, postResponse) {
        if(err) {
            fn(err, false);
        } else {
        	if(postResponse) {
        		pushResponses(postResponse, function(err) {
        			if(err) {
	                    fn(err, false);
	                } else {
	                	//response posted successfully -> need push notification code here
	                	Post.findOne({_id: postResponse._postId})
	                		.lean()
	                		.select('_userId')
	                		.exec(function(err, post) {
	                			if(err) {
	                				fn(err, false);
	                			} else {
	                				if(post) {
	                					sendPushNotification(postResponse._userId, post._userId);
	                				}
	                				fn(false, postResponse);
	                			}
	                		});
	                    
	                }
        		});
        	}
            
        }
    });
}


function getAllResponses(params, fn) {

	PostResponse.find(params)
				.lean()
				.select('_userId response _postId isRead created')
				.populate({
		            path: '_userId',
		            select: 'public_details social_details photos'
		        })
		        .populate({
		            path: '_postId',
		            select: 'post_message venue created' 
		        })
		        .sort('-created')
		        .limit(100)
				.exec(function(err, responses) {
					if(err) {
						fn(err, false);
					} else {
						//console.log(responses);
						async.each(responses, function(response, callback) {
							if(response._userId) {
								photos = response._userId.photos;
								Photo.find({ _id : {
									$in : photos
								}, photo_type: 'profile'})
								.lean()
								.select('cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created')
								.exec(function(err, photos) {
									if(err) {
										callback(err);
									} else {
										response._userId.photos = photos;
										
										Post.findOne({ _userId: response._userId._id, status: true })
										    .lean()
										    .populate({
									            path: 'photos',
									            select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
									        })
										    .exec(function(err, post) {
										    	if(err) {
										    		callback(err);
										    	} else {
										    		if(post) {
										    			response._userId.posts = post;
										    		}
										    		callback();
										    	}
										    });										
									}
								});	
							} else {
								callback();
							}
							

						}, function(err) {
							if(err) {
								fn(err, false);
							} else {
								fn(false, responses);
							}

						});
					}
				});
}

function getAResponse(params, fn) {

	PostResponse.findOne(params)
				.lean()
				.select('_userId response isRead created')
				.populate({
		            path: '_userId',
		            select: 'public_details social_details photos'
		        })
				.exec(function(err, response) {
					if(err) {
						fn(err, false);
					} else {
						var photos = response._userId.photos;
						Photo.find({ _id : {
							$in : photos
						}, photo_type: 'profile'})
						.lean()
						.select('cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created')
						.exec(function(err, photos) {
							if(err) {
								fn(err, false);
							} else {
								response._userId.photos = photos;
								fn(false, response);
							}
						});
					}
				});
}

exports.addResponse = function(req, res) {
	var params = {};
	params = req.body;
	params._postId = req.params.postId;
	//console.log(params);
	postResponse(params, function(err, postResponse) {
        if(err) {
            res.status(500).json(err);
        } else {
        	res.status(201).json(postResponse);            
        }
    });
}

exports.updateResponse = function(req, res) {
	var params = {};
	params = req.body;
	var responseId = req.params.id;
	var options = {
        upsert: true
    }
	PostResponse.findByIdAndUpdate(responseId, params, options, function(err) {
		if(err) {
            res.status(500).json(err);
        } else {
        	getAResponse(params, function(err, response) {
        		if(err) {
		            res.status(500).json(err);
		        } else {
		        	res.status(200).json(response);    
		        }
        	});
        	        
        }
	});
}

function markAllPostResponseToRead(params, fn) {
	PostResponse.update(params, {
        $set: { isRead: true }
    }, {
        multi: true
    }).exec(function(err) {
        if(err) {
            fn(err);
        } else {
            fn();
        }
    });
}

exports.markAsRead = function(req, res) {
	var postId = req.params.postId;
	var options = {
		_postId: postId
	};
	markAllPostResponseToRead(options, function(err) {
		if(err) {
            res.status(500).json(err);
        } else {
            res.status(200).json({ message: 'OK' });
        }
	});
}

exports.markAllAsRead = function(req, res) {
	var userId = req.params.userId;
	 User.findOne({_id: userId})
	 	 .lean()
	 	 .select('posts')
	 	 .exec(function(err, user) {
	 	 	if(err) {
	 	 		res.status(500).json(err)
	 	 	} else {
	 	 		if(user) {
	 	 			var options = { 
	 	 				_postId: {
	 	 					$in: user.posts
	 	 				} 
	 	 			};
	 	 			markAllPostResponseToRead(options, function(err) {
						if(err) {
				            res.status(500).json(err);
				        } else {
				            res.status(200).json({ message: 'OK' });
				        }
					});
	 	 		} else {
	 	 			res.status(404).json(null)
	 	 		}
	 	 	}
	 	 })


}



exports.getResponses = function(req, res) {
	 var postId = req.params.postId;
	 var options = { _postId: postId };
	 getAllResponses(options, function(err, responses) {
	 	  if(err) {
	 	  	  res.status(500).json(err);
	 	  } else {
	 	  	  res.status(200).json(responses);
	 	  }
	 });
}




exports.getMyResponses = function(req, res) {
	 var userId = req.params.userId;
	 User.findOne({_id: userId})
	 	 .lean()
	 	 .select('posts')
	 	 .exec(function(err, user) {
	 	 	if(err) {
	 	 		res.status(500).json(err)
	 	 	} else {
	 	 		if(user) {
	 	 			if(user.posts) {
	 	 				if(user.posts.length) {
	 	 					//console.log(user.posts);
	 	 					var lastIndex = (user.posts.length-1);
	 	 					var postId = user.posts[lastIndex];
	 	 					var options = { 
			 	 				_postId: postId
			 	 			};
			 	 			//console.log(options);
			 	 			getAllResponses(options, function(err, responses) {
							 	  if(err) {
							 	  	  res.status(500).json(err);
							 	  } else {
							 	  		if(responses) {
							 	  			res.status(200).json(responses);
							 	  		} else {
							 	  			res.status(404).json(null)
							 	  		}
							 	  	  
							 	  }
							 });
	 	 				}
	 	 			}
	 	 		} else {
	 	 			res.status(404).json(null)
	 	 		}
	 	 	}
	 	 })


	 
	 
}

exports.responseById = function(req, res) {
	var responseId = req.params.id;

	getAResponse(responseId, function(err, response) {
		if(err) {
			res.status(500).json(err);
		} else {
			res.json(response);
		}
	})

}


exports.deleteResponses = function(req, res) {
    var postId = req.params.postId;
    Post.findOne({_id: postId})
		.lean()
		.exec(function(err, post) {
			if(err) {
				res.status(500).json(err);
			} else {
				if(post) {
					var allPostResponses = post.responses;
					Post.update({_id: postId}, {
						$pull : { 
                            responses : {
                                $in : allPostResponses
                            } 
                        }
					}, function(err) {
						if(err) {
							res.status(500).json(err);
						} else {
							PostResponse.remove({_postId: postId}).exec();
							res.json({ message: 'Responses are deleted!' });
						}
					});
				}
			}
		});
}

exports.deleteAResponse = function(req, res) {
	var postId = req.params.postId;
    var id = req.params.id;
    Post.update({_id: postId}, {
			$pull : { 
                responses : id
            }
		}, function(err) {
			if(err) {
				res.status(500).json(err);
			} else {
				PostResponse.remove({_id: id}).exec();
				res.json({ message: 'Response is deleted!' });
			}
		});
}

exports.deleteAll = function(req, res) {
	PostResponse.remove({}).exec(function(err) {
		if(err) {
			res.status(500).json(err);
		} else {
			res.json(null);
		}
	});
}