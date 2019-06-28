'use strict';

var config = require('../config');
// var redis = require('redis');
var adapter = require('socket.io-redis');
var DetectLanguage = require('detectlanguage');
var util = require('util');
const Redis = require('ioredis');

const startupNodes = [
	{
		port: 30001,
		host: '172.25.80.77'
	},
	{
		port: 30002,
		host: '172.25.80.77'
	},
	{
		port: 30001,
		host: '172.25.80.78'
	},
	{
		port: 30002,
		host: '172.25.80.78'
	},
	{
		port: 30001,
		host: '172.25.80.79'
	},
	{
		port: 30002,
		host: '172.25.80.79'
	}
];

// Model
var User = require('../database').models.user;
var History = require('../database').models.history;
var Liveclass = require('../database').models.liveclass;

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

	// socket for liveclass
	socketIO.of('/liveclass').on('connection', function (socket) {
		socket.on('join', function (classId) {
			socket.join(classId);
		});

		socket.on('newMessage', function (classId, message) {
			new Liveclass({
				liveclass_id: classId,
				time: message.date,
				username: message.username,
				content: message.content,
				avatar: message.avatar
			}).save();
			socket.broadcast.to(classId).emit('addMessage', message);
		});
	});

	// socket for chatroom
	socketIO.of('/chatroom').on('connection', function (socket) {
		socket.on('join', function (roomId) {
			socket.join(roomId);
		});

		socket.on('newMessage', function (roomId, message) {
			// check message
			var detectLanguage = new DetectLanguage({
				key: 'a5699cbed4d7fd8b533c616665bc6977',
				ssl: false
			});

			detectLanguage.detect(message.content, function(error, result) {
				if (typeof result[0].language !== 'undefined') {
					if (result[0].language == 'en') {
						console.log(1);
						new History({
							room_id: roomId,
							time: message.date,
							username: message.username,
							content: message.content
						}).save();
						socket.broadcast.to(roomId).emit('addMessage', message);
					} else {
						console.log(2);
						socket.emit('errorMessage', 'Bạn nhập không phải tiếng anh');
					}
				} else {
					console.log(3);
					new History({
						room_id: roomId,
						time: message.date,
						username: message.username,
						content: message.content
					}).save();
					socket.broadcast.to(roomId).emit('addMessage', message);
				}
			});
		});
	});
}

var init = function (app) {
	let server = require('http').Server(app);
	let socketIO = require('socket.io')(server);

	socketIO.set('transports', ['websocket']);

	let host = new Redis.Cluster(startupNodes);
	let port = new Redis.Cluster(startupNodes);

	socketIO.adapter(adapter({
		pubClient: new Redis.Cluster(startupNodes),
		subClient: new Redis.Cluster(startupNodes)
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
