var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home');
var passport 	= require('passport');

// Model
var User = require('../database').models.user;


/* GET home page. */
router.get('/', homeController.index);

router.get('/register', homeController.register);

router.post('/register', homeController.postRegister);

router.post('/', homeController.postLogin);

router.get('/logout', homeController.logout);

router.get('/friends', homeController.friends);

router.get('/chat', function (req, res) {
	res.render('chat');
});

module.exports = router;
