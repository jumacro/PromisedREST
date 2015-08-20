/**
* User schema
* Stores the registered user data
* Copyright(c) 2015 Jumacro Software Services Pvt. Ltd.
*/

var mongoose = require('mongoose'),
    Bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//var relative tables

var Device = require('./Device');

var UserSchema = new Schema({
    username: {  //Only used by Admin
        type: String, 
        default: ''
    },
    password: { //Only used by Admin
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: {
            unique: true,
            sparse: true
        }
    },
    social_details: {
        facebookId: { //The id of the users facebook
            type: String,
            required: true,
            index: {
                unique: true,
            }
        }
    },    
    public_details: {  //data being fetched from Facebook Id
        first_name: { 
            type: String,
            default: ''
        },
        last_name: { 
            type: String,
            default: ''
        },
        gender: {  // Valid values are M/F
            type: String,
            default : 'M',
            enum : ['M', 'F']
        },
        birthday: {
            type: Date,
            default: Date.now
        },
        age: {  //Should be auto calculated from dob
            type: Number,
            default: 0
        },
        bio: {
            type: String,
            default: ''
        },
        about: {   //will be GET from Facebook API
            type: String,
            default: ''
        },
        location: {  //store coordinates in this order: longitude, latitude.
            index: '2d',
            type: [Number],
            default: [0,0]
        }

    },
    isAdmin           : {  //Checks if the user is an admin or not
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: true
    },
    status              : {
        type: Boolean,
        default: true
    },
    created             : {
        type: Date,
        default: Date.now
    },
    modified            : {
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

  /*if (this.isNew && Array.isArray(this.location) && 0 === this.location.length) {
    this.location = undefined;
  }*/

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

UserSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Device.remove({_userId: this._id}).exec();
    next();
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
/** 
Schema method to add User by passed params
**/
UserSchema.statics.insert = function(params, callback) {
    delete params.photos;
    var newUser = {};
    for (prop in params) {
        newUser[prop] = params[prop];
    }
    var user = new this(newUser);
    user.save(function(err, user) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, user)

        }

    });

};
module.exports = mongoose.model('User', UserSchema);