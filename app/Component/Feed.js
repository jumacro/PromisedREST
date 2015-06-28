var User = require('../Model/User'),
	_    = require('underscore'),
	async = require('async'),
	Post = require('../Model/Post'),
	PostResponse = require('../Model/PostResponse'),
	Photo = require('../Model/Photo');



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

