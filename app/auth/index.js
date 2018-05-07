'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../database').models.user;

var init = function () {
	passport.serializeUser(function(user, done) {
	  	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (error, user) {
			done(error, user);
		});
	});

	passport.use(new LocalStrategy(
		function (username, password, done) {
			User.findOne({
				username: new RegExp(username, 'i'),
				social_id: null
			}, function (error, user) {
				if (error) {
					return done(error);
				}
				if (!user) {
					return done(null, false, { message: 'Tài khoản không chính xác' });
				}

				user.validatePassword(password, function (error, isMatch) {
					if (error) { return done(error) }
					if (!isMatch) {
						return done(null, false, { message: 'Tài khoản không chính xác' });
					}

					return done(null, user);
				});
			});
		}
	));

	return passport;
}

module.exports = init();