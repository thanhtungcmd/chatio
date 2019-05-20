'use strict';

var config = require('../config');
var redis = require('redis');
var adapter = require('socket.io-redis');

// Model
var User = require('../database').models.user;
var History = require('../database').models.history;

// socket Event
var socketEvent = function (socketIO) {

	// socket for friend
	socketIO.of('/room').on('connection', function (socket) {
		socket.on('joinroom', async function (username) {
			var user = await User.updateOne({
				username: username
			}, {
				status_chat: true
			});
			socket.broadcast.emit('updateRoom', username);
		});

		socket.on('outroom', async function (username) {
			var user = await User.updateOne({
				username: username
			}, {
				status_chat: false
			});
			socket.broadcast.emit('outRoom', username);
		});
	});

	// socket for chatroom
	socketIO.of('/chatroom').on('connection', function (socket) {
		socket.on('join', function (roomId) {
			socket.join(roomId);
		});

		socket.on('newMessage', function (roomId, message) {
			var history = new History({
				room_id: roomId,
				time: message.date,
				username: message.username,
				content: message.content
			}).save();
			socket.broadcast.to(roomId).emit('addMessage', message);
		});
	});
}

var init = function (app) {
	let server = require('http').Server(app);
	let socketIO = require('socket.io')(server);

	socketIO.set('transports', ['websocket']);

	let host = config.redis.host;
	let port = config.redis.port;

	socketIO.adapter(adapter({
		host: host,
		port: port
	}));

	socketIO.use(function (socket, next) {
		// require('../session')(socket.request, {}, next);
		if (socket.request) {
			return next();
		}
		next(new Error('Authentication error'));
	});

	// Define event
	socketEvent(socketIO);

	return server;
}

module.exports = init;