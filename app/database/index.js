'use strict';

var config = require('../config');
var mongoose = require('mongoose');

// connection
var connect = "mongodb://";
if (config.db.username !== '') {
	connect += encodeURIComponent(config.db.username) + ':';
}
if (config.db.password !== '') {
	connect += connect + encodeURIComponent(config.db.password) + '@';
}
connect += config.db.host + ":" + config.db.port + "/" + config.db.database;

var connect2 = "mongodb://educa:Educa_2018**@192.168.1.240:27017/educa";

// mongoose
mongoose.connect(connect2);

mongoose.connection.on('error', function (err) {
	if (err) {
		throw err;
	}
});
// console.log(db.on('error', console.error.bind(console, 'connection error:')));
// process.exit();

module.exports = {
	mongoose,
	models: {
		user: require('./models/user'),
		room: require('./models/room'),
		history: require('./models/history'),
		liveclass: require('./models/liveclass'),
		groupExercise: require('./models/groupExercise')
	}
}
