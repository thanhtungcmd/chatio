'use strict';

const util = require('util');
var passport 	= require('passport');

// Modal
var User = require('../database').models.user;

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
		error.push('Bạn chưa nhập username');
	} 
	if (!req.body.password && req.body.password == '') {
		error.push('Bạn chưa nhập mật khẩu');
	} 
	if (req.body.password != req.body.repassword) {
		error.push('Bạn nhập lại mk chưa chính xác')
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

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
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
		friends: friends
	});
}

exports.chat = function (req, res) {
	res.render('chat');
}