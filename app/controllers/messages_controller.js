
/*
 * Requires the message model.
 */
var message = require('../models/message');

/**
    Get all messages with pagination.
    Passes the calculated offset, and limit to model
    The returning data is 
        data.counts :- The total number of rows present in the main query
        data.rows :- The rows as the resultant of the offset and limit
**/
exports.getAllMessages = function(req, res)
{
    message.getAllMessages(function(data){
        if(data){
           res.json(data); 
       }else{
           res.json({ message: 'No message found' });  
       }
                
    });
}
exports.getLimitedMessages = function(req, res)
{
    var page   = req.params.page,
        limit  = req.params.limit;

    if((page == 0) || (limit == 0)){
        res.json({ message: 'Neither page or limit can be zero or negative!' });
    }else{
        if((limit === null) || (limit === undefined)){
            config.log(limit);
            message.getAllMessages(function(data){
                res.json(data);
            });
        }else{

            var offset = ((page * limit) - limit);
            message.getLimitedMessages(offset, limit, function(data){
                res.json(data);
            });
        }
    }
}

/**
    Get a message 
    Passes the message id to the model
    Returns the json data of the particular message and updates the is_message_viewed = 1
**/
exports.getAMessage = function(req, res)
{
    var message_id = req.params.message_id;

    message.updateView(message_id, function(data){
        //do nothing...
    })

    message.getAMessage(message_id, function(data){
        //console.log(data.user_id);
        if((data === null) || (data === undefined))  {
            res.json({ message: 'No message found for '+message_id+'!' });                       
        }else{
            res.json({ messages: data });
        }        
    });
}

exports.getThreads = function(req, res)
{
    var message_id = req.params.message_id;

    message.getThreads(message_id, function(data){
        //console.log(data.user_id);
        if((data === null) || (data === undefined))  {
            res.json({ message: 'No message found for '+message_id+'!' });                       
        }else{
            res.json({ messages: data });
        }        
    });
}

/**
    Get all user messages with pagination.
    Passes the calculated offset, and limit to model
    The returning data is 
        data.counts :- The total number of rows present in the main query
        data.rows :- The rows as the resultant of the offset and limit
**/
exports.getMessageByUser = function(req, res)
{
    var user_id = req.params.user_id,
        page    = req.params.page,
        limit   = req.params.limit;

    if((user_id === null) || (user_id === undefined))
    {
        res.json({ message: 'User id is required for this api call' });
    }
    else
    {
    	var offset = ((page * limit) - limit);
        message.getMessageByUser(user_id, offset, limit, function(data){
            if(data){
                res.json({ messages: data });  
            }else{
                res.json({ message: 'No messages found for user '+user_id+'!' });          
            }  
        });
    }

}

/**
    Reply Message
    
**/
exports.replyMessage = function(req, res){
    var params = req.body;
    if((params.sender_id === null) || (params.user_id === undefined))
    {
        res.json({ message: 'Sender id is required for this api call' });
    }
    if((params.message_id === null) || (params.message_id === undefined))
    {
        res.json({ message: 'Message id is required for this api call' });
    }
    if((params.receiver_id === null) || (params.receiver_id === undefined))
    {
        res.json({ message: 'Receiver id is required for this api call' });
    }
    if((params.message === null) || (params.message === undefined))
    {
        res.json({ message: 'Message id is required for this api call' });
    }

    params.character_id = null;
    params.subject = "Reply Message";

    if(params.parent_message_id == null || params.parent_message_id == undefined){
        params.parent_message_id = params.message_id;
        params.is_message_parent = 1;
    } else {
        message.getMessageByUserByParentMessage(params.sender_id, params.parent_message_id, function(messages){
            //loop messages and call message.updateParentFlag
        });
        //params.parent_message_id = parent_message_id;
        params.is_message_parent = 1;
    }
    message.replyMessage(params, function(replyData){
        //collect newly inserted data
        //
        //push notification
        res.json({ message: 'Message sent successfully'});
    });
}




/**
    Delete a message
    Passes the message id to the model
    Returns the success/failure boolean
**/
exports.delAMessage = function(req, res)
{
    var message_id = req.params.message_id;
    message.delAMessage(message_id, function(data){
        if(data){
            res.json({ message: 'Message deleted successfully.' });   
        }else{
            res.json({ message: 'Message is not deleted.' }); 
        }
    });
}

/**
    Delete a set of messages by user
    Passes the user id to the model
    Returns the success/failure boolean
**/
exports.delMessageByUser = function(req, res)
{
    var user_id = req.params.user_id;
     message.delMessageByUser(user_id, function(data){
        if(data){
            res.json({ message: 'Message deleted successfully.' });   
        }else{
            res.json({ message: 'Message is not deleted.' }); 
        }
    });
}

