var User = require('../Model/User'),
	_    = require('underscore'),
	async = require('async'),
	Post = require('../Model/Post'),
	PostResponse = require('../Model/PostResponse'),
	Photo = require('../Model/Photo');


function matchedUsers(user, fn) {

	//console.log(user);
	var $myAgePrefHigher = user.preferences.age_like.higher_pref;
	var $myAgePrefLower  = user.preferences.age_like.lower_pref;
	var $myAge     		= user.public_details.age;
	var $myBlockedUsers  = user.blockedUsers;
	//console.log(myAge);

	var $myGenderPref = user.preferences.gender_like;
	var $myGender = user.public_details.gender;

	var $distance = user.preferences.proximity; 
	var $maxDistance = ($distance / 1609.34); //formula 1 mile is 1609.34 meters
	//console.log(user.location);
	var $myLocation = [parseFloat(user.public_details.location[0]), parseFloat(user.public_details.location[1])];

	/**

	his/her gender v/s my preferred gender
	his/her preferred gender v/s my gender
	his/her age bewteen my preferred age range
	his/her location in my preferred distance range

	**/

	var $condition = {
			"public_details.gender": $myGenderPref,
			"preferences.gender_like": $myGender,
			"public_details.age": { $gte: $myAgePrefLower, $lte: $myAgePrefHigher },			
			"public_details.location": {
		        $near: $myLocation,
		        $maxDistance: $distance
		    }
	};

	if($myBlockedUsers) {
		$myBlockedUsers.push = user._id;
		$condition._id = {
			$nin: $myBlockedUsers
		}
	}

	//console.log($condition);
	
	User.find($condition)
		.lean()
		.select('_id')
		.exec(function(err, users) {
			if(err) {
				fn(err, false);
			} else {
				fn(false, users);
			}
		});
}

exports.feedPosts = function(matchedUsers, skip, limit, fn) {
	var postCondition = {
		_userId: {
			$in : matchedUsers
		},
		status: true
	};
	//find post by conditions
	Post.find(postCondition)
		.lean()
		.select('post_message venue responses _userId photos created')
		.populate({
            path: '_userId',
            select: 'social_details public_details preferences email facebookId photos created'
        })
		.populate({
            path: 'photos',
            match: { photo_type: 'post' },
            select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
        })
        .populate({
            path: 'responses',
            select: 'response _userId created'
        })
        .sort('-created')
        .skip(skip)
        .limit(limit)
        .exec(function(err, posts) {
        	if(err) {
        		fn(err, false);
        	} else {
        		if(posts) {
        			async.each(posts, function(post, callback) {
						var photos = post._userId.photos;
						if(photos) {
							Photo.find({ _id : {
								$in : photos
							}, photo_type: 'profile'})
							.lean()
							.select('cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created')
							.exec(function(err, photos) {
								if(err) {
									callback(err);
								} else {
									post._userId.photos = photos;
									callback();
								}
							});
						} else {
							callback();
						}
						

					}, function(err) {
						if(err) {
							fn(err, false);
						} else {
							fn(false, posts);
						}

					});
        		} else {
        			fn(false, false);
        		}
        	}
        });
}

exports.feeds = function(user, fn) {

	matchedUsers(user, function(err, users) {
		if(err) {
			fn(err, false);
		} else {
			if(users) {
				var userIds = _.pluck(users, "_id");
				var postCondition = {
					_userId: {
						$in : userIds
					},
					status: true
				};
				Post.find(postCondition)
					.lean()
					.populate({
			            path: '_userId',
			            select: 'public_details preferences email facebookId photos created'
			        })
					.populate({
			            path: 'photos',
			            match: { photo_type: 'post' },
			            select: 'cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created'
			        })
			        .populate({
			            path: 'responses',
			            select: 'response _userId created'
			        })
			        .sort('-created')
			        .exec(function(err, posts) {
			        	if(err) {
			        		fn(err, false);
			        	} else {
			        		if(posts) {
			        			async.each(posts, function(post, callback) {
									var photos = post._userId.photos;
									if(photos) {
										Photo.find({ _id : {
											$in : photos
										}, photo_type: 'profile'})
										.lean()
										.select('cloudinary.public_id cloudinary.format cloudinary.width cloudinary.height created')
										.exec(function(err, photos) {
											if(err) {
												callback(err);
											} else {
												post._userId.photos = photos;
												callback();
											}
										});
									} else {
										callback();
									}
									

								}, function(err) {
									if(err) {
										fn(err, false);
									} else {
										fn(false, posts);
									}

								});
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

exports.isAnyFeed = function(user, created, fn){

	matchedUsers(user, function(err, users) {
		if(err) {
			fn(err, false);
		} else {
			if(users) {
				var userIds = _.pluck(users, "_id");
				var postCondition = {
					_userId: {
						$in : userIds
					},
					status: true,
					created: {
						$gte: created
					}
				};
				Post.find(postCondition)
					.lean()
					.select('_id')
			        .exec(function(err, posts) {
			        	if(err) {
			        		fn(err, false);
			        	} else {
			        		//console.log(count(posts));
			        		if(posts) {
			        			var postIds = _.pluck(posts, "_id");

			        			fn(false, postIds);
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

exports.isAnyNewFeed = function(user, created, fn){

	matchedUsers(user, function(err, users) {
		if(err) {
			fn(err, false);
		} else {
			if(users) {
				var userIds = _.pluck(users, "_id");
				var postCondition = {
					_userId: {
						$in : userIds
					},
					status: true,
					created: {
						$gte: created
					}
				};
				Post.find(postCondition)
					.lean()
					.select('_id')
			        .exec(function(err, posts) {
			        	if(err) {
			        		fn(err, false);
			        	} else {
			        		//console.log(count(posts));
			        		if(posts) {
			        			var postIds = _.pluck(posts, "_id");
			        			
			        			fn(false, postIds);
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