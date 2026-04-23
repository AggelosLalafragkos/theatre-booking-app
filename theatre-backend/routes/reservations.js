const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createReservation,
    getUserReservations,
    cancelReservation
} = require('../controllers/reservationController');

router.post('/', auth, createReservation);
router.get('/user', auth, getUserReservations);
router.delete('/:id', auth, cancelReservation);

module.exports = router;