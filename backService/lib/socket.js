'use strict';

var socketio = require('socket.io');
var io;

var mongoose = require('mongoose');

var Channel = require('../app/Model/Channel'),
    Message = require('../app/Model/Message'),
    User = require('../app/Model/User'),
    PushNotification   = require('../app/Component/PushNotification');

function socketConnect (server) {
	io = socketio.listen(server);
	var socketData = {};
	//io.set("origins", "http://localhost:3000");

	io.use(function(socket, next)
	{
	    var query = socket.request._query;
	    socketData[socket.id] = {
	        channelId: query.channelId,
	        username: query.username
	    };
	    next();
	});
	
	io.on('connection', function (socket) {
		//var handshake = socket.handshake;
		//console.log(handshake.query);
		var channelId = socketData[socket.id].channelId;
		var username = socketData[socket.id].username;
		//console.log('socket id:' + socket.id);
		var connectionId = socket.id;
		socket.room = channelId;
		socket.username = username;
		socket.channelId = channelId;
		socket.join(socket.room);
		//console.log(socket.username);
		//console.log(socket.channelId);

		//set emitter
		var emitParams = {
			message: {},
			type: 'signedin'
		};

		socket.broadcast.emit('chatState', socket.username+ ' is online now');  ///All my contacts know that I am online now

		//io.sockets.in(socket.room).emit(socket.channelId, emitParams);

		socket.on('sendchat', function (reqParams) {
	        // we tell the client to execute 'updatechat' with 2 parameters
	        var msgId = mongoose.Types.ObjectId();
	        var msgObj = {
	        	_id: msgId,
	            _channelId: socket.channelId,
	            username: socket.username,
	            _userId: reqParams._userId,
	            message: reqParams.message,
	            created: new Date()
	        };
	        //console.log(msgId);
	        socket.userId = reqParams._userId;

	        io.sockets.in(socket.room).emit(socket.channelId, msgObj);  //emit message to all members of the room only
	        //msgObj.isRead = true;
	        //also save data in db here
	        var message = new Message(msgObj);	        

	        message.save(function(err, message) {
	            if (err) {
	                console.error(err);
	            } else {
	            	//update Connect doc
	            	Channel.findByIdAndUpdate(socket.channelId, {
				        $push: {
				            messages: message._id
				        },
                        last_message: message._id
				    }, {
				    	upsert: true,
				    }, function(err, channel) {
				        if(err) {
				            console.error(err);
				        } else {
				            ///send a push notification here
				            var receiverId = '';
				            
                            //push message
                            var messageText = message.message;
                            var channelUserOne = channel._userId;
                            var channelUserTwo = channel._contactUserId;
                            var senderId = msgObj._userId;
                            

                            if(channelUserOne == senderId) {
                            	receiverId = channelUserTwo;
                            	console.log(message._userId);
	                            console.log(channel._userId);
	                            console.log(channel._contactUserId);
                            	console.log('1st if');
                            } else if(channelUserOne != senderId) {
                            	receiverId = channelUserOne;
                            	console.log(message._userId);
	                            console.log(channel._userId);
	                            console.log(channel._contactUserId);
                            	console.log('2nd if');
                            } else if(channelUserTwo == senderId) {
                            	receiverId = channelUserOne;
                            	console.log(message._userId);
	                            console.log(channel._userId);
	                            console.log(channel._contactUserId);
                            	console.log('3rd if');
                            } else if(channelUserTwo != senderId) {
                            	receiverId = channelUserTwo;
                            	console.log(message._userId);
	                            console.log(channel._userId);
	                            console.log(channel._contactUserId);
                            	console.log('4th if');
                            } else {
                            	console.log(channel._contactUserId);
                            }

                            
                            
                            console.log(receiverId);
                            if(receiverId != ''){
                            	var pushSenderId = message._userId;
                            	//find push sender
                            	User.findOne({ _id: pushSenderId })
                            		.lean()
                            		.select('public_details')
                            		.exec(function(err, pushSender) {
							            if(pushSender) {
							                var message = pushSender.public_details.first_name + " just sent you a new Chat!"
							                PushNotification.sendNotifications(message, "soundName", receiverId);
							            }
							        });
                            }
                            //push notification end
				            
				        }
				    });
	            	
	            }
	        });
	    });

		socket.on('read', function(messageId) {
			//update message status to read
			Message.update({_id:messageId}, {
				$set: { isRead: true }
			}).exec(function(err) {
				if(err) {
					console.log(err);
				} else {
					socket.broadcast.to(socket.room).emit('chatState', 'read'); // the other part knows chat is read
				}
			});
		});

		socket.on('typing', function(){
			socket.broadcast.to(socket.room).emit('chatState', socket.username+ ' typing'); //let the other user in my room know that I am typing
		});
		
		socket.on('disconnect', function(){
			socket.broadcast.emit('chatState', socket.username+ ' is offline'); // Let all my contacts know that I am offline now.
			
		});  


	});
}

exports.boot = socketConnect;