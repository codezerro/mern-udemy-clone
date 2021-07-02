const express = require('express');
const router = express.Router();

router.get('/user', (req, res) => {
	res.send('this user page');
});

module.exports = router;
