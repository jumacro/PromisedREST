/**
* Apple Push notification --- APN Class
*/
var APN = require('apn');

/**
* APN sending method
* @param mixed req -> request method
* @param mixed res -> response method
*/
exports.sendAPNS = function(req, res) {
    //hold the req.body params
    var params = req.body;
    //set up options json
    var options = {
        key: 'app/apns_cert_pro.pem',
        cert: 'app/apns_cert_pro.pem',
        ca: 'app/entrust_2048_ca.cer',
        passphrase: '',
        production: 'true'
    };
    //create connection
    var apnConnection = new APN.Connection(options);
    //register device
    var myDevice = new APN.Device(params.deviceID);
    //register notification
    var note = new APN.Notification();
    //notification settings
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = params.message;
    note.payload = {'messageFrom': 'Serg'};
    //push the notification
    apnConnection.pushNotification(note, myDevice);
    //end the response
    res.end(params.deviceID);
}