const express = require('express');
const router = express.Router();
// const util = require('../util/util.js');

// controllers
const WecCtrl = require('../controllers/wec.js');

// routes ==================================================

// Startpage
// router.get('/', StartpageCtrl.getStartpage);
router.get('/wecdata', WecCtrl.getWecData);

// // Error-handling
// // TODO
router.get('/error', (req, res) => {
	// res.render('landing.ejs', {
	// 	loggedIn: util.isLoggedIn(req)
	// });
	res.status(403).send();
});

module.exports = router;
