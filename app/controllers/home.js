'use strict';

var User = require('../database').models.user;

exports.index = function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/rooms');
	}
    res.render('index');
};