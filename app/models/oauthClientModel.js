var schema = require('../../schema');
var oauthClient = schema.oauthClient;
var db = schema.sequelize;
var table = 'zid_oauth_client';

exports.findOne = function(where, callback) {
    oauthClient.find({
        where: where
    }, {
        raw: true
    })
            .error(function(err) {
        console.log(err);
    })
            .success(function(data) {
        callback(false, data);
    })
}