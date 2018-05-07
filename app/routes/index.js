var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home');


/* GET home page. */
router.get('/', homeController.index);

module.exports = router;
