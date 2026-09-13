const express = require('express');

const userRoutes = require('./user-route');
const bookingRoutes = require('./booking-route');
const eventRoutes = require('./event-route');

const router = express.Router();

router.use('/auth', userRoutes);
router.use('/events', eventRoutes);
router.use('/events', bookingRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;
