'use strict';

var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var config = require('../config');
var db = require('../database');

var init = function () {
	return session({
		secret: config.session,
		resave: false,
		saveUninitialized: false,
		unset: 'destroy',
		store: new mongoStore({ 
			mongooseConnection: 
			db.mongoose.connection 
		})
	});
}

module.exports = init();