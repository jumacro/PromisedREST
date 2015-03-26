/**
* OauthClient schema
* Copyright(c) 2015 Mithun Das (https://github.com/mithundas79)
* MIT Licensed
*/

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var OauthClientSchema = new Schema({
    name                : {
        type: String, 
        required: true,
        index: {
            unique: true
        }
    },
    userId             : {
        type: String,
        required: true
    },
    clientId            : {
        type: String, 
        required: true
    },
    clientSecret        : {
        type: String, 
        required: true
    },
    created         : {
        type: Date,
        default: Date.now
    },
    modified        : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OauthClient', OauthClientSchema);