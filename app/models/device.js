var schema = require('../../schema');
var Device = schema.Device;
var db = schema.sequelize;
var table = 'zid_devices';

exports.createDevice = function(param, callback){
    var created_at = new Date();

    var add = Device.build({
        user_id: param.user_id,
        device_id: param.device_id,
        platform: param.platform,
        created_at: created_at,
        last_modified_at: created_at

    });
    add.save()
    .error(function(err){
        console.log(err);
        callback(err);
    })
    .success(function(){
        callback(true);
    });
}


exports.checkADevice = function(device_id, user_id, callback){
    Device.findAndCountAll({
        where : {
            device_id : device_id,
            user_id   : user_id
        }
    }, {
        raw : true
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    });
}

exports.getAUserDevice = function(platform, user_id, callback){
    Device.findAndCountAll({
        where : {
            platform : platform,
            user_id   : user_id
        }
    }, {
        raw : true
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    });
}

exports.getADevice = function(id, callback){
    Device.findAndCountAll({
        where : {
            id : id
        }
    }, {
        raw : true
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    });
}

exports.updateDevice = function(id, params, callback){
    Device.find(id)
    .error(function(err){
        console.log(err);
    })
    .success(function(device){
        device.device_id = params.device_id;
        device.platform = params.platform;
        device.save()
        .error(function(err){
            console.log(err);
        })
        .success(function(){
            callback(true);
        });
    });
}

exports.delADevice = function(device_id, callback){
    Device.destroy('`device_id` = "'+device_id+'"')
    .error(function(err){
        console.log(err);
        callback(false);
    })
    .success(function() {
        callback(true);
    })
} 