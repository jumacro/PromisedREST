var _ = require('lodash');
var gcm = require('node-gcm');
var Config = require('../Config/Config'); //Config loaded

var push = function (tokens, message) {
    gcmSender().send(message, tokens, 4, function (err, res) {
        if(err) console.log(err);

        if (res) {
            var mappedResults = _.map(_.zip(tokens, res.results), function (arr) {
                return _.merge({token: arr[0]}, arr[1]);
            });

            handleResults(mappedResults);
        }
    })
};

var handleResults = function (results) {
    var idsToUpdate = [],
        idsToDelete = [];

    results.forEach(function (result) {
        if (!!result.registration_id) {
            idsToUpdate.push({from: result.token, to: result.registration_id});

        } else if (result.error === 'InvalidRegistration' || result.error === 'NotRegistered') {
            idsToDelete.push(result.token);
        }
    });


};

var buildPayload = function (options) {
    return new gcm.Message(options);
};

var gcmSender = _.once(function() {
    return new gcm.Sender(Config.gcm.apiKey);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}