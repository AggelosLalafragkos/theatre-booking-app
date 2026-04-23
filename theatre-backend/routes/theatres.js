const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTheatres } = require('../controllers/theatreController');

router.get('/', auth, getTheatres);

module.exports = router;