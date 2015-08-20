var _ = require('lodash');
var apn = require('apn');
var Config = require('../Config/Config'); //Config loaded

var push = function (tokens, payload) {
    apnSender().pushNotification(payload, tokens);
};

var buildPayload = function (options) {
    var notif = new apn.Notification(options.payload);

    notif.expiry = options.expiry || 0;
    notif.alert = options.alert;
    notif.badge = options.badge;
    notif.sound = options.sound;

    return notif;
};

var apnSender = _.once(function () {
    var apnConnection = new apn.Connection(Config.apn.connection);

    apnConnection.on('transmissionError', onTransmissionError);
    initAppFeedback();

    return apnConnection;
});

var onTransmissionError = function (errorCode, notification, recipient) {
    console.error('Error while pushing to APN: ' + errorCode);
    // Invalid token => remove device
    if (errorCode === 8) {
        var token = recipient.token.toString('hex').toUpperCase();

        console.log('Invalid token: removing device ' + token);

    }
};

var onFeedback = function (deviceInfos) {
    console.log('Feedback service, number of devices to remove: ' + deviceInfos.length);


};

var initAppFeedback = function () {
    var apnFeedback = new apn.Feedback(Config.apn.feedback)

    apnFeedback.on('feedback', onFeedback);
};

module.exports = {
    push: push,
    buildPayload: buildPayload
}