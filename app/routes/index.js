var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home');
var passport 	= require('passport');

// Model
var User = require('../database').models.user;


/* GET home page. */
router.get('/', homeController.index);

// register page
router.get('/register', homeController.register);

router.post('/', passport.authenticate('local', {
	failureRedirect: '/'
}), function (req, res) {
	res.redirect('/rooms');
});

router.get('/chat', function (req, res) {
	res.render('chat');
});

// router.get('/register', function re)

router.get('/try-register', function (req, res) {
	let user = new User({
		username: 'tungbt',
		password: '123456',
		full_name: 'thanh tung'
	});

	user.save(function (err) {
		if (err) res.send('Error');
		res.send('Success');
	})
});

router.get('/rooms', function (req, res) {
	res.render('rooms');
});

module.exports = router;
