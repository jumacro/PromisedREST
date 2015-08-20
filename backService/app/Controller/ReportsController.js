/**
Report controller
*/

var Report = require('../Model/Report'),
    User = require('../Model/User'),
    Post = require('../Model/Post'),
    Nodemailer = require('nodemailer');

var Transporter = Nodemailer.createTransport();

// endpoint /user/:id/reports
exports.getMyReportlist = function(req, res) {
    var userId = req.params.userId;
    Report.find({ _userId: userId })
         .lean()
         .exec(function(err, reports) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.json(reports);
                }
            });
}

// Create endpoint /user/:userId/reports for POST
exports.reportUser = function(req, res) {
    var params = req.body;
    params._userId = req.params.userId;
    Report.insert(params, function(err, reportRes) {
        if(err) {
            res.status(500).json(err);
        } else {
            User.findOne({ _id: req.params.userId })
                .lean()
                .exec(function(err, user) {
                    User.findOne({ _id: reportRes._userId })
                        .lean()
                        .select('public_details')
                        .exec(function(err, reportedUser) {
                            var reportedByName = user.public_details.first_name + " " + user.public_details.last_name;
                            var reportedUserName = reportedUser.public_details.first_name + " " + reportedUser.public_details.last_name;
                            var subject = "Flaggged User - " + reportRes.report;
                            var messageHtml = "Reported by - " + reportedByName + "<br />";
                                messageHtml += "Reported User - " + reportedUserName + "<br />";
                                messageHtml += "Reported Topic - " + reportRes.report + "<br />";
                                messageHtml += "Reported Time - " + reportRes.created + "<br />";
                            Transporter.sendMail({
                                from: user.email,
                                to: 'help@virginlabsinc.com',
                                subject: subject,
                                html: messageHtml,
                                generateTextFromHTML: true
                            }); 
                            res.status(200).json({ message: 'Report performed!' });  
                        });
                    
                    
                });
            
            
            
        }
    });
};

// Create endpoint /user/:userId/reports for POST
exports.reportPost = function(req, res) {
    var params = req.body;
    params._userId = req.params.userId;
    params._postId = req.params.postId;
    Report.insert(params, function(err, reportRes) {
        if(err) {
            res.status(500).json(err);
        } else {
            User.findOne({ _id: req.params.userId })
                .lean()
                .exec(function(err, user) {
                    Post.findOne({ _id: reportRes._postId })
                        .lean()
                        .populate('_userId')
                        .exec(function(err, post) {
                            var reportedByName = user.public_details.first_name + " " + user.public_details.last_name;
                            var reportedUserName = post._userId.public_details.first_name + " " + post._userId.public_details.last_name;
                            var subject = "Flaggged Dip - " + reportRes.report + "<br />";
                            var messageHtml = "Flagged by - " + reportedByName + "<br />";
                                messageHtml += "Dip Created by - " + reportedUserName + "<br />";
                                messageHtml += "Dip ID - " + post._id + "<br />";
                                messageHtml += "Dip Message - " + post.post_message + "<br />";
                                messageHtml += "Flagged Topic - " + reportRes.report + "<br />";
                                messageHtml += "Flagged Time - " + reportRes.created + "<br />";
                                Transporter.sendMail({
                                    from: user.email,
                                    to: 'help@virginlabsinc.com',
                                    subject: subject,
                                    html: messageHtml,
                                    generateTextFromHTML: true
                                });
                                res.status(200).json({ message: 'Report performed!' });
                        });

                    
                    
                });
            
        }
    });
};


exports.removeReport = function(req, res) {
    var reportId = req.params.id;

    Report.remove({ _id: reportId }, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.json({ message: 'Report removed!' });
            
        }
    });
}

exports.removeUserReport = function(req, res) {
    var userId = req.params.userId;
    Report.remove({ _userId: userId }, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.json({ message: 'Report removed!' });
            
        }
    });
}

exports.removePostReport = function(req, res) {
    var userId = req.params.userId;
    var postId = req.params.postId;
    Report.remove({ _postId: postId }, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.json({ message: 'Report removed!' });
            
        }
    });
}