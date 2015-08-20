/**
* Report schema
* Stores the user reports
* Copyright(c) 2015 Virgin Labs
* MIT Licensed
*/

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReportSchema = new Schema({
    _userId: { 
        type: ObjectId,
        ref: 'User'
    },
    _postId: {  
        type: ObjectId,
        ref: 'Channel'
    },
    _reportedUserId: {  
        type: ObjectId,
        ref: 'Channel'
    },
    report: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/** 
Schema method to add Report by passed params
**/
ReportSchema.statics.insert = function(params, callback) {
    console.log(params);
    var newReport = {};
    for (prop in params) {
        newReport[prop] = params[prop];
    }
    var report = new this(newReport);
    report.save(function(err, report) {
        if (err) {
            callback(err, false);
        } else {
            callback(false, report);
        }

    });

};


module.exports = mongoose.model('Report', ReportSchema);