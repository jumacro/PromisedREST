var User = require('../Model/User'),
	_    = require('underscore'),
	async = require('async'),
	Post = require('../Model/Post'),
	PostResponse = require('../Model/PostResponse'),
	Photo = require('../Model/Photo');

//Model.update = function ({}, {cid: ''}, {multi: true}, function(err) { ... });

exports.makeUserOffline = function(fn) {
	User.update({}, {
		$set: {
			online: false
		}
	}, { multi: true }, function(err) {
		if(err) {
			fn(err);
		} else {
			fn();
		}
	});
}


exports.expirePosts = function(fn){
	var dateNow = new Date();
	var dateObj = dateNow.toISOString();
	//console.log(dateObj);
	Post.update({
        expiryTime: {
			$lte: dateNow
		}, 
        status: true 
    }, {
        $set: { status: false }
    }, {
        multi: true
    }).exec(function(err, numAffected) {
        if(err) {
            fn(err)
        } else {
        	//console.log(numAffected);
            fn();
        }
    });
}

exports.createMatches = function(fn) {
	User.find({})
		.lean()
		.select('public_details preferences blockedUsers matchedUsers')
		.exec(function(err, users) {
			if(err) {
				fn(err);
			} else {
				if(users) {
					//console.log('found users');
					async.each(users, function(user, callback) {
						//console.log('async started');
						matchedUsers(user, function(err, userIds) {
							if(err) {
								callback(err);
							} else {
								//console.log('match done');
								if(userIds) {
									if(userIds.length) {
										//console.log(userIds);
										//save the matched users
										//var matchedUsers = _.union(user.matchedUsers, userIds);
										User.update({
									        _id: user._id 
									    }, {
									        $set: { matchedUsers: userIds }
									    }).exec(function(err) {
									    	if(err) {
												calback(err);
											} else {
												//console.log('match updated');
												callback();
											}
									    });	
									} else {
										callback();
									}
									
								} else {
									callback();
								}
							}
						})
					}, function(err) {
						if(err) {
							//fn(err);
							fn(err);
						} else {
							fn(null);
						}

					});

				} else {
					//fn();
					fn(null);
				}
				
			}
		});
}

exports.getMatchedUsers = function(user, fn){
	matchedUsers(user, function(err, userIds) {
		if(err) {
			fn(err, false);
		} else {
			if(userIds) {
				fn(false, userIds);
			} else {
				fn(false, false);
			}
		}
	});
}


function matchedUsers(user, fn) {

	//console.log(user);
	if(user.preferences) {
		var $myAgePrefHigher = user.preferences.age_like.higher_pref;
		var $myAgePrefLower  = user.preferences.age_like.lower_pref;
		var $myAge     		= user.public_details.age;
		var $myBlockedUsers  = [];

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
		//array1.concat(array2)
		$myBlockedUsers.push(user._id);
		if(user.blockedUsers) {
			if(user.blockedUsers.length) {
				//console.log(user.blockedUsers);
				$myBlockedUsers.concat(user.blockedUsers);
				//console.log($myBlockedUsers);
			}			
		}
		$condition._id = {
			$nin: $myBlockedUsers
		};

		//console.log($condition);
		
		User.find($condition)
			.lean()
			.select('_id')
			.exec(function(err, users) {
				if(err) {
					fn(err, false);
				} else {
					var userIds = [];
					if(users) {
						userIds = _.pluck(users, "_id");
					}
					fn(false, userIds);
				}
			});

	} else {
		fn(false, false);
	}
	
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};