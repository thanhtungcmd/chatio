'use strict';

var mongoose = require('mongoose');

var liveclassSchema = new mongoose.Schema({
    liveclass_id: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Number, required: true },
    avatar: { type: String, required: true },
    firstname: { type: String }
});

var Liveclass = mongoose.model('liveclass', liveclassSchema);

module.exports = Liveclass;