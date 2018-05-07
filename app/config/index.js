'use strict';

require('dotenv').config();

var init = function () {
	return {
		db: {
			host: process.env.DB_HOST,
			port: process.env.DB_POST,
			database: process.env.DB_DATABASE,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD
		},
		redis: {
			host: process.env.REDIS_HOST,
			port: parseInt(process.env.REDIS_PORT),
		},
		session: process.env.SESSION_SECRET
	}
}

module.exports = init();