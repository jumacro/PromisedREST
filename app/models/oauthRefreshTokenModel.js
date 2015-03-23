var schema = require('../../schema');
var oauthRefreshToken = schema.oauthRefreshToken;
var db = schema.sequelize;
var table = 'zid_oauth_refresh_token';

exports.remove = function(userId, clientId, callback) {
    oauthRefreshToken.destroy('`userId` = "' + userId + '", `clientId` = "' + clientId + '"').error(function(err) {
        console.log(err);
        callback(err);
    }).success(function() {
        callback(false);
    })
}

exports.findOne = function(where, callback) {
    oauthRefreshToken.find({
        where: where
    }, {
        raw: true
    })
            .error(function(err) {
        console.log(err);
        callback(data);
    })
            .success(function(data) {
        callback(false, data);
    });
}

exports.add = function(param, callback) {
    var created_at = new Date();

    var add = oauthRefreshToken.build({
        userId: param.userId,
        clientId: param.clientId,
        token: param.token,
        created_at: created_at
    });
    add.save().error(function(err) {
        console.log(err);
        callback(err);
    }).success(function() {
        //reutn newly inserted data
        callback(false);
    });
}