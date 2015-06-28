/*
Photo Controller
*/
var Photo = require('../Model/Photo'),
	User  = require('../Model/User'),
	Image = require('../Component/Image');

exports.postUserProfilePhoto = function(req, res) {
	var params = {};
	params.photo = req.body.photos[0];
	params._userId = req.params.userId;
	params.photo_type = 'profile';
	Image.uploadImage(params.photo, function(image) {
		params.cloudinary = image;
		Photo.insert(params, function(err, photo) {
	        if(err) {
	            res.status(500).json(err);
	        } else {
	        	if(photo) {
	        		User.findByIdAndUpdate(photo._userId, {
		                $push: {
		                    photos: photo._id
		                }
		            }, {upsert: true}, function(err) {
		                if(err) {
		                    res.status(500).json(err);
		                } else {
		                    res.status(201).json({ message: 'Photo is added!', photo: photo });
		                }
		            });
	        	}
	            
	        }
	    });
	});
}

//need to change it to async --- do not use in pproduction for now
exports.postUserProfilePhotoBulk = function(req, res){

	var params = {};
	params.photo = [];
	params.photo = req.body.photo;
	//console.log(params);
	params._userId = req.params.userId;
	params.photo_type = 'profile';
	var i;
		for(i=0; i<params.photo.length; i++) {
			Image.uploadImage(params.photo[i], function(image) {
				params.cloudinary = image;
				Photo.insert(params, function(err) {
					if(err) {
						res.status(500).json(err);
					} else{
						
					}
				});
			});
			if((params.photo.length-1) == i) {
				res.status(200).json({ message: 'Buk upload successfull' });
			}

		}
	

}

exports.postUserPostPhoto = function(req, res) {
	var params = {};
	params.photo = req.files.photo.path;
	params._userId = req.params.userId;
	params._postId = req.params.postId;
	params.photo_type = 'post';
	Image.uploadImage(params.photo, function(image) {
		params.cloudinary = image;
		Photo.insert(params, function(err) {
	        if(err) {
	            res.status(500).json(err);
	        } else {
	            res.status(201).json({ message: 'Photo is added!', params: params });
	        }
	    });
	});
}

exports.getUserPhotos = function(req, res) {
	 var userId = req.params.userId;
	 Photo.find({ _userId: userId, photo_type: 'profile' })
	 	  .lean()
	 	  .exec(function(err, photos) {
	 	  		if(err) {
	 	  			res.status(500).json(err);
	 	  		} else {
	 	  			res.status(200).json(photos);
	 	  		}
	 	  });
}

exports.getUserPostPhotos = function(req, res) {
	var userId = req.params.userId;
	var postId = req.params.postId;
	Photo.find({ _postId: postId, photo_type: 'post' })
	 	  .lean()
	 	  .populate('_userId')
	 	  .populate('_postId')
	 	  .exec(function(err, photos) {
	 	  		if(err) {
	 	  			res.status(500).json(err);
	 	  		} else {
	 	  			res.status(200).json(photos);
	 	  		}
	 	  });
}

exports.deleteUserPhotos = function(req, res) {
    var userId = req.params.userId;
    User.findOne({_id: userId})
		.lean()
		.exec(function(err, user) {
			if(err) {
				res.status(500).json(err);
			} else {
				if(user) {
					var allPhotos = user.photos;
					User.update({_id: userId}, {
						$pull : { 
                            photos : {
                                $in : allPhotos
                            } 
                        }
					}, function(err) {
						if(err) {
							res.status(500).json(err);
						} else {
							Photo.remove({_userId: userId}).exec();
							res.json({ message: 'Photos are deleted!' });
						}
					});
				}
			}
		});
}

