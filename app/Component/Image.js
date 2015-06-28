var cloudinary = require('cloudinary'),
	Config = require('../Config/Config'); //Config loaded 

cloudinary.config({ 
  cloud_name: Config.cloudinary.cloud_name, 
  api_key: Config.cloudinary.api_key, 
  api_secret: Config.cloudinary.api_secret
});

//http://res.cloudinary.com/demo/image/upload/couple.jpg


exports.uploadImage = function(imageResource, callback) {
	//console.log(imageResource);
	//callback(false, imageResource);
	if(imageResource.cloudinary) {
		callback(imageResource, 'old');
	} else {
		cloudinary.uploader.upload(imageResource, function(image){
			//console.log(image);
		  	callback(image, 'new');
		});	
	}
	
}