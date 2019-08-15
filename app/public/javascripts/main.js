'use strict';

var filterWords = ["xxx","lozi",".Du.me.mi",".l ồn","địt","Á đù.l ồn.sưng","âm đạo","an cut","An l0n","b.uồi","BƯỚM","Bon cko","bóp","bóp vú","bop vu","bú","Bu Cu","Bú Ku","BÚ L.Ồ.N","Buồi","Buồj","C.Ặ.C","c.ă.c","C.ẶC","c.h.ó","c.hó","C.k.ó","c.kó","cặ c","ca ve","cặ.c","căc","cẶc","Cái Chim","cái lờ","Cai Lon","Cái Trim","cái.l ồn.","cái.l.ồn","Cặk","cẶn bã","cặn bã","cave","cc","cẹc","CH.Ó","Ch.ó","chập mạch","Chim Thúi","chÓ","chÓ dại.","chÓ kứt","ck.ó","ckó","cko","clgt","clgt?","CMM","CỜ HÓ","con cac","con căc","con cẹc","con cko","Con di","con diem","con hoang","Con Mẹ","cức","cuc cac","cuc cut.","cưkt","cựt","cỨt","cưt","cut","Cút Mẹ","d.ái","dái","dau buoi","dcm","dịt","dit cu","dit cu.","Dit Me","dit. cu","djt me","dj~","dkm","DM","Dộg CỨT","dương vật","Dýt","dyt","f uck","Fap","hấ.p d.iêm","Hấp Diêm","Hiếp","Dâm","hột le","ỉa","ỉA","k.ứ.t","k.ứt","kăc","kave","kẹc","kec","khốn nạn","Kon kac","Kon kặk","Kon.ckó","kU","kuc","kức","kưc","kứt","l ồ n","L ồn","l.o.n","l.ô.n","L.O.Z","L.Ồ.Z","l.on","l.ồn","l.oz","l0n","lẳg lơ","liếm","liem lon","lìn","Lỗ lồ.n","lồ n","LỒ n","lò tôn","lo.n","lồ.n","lô.n","lôn","lòn","lòn me","lon me","lox","loz","lôz","Lồz","lồn","dâm","lũ ch.ó","mat lon","mat trinh","chịch","nứng","l.o^n","vailon","đuỹ","Iồn","C..ặc","Bú","màng trinh","giang mai","lồ...n...","lồ...n","çặc","dú to","vú","xoạc","cặ..c","Dú","c.u","Buồ..i","B.ú","Con Ph..ò","Điếm","khe b.ú","C u","đ.ịt","Lồπ","Địt","xuất tinh","l..ồn","CẶC","Lồ..n","lồ..n","vk.l","cái con lz","con me may","l.ồ.n","đ.ị.t","buồi","lồn","xàm l.ồ.n","vai lon","vãi lz","tổ sư","vã.i lồ.n","đkm","vkl","vcl","vl","v.k.l","đcm","fuck","nunglon"];
var rgx = new RegExp(filterWords.join("|"), "gi");

function wordFilter(str) {          
    return str.replace(rgx, "***");
}

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
					//console.log("count="+content.length);
					if(content.length > 200){
						alert("Đoạn chat không được vượt quá 200 ký tự!");
						return false;
					}else{
						content = wordFilter(content);
						//console.log("content="+content);
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
				}
			});

			$('#chat-btn').on('click', function () {
				var content = $('#chat-message').val();
				//console.log("count="+content.length);
				if(content.length > 200){
					alert("Đoạn chat không được vượt quá 200 ký tự!");
					return false;
				}else{
					content = wordFilter(content);
					//console.log("content="+content);
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
				}
			});

			socket.on('addMessage', function(message) {
				app.helpers.liveClassAddMessage(message);
			});
		});
	},

	groupExercise: function (classId, user, avatar, firstname) {
		var socket = io('/groupExercise', { transports: ['websocket'] });

		socket.on('connect', function () {
			socket.emit('join', classId);

			$('#chat-message').on('keyup', function (e) {
				if (e.keyCode == 13) {
					var content = $('#chat-message').val();
					//console.log("count="+content.length);
					if(content.length > 200){
						alert("Đoạn chat không được vượt quá 200 ký tự!");
						return false;
					}else{
						content = wordFilter(content);
						//console.log("content="+content);
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
				}
			});

			$('#chat-btn').on('click', function () {
				var content = $('#chat-message').val();
				//console.log("count="+content.length);
				if(content.length > 200){
					alert("Đoạn chat không được vượt quá 200 ký tự!");
					return false;
				}else{
					content = wordFilter(content);
					//console.log("content="+content);
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