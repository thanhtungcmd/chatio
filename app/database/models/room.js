'use strict';

var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
	title: { type: String, required: true },
	connections: {
		type: [{
			user_id: String,
			socket_id: String
		}]
	}
});

var Room = mongoose.model('rooms', roomSchema);

module.exports = Room;