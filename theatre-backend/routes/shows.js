const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getShows } = require('../controllers/showController');

router.get('/', auth, getShows);

module.exports = router;