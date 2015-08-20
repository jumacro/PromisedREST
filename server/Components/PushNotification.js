var GCMPusher    = require('./GCMPusher'),
    APNSPusher   = require('./APNPusher'),
    async = require('async'),
    Device = require('../Models/Device'),
    User = require('../Models/User');


exports.sendNotifications = function(notifyMessage, soundName, userId) {
    //console.log(userId);
    User.findOne({ _id: userId, online: false })
        .lean()
        .exec(function(err, user) {
            if(err) {
                console.log(err);
            } else {
                //console.log(user);
                if(user) {
                    Device.find({_userId : user._id})
                          .lean()
                          .exec(function(err, devices) {
                                if(devices) {
                                    //console.log(devices);
                                    if(devices.length) {
                                        //console.log("Device has data")
                                        async.each(devices, function(device, callback) {
                                            if(device.type == 'android'){
                                                var androidPayload = {
                                                    "collapseKey": "optional",
                                                    "data": {
                                                        "message": notifyMessage
                                                    }
                                                };
                                                if (androidPayload && device._deviceId.length > 0) {
                                                    var gcmPayload = GCMPusher.buildPayload(androidPayload);
                                                    GCMPusher.push(device._deviceId, gcmPayload);
                                                }
                                                //console.log("Android note sent");
                                                

                                            } else if(device.type == 'iphone'){
                                                var iosPayload = {
                                                    "badge": 0,
                                                    "alert": notifyMessage,
                                                    "sound": soundName
                                                }
                                                if (iosPayload && device._deviceId.length > 0) {
                                                    var apnPayload = APNSPusher.buildPayload(iosPayload);
                                                    APNSPusher.push(device._deviceId, apnPayload);
                                                }
                                                //console.log("iphone note sent")

                                            } else {
                                                console.log('Push notification - Unknown device type');
                                                //callback();
                                            }

                                            callback();
                                        }, function(err) {
                                            if(err) {
                                                console.log(err);
                                            } else {
                                                console.log('Push notification - All push finished');
                                            }
                                        });
                                    } else {
                                        console.log("Push notification - No device found")
                                    }                                
                                } else {
                                    console.log("Push notification - No devices found");
                                }
                          });
                } else {
                    console.log('Push notification - No user found');
                }    
            }
            
        });
}