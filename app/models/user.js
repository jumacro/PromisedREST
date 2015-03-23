var schema = require('../../schema');
var User = schema.User;
var db = schema.sequelize;
var table = 'zid_users';

exports.createUser = function(param, callback) {
    var add = User.build({
        username: param.username,
        email: param.email,
        password: param.password,
        is_deleted: 0

    });
    add.save()
            .error(function(err) {
        console.log(err);
        callback(err);
    })
            .success(function() {
        callback(true);
    });
}


exports.getAllUsers = function(callback) {
    User.findAll({
        raw: true
    })
            .error(function(err) {
        console.log(err);
    })
            .success(function(data) {
        callback(data);
    })
}

exports.getAUser = function(user_id, callback) {
    User.find(user_id, {
        raw: true
    })
            .error(function(err) {
        console.log(err);
    })
            .success(function(data) {
        callback(false, data);
    });
}

exports.getAUserByUsername = function(username, callback) {
    User.findAndCountAll({
        where: {
            username: username
        }
    }, {
        raw: true
    })
            .error(function(err) {
        console.log(err);
        callback(data);
    })
            .success(function(data) {
        callback(data);
    });
}

exports.findOne = function(username, callback) {
    User.find({
        where: {
            username: username
        }
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

exports.checkLogin = function(username, password, callback) {
    User.find({
        where: {
            username: username,
            password: password
        }
    }, {
        raw: true
    })
            .error(function(err) {
        console.log(err);
        callback(data);
    })
            .success(function(data) {
        callback(data);
    });
}

exports.updateUser = function(user_id, params, callback) {
    User.find(user_id)
            .error(function(err) {
        console.log(err);
    })
            .success(function(users) {
        users.username = params.username;
        users.save()
                .error(function(err) {
            console.log(err);
        })
                .success(function() {
            callback(true);
        });
    });
}

exports.delAUser = function(user_id, callback) {
    User.destroy('`id` = "' + user_id + '"')
            .error(function(err) {
        console.log(err);
        callback(false);
    })
            .success(function() {
        callback(true);
    })
} 