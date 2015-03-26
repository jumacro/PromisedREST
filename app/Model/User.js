/**
* User schema
* Copyright(c) 2015 Mithun Das (https://github.com/mithundas79)
* MIT Licensed
*/

var mongoose = require('mongoose'),
    Bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    username			: {
    	type: String, 
    	required: true,
    	index: {
    		unique: true
    	}
    },
    password			: {
    	type: String, 
    	required: true
    },
    email				: {
    	type: String,
    	required: true,
    	trim: true,
    	index: {
    		unique: true,
    		sparse: true
    	}
    },
    emailVerified	    : {
    	type: Boolean,
        default: 1
    },
    verificationToken	: {
    	type: String,
        default: null
    },
    created			: {
        type: Date,
        default: Date.now
    },
    modified		: {
        type: Date,
        default: Date.now
    }
});

/**
Before save argument for the user schema...
Hashes the password before saving
*/
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  Bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    Bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});
/**
Schema method to verify input password
*/
UserSchema.methods.verifyPassword = function(password, callback) {
  Bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};
module.exports = mongoose.model('User', UserSchema);