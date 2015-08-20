/**
Device controller
*/

/** Load modules **/
var async = require('async'),
    _ = require('underscore');

/** Load components **/

var GCMPusher    = require('../Components/GCMPusher'),
    APNSPusher   = require('../Components/APNPusher');

/** Load models **/

var User = require('../Models/User'),
    Device = require('../Models/Device');

// Create endpoint /user/:userId/blocks for POST
exports.registerDevice = function(req, res) {
    var params = {
        _userId: req.params.userId,
        _deviceId: req.body.deviceId,
        type: req.body.deviceType
    };
    Device.findOne(params)
          .lean()
          .exec(function(err, device) {
                if(err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    if(!device) {
                        Device.insert(params, function(err, device) {
                            if(err) {
                                console.log(err);
                                res.status(500).json(err);
                            } else {
                                if(device) {
                                    res.json({message: 'Device inserted'});
                                } else {
                                    res.status(204).json(device);
                                }
                                
                            }
                        });   
                    } else {
                        res.json({message: 'Device already registered'});
                    }
                }
          })
    
};

exports.getAllDevices = function(req, res) {
    Device.find({})
          .exec(function(err, devices) {
                if(err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    if(devices) {
                        res.json(devices);
                    } else {
                        res.status(204).json(devices);
                    }
                }
          })
}


exports.removeDevice = function(req, res) {
    var deviceId = req.params.deviceId;

    Device.remove({ _deviceId: deviceId }, function(err) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            
            res.json({ message: 'Device removed!' });
            
        }
    });
}
