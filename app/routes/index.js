var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home');

/* GET home page. */
router.get('/', homeController.index);

router.get('/register', homeController.register);

router.post('/register', homeController.postRegister);

router.post('/', homeController.postLogin);

router.get('/logout', homeController.logout);

router.get('/friends', homeController.friends);

router.get('/chat', homeController.chat);

router.get('/liveclass', homeController.liveclass);

router.get('/groupExercise', homeController.groupExercise);

router.get('/liveclass-page', homeController.liveclassPage);

module.exports = router;
