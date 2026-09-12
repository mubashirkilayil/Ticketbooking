const express = require('express');
const userRoutes = require('./user-route');
const bookingRoutes = require('./booking-route');
const eventRoutes = require('./event-route');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/booking', bookingRoutes);
router.use('/event', eventRoutes);

module.exports = router;
