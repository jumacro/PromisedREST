var schema = require('../../schema');
var UserToken = schema.UserToken;
var db = schema.sequelize;

exports.createToken = function(param, callback){
    var created_at = new Date();

    var add = UserToken.build({
        user_id: param.user_id,
        token: param.token,
        expires: param.expires,
        user_agent: param.user_agent,
        created_date: created_at,
        last_modified_at: created_at

    });
    add.save()
    .error(function(err){
        console.log(err);
        callback(err);
    })
    .success(function(){
        callback(true);
    });
}


exports.checkAToken = function(token, user_id, expires, callback){
    UserToken.findAndCountAll({
        where : {
            token: token,
            user_id: user_id
        }
    }, {
        raw : true
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    });
}

