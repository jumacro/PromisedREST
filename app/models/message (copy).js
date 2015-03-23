var schema = require('../../schema');
var Message = schema.Message;
var db = schema.sequelize;
var table = 'zid_messages';

exports.getAllMessages = function(callback){
    Message.findAndCountAll({
        raw : true,
        order: '`message_id` DESC'
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    })
} 

exports.getLimitedMessages = function(offset, limit, callback){
    Message.findAndCountAll({
        raw : true,
        offset: offset,
        limit:limit,
        order: '`message_id` DESC'
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    })
} 

exports.getAMessage = function(message_id, callback){
    Message.findAll({
        where: ['message_id=? OR parent_message_id=? ', message_id, message_id]
    }, {
        //logging: console.log,
        raw : true,
        order: '`message_id` DESC'
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    });
}

exports.updateView = function(message_id, callback){
    Message.find(message_id)
    .error(function(err){
        console.log(err);
    })
    .success(function(messages){
        messages.is_message_viewed = 1;
        messages.save()
        .error(function(err){
            console.log(err);
        })
        .success(function(){
            callback(true);
        });
    });
}

/*exports.getMessageByUser = function(user_id, offset, limit, callback){
    Message.findAndCountAll( {
        where : [
            'user_id=? OR receiver_id=? ', user_id, user_id
        ],
        offset: offset,
        limit:limit,
        order: '`message_id` DESC'
    }, {
        logging: console.log,
        raw : true
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
        console.log('hello'); 
        callback(data);
    });
}*/

exports.delAMessage = function(message_id, callback){
    Message.destroy('`message_id` = "'+message_id+'"')
    .error(function(err){
        console.log(err);
        callback(false);
    })
    .success(function() {
        callback(true);
    })
} 

exports.delMessageByUser = function(user_id, callback){
    Message.destroy('`user_id` = "'+user_id+'"')
    .error(function(err){
        console.log(err);
        callback(false);
    })
    .success(function() {
        callback(true);
    })
} 