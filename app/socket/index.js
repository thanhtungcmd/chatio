'use strict';

var config = require('../config');
var redis = require('redis');
var adapter = require('socket.io-redis');

// socket Event
var socketEvent = function (socketIO) {
	socketIO.of('/chatroom').on('connection', function (socket) {
		socket.on('join', function (roomId) {
			socket.join(roomId);
		});

		socket.on('newMessage', function (roomId, message) {
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