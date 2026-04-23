const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getShowtimes } = require('../controllers/showController');

router.get('/', auth, getShowtimes);

module.exports = router;