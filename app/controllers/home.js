'use strict';

var util = require('util');
var crypto = require('crypto');
var passport = require('passport');
var axios = require('axios');

// Modal
var User = require('../database').models.user;
var Room = require('../database').models.room;
var History = require('../database').models.history;
var Liveclass = require('../database').models.liveclass;
var GroupExercise = require('../database').models.groupExercise;

exports.liveclass = async function (req, res) {
	console.log(req.query.firstname);
	if (typeof req.query.liveclass == "undefined") {
		return res.send('Fail');
	}
	var query = {liveclass_id: req.query.liveclass};
	var history = Liveclass.find(query).sort({'_id': -1}).limit(20);

	history = await history.exec();
	history = history.reverse();

	if (typeof req.query.username === "undefined") {
		return res.render('liveclass2', {
			liveclass: req.query.liveclass,
			history: history,
		});
	}

	if (typeof req.query.avatar === "undefined") {
		return res.render('liveclass2', {
			liveclass: req.query.liveclass,
			history: history,
		});
	}
	var height = req.query.height
	if (typeof height === "undefined") {
		height = 448;
	}
	console.log("height="+height);
	if (typeof req.query.firstname === "undefined") {
		return res.render('liveclass', {
			username: req.query.username,
			liveclass: req.query.liveclass,
			history: history,
			avatar: req.query.avatar,
			firstname: null,
			height: height
		});
	}

	return res.render('liveclass', {
		username: req.query.username,
		liveclass: req.query.liveclass,
		history: history,
		avatar: req.query.avatar,
		firstname: req.query.firstname,
		height: height
	});
}

exports.liveclassPage = async function(req, res) {
	var query = {liveclass_id: req.query.liveclass};
	var history = Liveclass.find(query).sort({'_id': -1}).skip(req.query.page * 20).limit(20);

	history = await history.exec();
	history = history.reverse();

	return res.json(history);
}

exports.index = function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/friends');
	}
    res.render('index');
};

exports.register = function (req, res) {
	// console.log(util.inspect(req));
	res.render('register');
};

exports.postRegister = function(req, res) {
	// Validator
	var error = [];
	if (!req.body.username && req.body.username == '') {
		error.push('B???n ch??a nh???p username');
	} 
	if (!req.body.password && req.body.password == '') {
		error.push('B???n ch??a nh???p m???t kh???u');
	} 
	if (req.body.password != req.body.repassword) {
		error.push('B???n nh???p l???i mk ch??a ch??nh x??c')
	}

	if (error.length > 0) {
		// console.log(error);
		return res.render('register', {
			error: error
		});
	}

	// Save
	let user = new User({
		username: req.body.username,
		password: req.body.password,
		full_name: req.body.username
	});

	user.save(function (err) {
		// console.log(util.inspect(err));
	});
	return res.redirect('/');
};

exports.postLogin = passport.authenticate('local', {
	failureRedirect: '/',
	successRedirect: '/friends',
}), function (req, res) {
	res.redirect('/');
};

exports.logout = async function(req, res) {
	var outUser = req.user.username;
	var user = await User.updateOne({
		username: req.user.username
	}, {
		status_chat: false
	});

	req.logout();
	// res.redirect('/');
	return res.render('logout', {
		user: outUser
	});
}

exports.friends = async function (req, res) {
	// Get Friend
	var friends = await User.find({
		username: {
			$ne: req.user.username
		}
	});

	// console.log(util.inspect(req.user));
	console.log(util.inspect(friends));

	res.render('friend', {
		friends: friends,
		user: req.user
	});
}

exports.chat = async function (req, res) {
	if (req.query.friend !== '') {
		
		// Check Room
		var room = await Room.findOne({
			connections: {
				$all: [req.query.friend, req.user.username]
			}
		})
		
		// Room
		if (!room) {
			var name = req.query.friend + '_' + req.user.username;
			var hash = crypto.createHash('md5').update(name).digest('hex');
			var room = new Room({
				room_id: hash,
				connections: [
					req.query.friend,
					req.user.username
				]
			});
			room.save();
		}
		
		console.log(util.inspect(room));

		// History
		var history = await History.find({
			room_id: room.room_id
		}).limit(10);

		res.render('chat', {
			room: room,
			user: req.user,
			history: history
		});
	} else {
		res.send('B???n ch??a ch???n b???n');
	}
}

exports.groupExercise = async function (req, res) {
	console.log(req.query.firstname);
	if (typeof req.query.group_id == "undefined") {
		return res.send('Fail');
	}
	var query = {group_id: req.query.group_id};
	var history = GroupExercise.find(query).sort({'_id': -1}).limit(20);

	history = await history.exec();
	history = history.reverse();

	if (typeof req.query.username === "undefined" || typeof req.query.avatar === "undefined") {
		return res.render('groupExercise2', {
			group_id: req.query.group_id,
			history: history,
		});
	}

	if (typeof req.query.firstname === "undefined") {
		var firstname = null;
	}else{
		var firstname = req.query.firstname;
	}

	if (typeof req.query.expireTime === "undefined") {
		var expireTime = null;
	}else{
		var expireTime = req.query.expireTime;
	}

	if (typeof req.query.group_name === "undefined") {
		var group_name = "B??i t???p nh??m";
	}else{
		var group_name = req.query.group_name;
	}

	return res.render('groupExercise', {
		username: req.query.username,
		group_id: req.query.group_id,
		history: history,
		avatar: req.query.avatar,
		expireTime: expireTime,
		group_name: group_name,
		firstname: firstname
	});
}