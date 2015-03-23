var apn = require('apn');


exports.sendAPNS = function(req, res) {
    var params = req.body;

    var options = {
        key: 'app/apns_cert_pro.pem',
        cert: 'app/apns_cert_pro.pem',
        ca: 'app/entrust_2048_ca.cer',
        passphrase: '',
        production: 'true'
    };

    var apnConnection = new apn.Connection(options);
    var myDevice = new apn.Device(params.deviceID);

    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = params.message;
    note.payload = {'messageFrom': 'Serg'};

    apnConnection.pushNotification(note, myDevice);

    res.end(params.deviceID);
}