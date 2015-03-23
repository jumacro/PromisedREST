var schema = require('../../schema');
var Message = schema.Message;
var db = schema.sequelize;
var table = 'zid_messages';

exports.getAllMessages = function(callback){
    Message.findAndCountAll({
        raw : true,
        order: '`last_modified_date` DESC'
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
        order: '`last_modified_date` DESC'
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
        order: '`last_modified_date` DESC'
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

/*exports.getMessageByUser = function(user_id, callback){
    Message.findAndCountAll( {
        where : [
            'user_id=? OR receiver_id=? AND is_message_active =1 ', user_id, user_id
        ],
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

exports.getMessageByUser = function(user_id, offset, limit, callback){
    var unionOne  = "SELECT  message.*, zu.username, zcd.character_name, zg.game_name FROM zid_messages AS message "
        unionOne += "INNER JOIN zid_users AS zu ON zu.id = message.user_id "; 
        unionOne += "LEFT OUTER JOIN zid_character_details AS zcd ON message.character_detail_id = zcd.character_detail_id ";
        unionOne += "LEFT OUTER JOIN zid_games AS zg ON zg.id = zcd.game_id ";
        unionOne += "wHERE message.guild_id IS NULL AND message.is_message_active = 1 ";
        unionOne += "AND  (message.user_id = 2 OR message.receiver_id =2 ) "
        unionOne += "AND message.message_id NOT IN ( ";

            unionOne += "SELECT message.parent_message_id FROM zid_messages AS message ";
            unionOne += "WHERE (message.user_id = 2 OR message.receiver_id =2 ) ";
            unionOne += "AND message.parent_message_id  IS NOT NULL";

        unionOne += " )   ORDER BY message.last_modified_date DESC LIMIT 1 ";


    var unionTwo  = "SELECT  message.*, zu.username, zcd.character_name, zg.game_name FROM zid_messages AS message "
        unionTwo += "INNER JOIN zid_users AS zu ON zu.id = message.user_id "; 
        unionTwo += "LEFT OUTER JOIN zid_character_details AS zcd ON message.character_detail_id = zcd.character_detail_id ";
        unionTwo += "LEFT OUTER JOIN zid_games AS zg ON zg.id = zcd.game_id ";
        unionTwo += "wHERE message.guild_id IS NULL AND message.is_message_active = 1 ";
        unionTwo += "AND  (message.user_id = 2 OR message.receiver_id =2 ) "
        unionTwo += "AND message.message_id NOT IN ( ";

            unionTwo += "SELECT message.message_id FROM zid_messages AS message ";
            unionTwo += "WHERE (message.user_id = 2 OR message.receiver_id =2 ) ";
            unionTwo += "AND message.parent_message_id  IS NOT NULL";

        unionTwo += " )  ORDER BY message.last_modified_date DESC LIMIT 1 ";


    var mainQuery = 'SELECT * FROM (('+unionOne+') UNION ALL ('+unionTwo+')) AS col ORDER BY col.last_modified_date DESC limit '+offset+', '+limit;


    db.query(mainQuery)
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
        console.log(mainQuery); 
        callback(data);
    });
}

exports.getThreads = function(message_id, callback){
    Message.findAll({
        where: ['parent_message_id=? ', message_id]
    }, {
        //logging: console.log,
        raw : true,
        order: '`last_modified_date` DESC'
    })
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
      callback(data);
    });
}

/**
    Reply message
    @param reply message parameters object
    @callback return data
**/
exports.replyMessage = function( param , callback){
    var created_at = new Date();

    /**
    @Todo need save remaining fields 
    */
    var add = Message.build({
        user_id: param.sender_id,
        receiver_id: receiver_id,
        parent_message_id: parent_message_id,


    });
    add.save()
    .error(function(err){
        console.log(err);
        callback(err);
    })
    .success(function(){
        //reutn newly inserted data
        callback(true);
    });
}


exports.getMessageByUserByParentMessage = function(user_id, parent_message_id, callback){
    
    var messagesSql = 'select * from zid_messages where message_id = '+parent_message_id+' or user_id = '+user_id+' and parent_message_id = '+parent_message_id+' and is_message_active = 1';
    db.query(messagesSql)
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
        console.log(data); 
        callback(data);
    });
}

exports.updateParentFlag = function(message_id, is_message_parent, callback){
    var messagesSql = 'update zid_messages set is_message_parent = '+is_message_parent+' where message_id = '+message_id;
    db.query(messagesSql)
    .error(function(err){
       console.log(err); 
    })
    .success(function(data) {
        console.log(data); 
        callback(data);
    });   
}

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