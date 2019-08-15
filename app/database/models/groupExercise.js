'use strict';

var mongoose = require('mongoose');

var groupExerciseSchema = new mongoose.Schema({
    group_id: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Number, required: true },
    avatar: { type: String, required: true },
    firstname: { type: String }
});

var groupExercise = mongoose.model('es_group_chat', groupExerciseSchema);

module.exports = groupExercise;