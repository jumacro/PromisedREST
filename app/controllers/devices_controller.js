
/*
 * Requires the device model.
 */
var device = require('../models/device');



/**
    Get a device 
    Passes the device id to the model
    Returns the json data of the particular device.
**/
exports.registerDevice = function(req, res)
{
    var params = req.body;

    //check if device already exists
    device.checkADevice(params.device_id, params.user_id, function(data){
        //console.log(data.user_id);
        if((data === null) || (data === undefined) || data.count == 0)  {
            //register device
            device.createDevice(params, function(addData){
                //check and get newly register device
                device.checkADevice(params.device_id, params.user_id, function(newRecord){
                    res.json({ message: 'Registering device_id:  '+params.device_id+'  for user '+params.user_id+' for platform: '+params.platform, data: newRecord });
                });
                
            });
                                   
        }else{
            res.json({ message: 'Record found: device_id:  '+params.device_id+'  for user '+params.user_id+' for platform: '+params.platform, data: data });      
        }        
    });
}



/**
    Delete a device
    Passes the device id to the model
    Returns the success/failure boolean
**/
exports.delADevice = function(req, res)
{
    var device_id = req.params.device_id;
    device.delADevice(device_id, function(data){
        if(data){
            res.json({ message: 'Device deleted successfully.' });   
        }else{
            res.json({ message: 'Device is not deleted.' }); 
        }
    });
}