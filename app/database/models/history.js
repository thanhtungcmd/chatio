'use strict';

var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
    room_id: { type: String, required: true },
	username: { type: String, required: true },
	content: { type: String, required: true },
	time: { type: Number, required: true }
});

var History = mongoose.model('history', historySchema);

module.exports = History;