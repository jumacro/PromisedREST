/**
* User schema
* Copyright(c) 2015 Mithun Das (https://github.com/mithundas79)
* MIT Licensed
*/

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    _id					: ObjectId,
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

// Date setter
/*UserSchema.path('date')
    .default(function(){
        return new Date()
    })
    .set(function(v){
        return v == 'now' ? new Date() : v;
    });*/

module.exports = mongoose.model('User', UserSchema);