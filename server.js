var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];
	if(typeof info === 'undefined') {
		return;
	}
	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if(userInfo.room === info.room) {
			users.push(userInfo.name);
		}
	});
		socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function (socket) {
	console.log('nodejs sever');

	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];

		if(typeof userData !== 'undefined') {
			socket.leave(userData.room);
		// emits message when you disconnect
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + 'has left',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
    	clientInfo[socket.id] = req;
		// getting the room name to join
		socket.join(req.room);
		// emits message when someone have joined the room
		socket.broadcast.to(req.room).emit('message', {
		name: 'System',
		text: req.name + 'has joined!',
		timestamp: moment().valueOf()
		});
	});

	// captures the message
	socket.on('message', function (message) {
		// message comes from client side
		console.log('message recived' + message.text);
		if(message.text === '@currentUsers'){
			sendCurrentUsers(socket);
		}else {
		// message sent everytime from hare
		message.timestamp = moment().valueOf();
		console.log(clientInfo);
		console.log(socket);
		// only emits the message who are in same room 
		io.to(clientInfo[socket.id].room).emit('message',
		 message);	
		}
	});
	// first time message sent
	socket.emit('message', {
		name: 'System',
		text: 'welcome to the chat app',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log('server started');
});