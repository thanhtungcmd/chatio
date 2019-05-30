'use strict';

var app = {
	room: function(user) {
		var socket = io('/room', { transports: ['websocket'] });

		socket.on('connect', function () {
			socket.emit('joinroom', user);

			socket.on('updateRoom', function(username) {
				app.helpers.updateRoomChat(username);
			});

			socket.on('outRoom', function(username) {
				app.helpers.outRoomChat(username);
			});
		});
	},

	logout: function(user) {
		var socket = io('/room', { transports: ['websocket'] });

		socket.on('connect', function () {
			socket.emit('outroom', user);
		});
	},

	liveclass: function (classId, user, avatar, firstname) {
		var socket = io('/liveclass', { transports: ['websocket'] });

		socket.on('connect', function () {
			socket.emit('join', classId);

			$('#chat-message').on('keyup', function (e) {
				if (e.keyCode == 13) {
					var content = $('#chat-message').val();
					console.log(content);
					if (content !== '') {
						var message = {
							content: content,
							username: user,
							date: Date.now(),
							avatar: avatar,
							firstname: firstname
						}
						socket.emit('newMessage', classId, message);
						$('#chat-message').val('');
						app.helpers.liveClassAddMessage(message);
					}
				}
			});

			$('#chat-btn').on('click', function () {
				var content = $('#chat-message').val();
				console.log(content);
				if (content !== '') {
					var message = {
						content: content,
						username: user,
						date: Date.now(),
						avatar: avatar
					}
					socket.emit('newMessage', classId, message);
					$('#chat-message').val('');
					app.helpers.liveClassAddMessage(message);
				}
			});

			socket.on('addMessage', function(message) {
				app.helpers.liveClassAddMessage(message);
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
			        	app.helpers.addMessageOther(message);
			        }
			    }
			});

			socket.on('addMessage', function(message) {
				console.log(message);
				app.helpers.addMessageOther(message);
			});

			socket.on('errorMessage', function (message) {
				app.helpers.errorMessage(message);
			})
		});
	}, 

	helpers: {
		liveClassLoadPage: function (message) {
			message.date = (new Date(message.date)).toLocaleString();
			message.user = (message.firstname) ? message.firstname : message.username;
			message.content = message.content;
			message.avatar = message.avatar;
			var html = '<div class="chat-item">' +
				'<div class="chat-item-img">' +
				'<img src="' + message.avatar +'" alt="banner">' +
				'</div>' +
				'<div class="chat-item-name">' +
				message.user +
				'</div>' +
				'<div class="chat-item-text">' +
				message.content +
				'</div>' +
				'</div>';
			$('#chat-content').prepend(html);
		},

		liveClassAddMessage: function (message) {
			message.date = (new Date(message.date)).toLocaleString();
			message.user = (message.firstname) ? message.firstname : message.username;
			message.content = message.content;
			message.avatar = message.avatar;
			var html = '<div class="chat-item">' +
				'<div class="chat-item-img">' +
				'<img src="' + message.avatar +'" alt="banner">' +
				'</div>' +
				'<div class="chat-item-name">' +
				message.user +
				'</div>' +
				'<div class="chat-item-text">' +
				message.content +
				'</div>' +
				'</div>';
			$('#chat-content').append(html);
			var myDiv = $("#chat-content");
			myDiv.animate({ scrollTop: myDiv.prop("scrollHeight") - myDiv.height() }, 0);
		},

		updateRoomChat: function (username) {
			$('#'+ username).show();
		},

		outRoomChat: function (username) {
			$('#'+ username).hide();
		},

		errorMessage: function (message) {
			$('.alert-danger').text(message).fadeIn();
			setTimeout(function () {
				$('.alert-danger').text(message).fadeOut();
			}, 1500);
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
			var myDiv = $("#chat-content");
        	myDiv.animate({ scrollTop: myDiv.prop("scrollHeight") - myDiv.height() }, 0);
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
			var myDiv = $("#chat-content");
        	myDiv.animate({ scrollTop: myDiv.prop("scrollHeight") - myDiv.height() }, 0);
		}
	}
};