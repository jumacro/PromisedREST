/**
* Google Cloud Messaging --- GCM Class
*/
var GCM = require('gcm').GCM;
var querystring = require('querystring');

/**
* GCM sending method
* @param mixed req -> request method
* @param mixed res -> response method
*/
exports.sendGCM = function(req, res) {
    //hold the req.body params
    var params = req.body;
    //register the Api Key
    var apiKey = 'AIzaSyBcv0aSSk5FROHnGFPaRbzaKAdZ_kLISSE';
    //create a new instance of the GCM Class
    var gcm = new GCM(apiKey);
    //create the message json
    var message = {
        registration_id: params.deviceID, // required
        collapse_key: 'Collapse key',
        'data.message': params.message,
        'data.subject': (params.subject) ? params.subject : '...'
    };
    //Send the message
    gcm.send(message, function(err, messageId) {
        if (err) {
            res.end(JSON.stringify(err));
        } else {
            res.end(JSON.stringify(messageId));
        }
    });
}