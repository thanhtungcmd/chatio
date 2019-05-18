'use strict';

var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
	room_id: { type: String, required: true },
	connections: { type: Array, required: true }
});

var Room = mongoose.model('rooms', roomSchema);

module.exports = Room;