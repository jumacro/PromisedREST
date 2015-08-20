'use strict';

var socketio = require('socket.io');
var io;

var mongoose = require('mongoose');

//var Raid = require('../server/Models/Raid');

//var PushNotification   = require('../server/Components/PushNotification');

function socketConnect (server) {
	io = socketio.listen(server);
	var socketData = {};
	//io.set("origins", "http://localhost:3000");

	io.use(function(socket, next)
	{
	    var query = socket.request._query;
	    socketData[socket.id] = {
	        matchId: query.matchId
	    };
	    next();
	});
	
	io.on('connection', function (socket) {
		console.log('-------------------------');
		console.log('Socket server running');
		console.log('-------------------------');
		socket.emit('connectionState', 'You are connected'); // Let all my contacts know that I am offline now.
		//var handshake = socket.handshake;
		//console.log(handshake.query);
		var matchId = socketData[socket.id].matchId;
		//console.log('socket id:' + socket.id);
		var connectionId = socket.id;
		socket.room = matchId;
		socket.matchId = matchId;
		socket.join(socket.room);
		//console.log(socket.username);
		//console.log(socket.matchId);
		//io.sockets.in(socket.room).emit(socket.matchId, emitParams);

		socket.on('submitResult', function (reqParams) {
	        // we tell the client to execute 'updatechat' with 2 parameters
	        var raidId = mongoose.Types.ObjectId();
	        //console.log(reqParams);
	        var raidObj = {
	        	_id: raidId,
	            _matchId: '55ad4e19b6c83bce21524621',
	            _raiderTeam: reqParams._raiderTeam,
	            raidNum: reqParams.raidNum,
	            _raiderId: reqParams._raiderId,
	            raidResult: reqParams.raidResult,
	            _dataEntryPerson: '559f732811c8a50e1456913d',
	            created: new Date()
	        };
	        
	        if(reqParams.raidResult == 'SR') {
	        	raidObj.touches = reqParams.touches;
	        }
	        if(reqParams.raidResult == 'ST') {
	        	raidObj._tackledBy = reqParams._tackledBy[0];
	        }
	        console.log(raidObj);
	        io.sockets.in(socket.room).emit(reqParams.matchId, raidObj);  //emit message to all members of the room only
	        //msgObj.isRead = true;
	        //also save data in db here
	        
	        
	    });

	    
		
		socket.on('disconnect', function(){
			socket.emit('connectionState', 'You are disconnected'); // Let all my contacts know that I am offline now.
			
		});  


	});
}

exports.boot = socketConnect;