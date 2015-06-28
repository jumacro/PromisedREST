/**
User controller
*/

var User = require('../Model/User'), 
    GCMPusher    = require('../Component/GCMPusher'),
    APNSPusher   = require('../Component/APNPusher'),
    async = require('async'), 
    Device = require('../Model/Device');

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
                    res.status(500).json(err);
                } else {
                    if(!device) {
                        Device.insert(params, function(err, device) {
                            if(err) {
                                res.status(500).json(err);
                            } else {
                                if(device) {
                                    res.json({message: 'Device inserted'});
                                } else {
                                    res.status(404).json(null);
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
                    res.status(500).json(err);
                } else {
                    res.json(devices);
                }
          })
}

exports.testDevice = function(req, res) {
    Device.find({})
          .lean()
          .exec(function(err, devices) {
                var notifiedDevices = [];
                if(devices) {
                    //console.log(devices);
                    if(devices.length) {
                        //console.log("Device has data")
                        async.each(devices, function(device, callback) {
                            if(device.type == 'android'){
                                var androidPayload = {
                                    "collapseKey": "optional",
                                    "data": {
                                        "message": "Test in android"
                                    }
                                };
                                if (androidPayload && device._deviceId.length > 0) {
                                    var gcmPayload = GCMPusher.buildPayload(androidPayload);
                                    GCMPusher.push(device._deviceId, gcmPayload);
                                }
                                console.log("Android note sent");

                                

                            } else if(device.type == 'iphone'){
                                var iosPayload = {
                                    "badge": 0,
                                    "alert": "Test in iphone",
                                    "sound": "soundName"
                                }
                                if (iosPayload && device._deviceId.length > 0) {
                                    var apnPayload = APNSPusher.buildPayload(iosPayload);
                                    APNSPusher.push(device._deviceId, apnPayload);
                                }
                                console.log("iphone note sent")

                            } else {
                                console.log('Unknown device type');
                                //callback();
                            }
                            notifiedDevices.push(device);
                            callback();
                        }, function(err) {
                            if(err) {
                                res.json(err);
                            } else {
                                console.log('All push finished');
                                res.json(notifiedDevices);
                            }
                        });
                    } else {
                        console.log("No device found");
                        res.json(err);
                    }                                
                } else {
                    console.log("No devices found");
                    res.json(err);
                }
          });
}


exports.removeDevice = function(req, res) {
    var deviceId = req.params.deviceId;

    Device.remove({ _deviceId: deviceId }, function(err) {
        if(err) {
            res.status(500).json(err);
        } else {
            /*User.findByIdAndUpdate(userId, {
                $pull: {
                    blockedUsers: blockId
                }
            }, function(err) {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.json({ message: 'Device removed!' });
                }
            });*/
            res.json({ message: 'Device removed!' });
            
        }
    });
}
