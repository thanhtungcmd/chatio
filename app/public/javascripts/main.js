'use strict';

var app = {
	room: function(user) {
		var socket = io('/room', { transports: ['websocket'] });

		socket.on('connect', function () {
			socket.emit('joinroom', user);

			socket.on('updateRoom', function(username) {
				app.helpers.updateRoomChat(username);
			});
		});
	},

	chat: function (roomId, user) {
		var socket = io('/chatroom', { transports: ['websocket'] });

		socket.on('connect', function (test) {
			socket.emit('join', roomId);

			$('#chat-message').on('keyup', function (e) {
			    if (e.keyCode == 13) {
			        var content = $('#chat-message').val();
			        if (message !== '') {
			        	var message = {
			        		content: content,
			        		username: user,
			        		date: Date.now()
			        	}
			        	socket.emit('newMessage', roomId, message);
			        	$('#chat-message').val('');
			        	app.helpers.addMessageMe(message);
			        }
			    }
			});

			socket.on('addMessage', function(message) {
				console.log(message);
				app.helpers.addMessageOther(message);
			});
		});
	}, 

	helpers: {
		updateRoomChat: function (username) {
			$('#'+ username).show();
		},

		addMessageMe: function (message) {
			message.date = (new Date(message.date)).toLocaleString();
			message.user = message.username;
			message.content = message.content;
			var html = '<div class="col-md-9 pull-right">' +
				'<div class="alert alert-primary" role="alert">' +
				message.content +
				'<br>' +
				'<small class="font-weight-light">' + message.user + ' ' + message.date + '</small>' +
				'</div>' +
				'</div>' +
				'<div class="clearfix"></div>';
			console.log(1);
			$('#chat-content').append(html);
		},

		addMessageOther: function (message) {
			message.date = (new Date(message.date)).toLocaleString();
			message.user = message.username;
			message.content = message.content;
			var html = '<div class="col-md-9">' +
				'<div class="alert alert-secondary" role="alert">' +
				message.content +
				'<br>' +
				'<small class="font-weight-light">' + message.user + ' ' + message.date + '</small>' +
				'</div>' +
				'</div>' +
				'<div class="clearfix"></div>';
			console.log(1);
			$('#chat-content').append(html);
		}
	}
};