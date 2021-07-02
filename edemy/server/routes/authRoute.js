const express = require('express');

const router = express.Router();

router.get('/register', (req, res) => {
	res.send('hello there this is register page!');
});

module.exports = router;
