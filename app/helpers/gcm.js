var GCM = require('gcm').GCM;
var querystring = require('querystring');

exports.sendGCM = function(req, res) {
    var params = req.body;

    var apiKey = 'AIzaSyBcv0aSSk5FROHnGFPaRbzaKAdZ_kLISSE';
    var gcm = new GCM(apiKey);

    var message = {
        registration_id: params.deviceID, // required
        collapse_key: 'Collapse key',
        'data.message': params.message,
        'data.subject': (params.subject) ? params.subject : '...'
    };

    gcm.send(message, function(err, messageId) {
        if (err) {
            res.end(JSON.stringify(err));
        } else {
            res.end(JSON.stringify(messageId));
        }
    });
}