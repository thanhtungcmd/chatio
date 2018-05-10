'use strict';

var app = {
	chat: function (user) {
		var socket = io('/chatroom', { transports: ['websocket'] });

		socket.on('connect', function (test) {
			socket.emit('join');

			$('#chat-message').on('keyup', function (e) {
			    if (e.keyCode == 13) {
			        var content = $('#chat-message').val();
			        if (message !== '') {
			        	var message = {
			        		content: content,
			        		username: user,
			        		date: Date.now()
			        	}
			        	socket.emit('newMessage', message);
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
		addMessageMe: function (message) {
			message.date = (new Date(message.date)).toLocaleString();
			message.user = message.user;
			message.content = message.content;
			var html = '<div class="col-md-9 pull-right">' +
				'<div class="alert alert-primary" role="alert">' +
				message.content +
				'<br>' +
				'<small class="font-weight-light">' + message.date + '</small>' +
				'</div>' +
				'</div>' +
				'<div class="clearfix"></div>';
			console.log(1);
			$('#chat-content').append(html);
		},

		addMessageOther: function (message) {
			message.date = (new Date(message.date)).toLocaleString();
			message.user = message.user;
			message.content = message.content;
			var html = '<div class="col-md-9">' +
				'<div class="alert alert-secondary" role="alert">' +
				message.content +
				'<br>' +
				'<small class="font-weight-light">' + message.date + '</small>' +
				'</div>' +
				'</div>' +
				'<div class="clearfix"></div>';
			console.log(1);
			$('#chat-content').append(html);
		}
	}
};