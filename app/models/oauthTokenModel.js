var schema = require('../../schema');
var oauthToken = schema.oauthToken;
var db = schema.sequelize;
var table = 'zid_oauth_token';

exports.findOne = function(where, callback) {
    oauthToken.find({
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

exports.remove = function(token, callback) {
    oauthToken.destroy('`token` = "' + token + '"').error(function(err) {
        console.log(err);
        callback(err);
    }).success(function() {
        callback(false);
    })
}

exports.remove2 = function(userId, clientId, callback) {
    oauthToken.destroy('`userId` = "' + userId + '", `clientId` = "' + clientId + '"').error(function(err) {
        console.log(err);
        callback(err);
    }).success(function() {
        callback(false);
    })
}

exports.add = function(param, callback) {
    var created_at = new Date();

    var add = oauthToken.build({
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
        callback(false, param.token);
    });
}