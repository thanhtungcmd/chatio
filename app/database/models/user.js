'use strict';

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	social_id: { type: String, default: null },
	full_name: { type: String, default: null }
});

userSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

var User = mongoose.model('user', userSchema);

module.exports = User;
