const express = require('express');

const Booking = require('../db/Models/Booking');
const Event = require('../db/Models/Event');

const router = express.Router();

// Get my bookings
router.get('/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user.id,
    })
      .populate('event', 'title description category date location ticketPrice')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Bookings fetched successfully',
      data: bookings,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
    x;
  }
});

// Book tickets
router.post('/:id/book', async (req, res) => {
  try {
    const { id } = req.params;
    const { ticketsBooked } = req.body;

    if (!ticketsBooked || ticketsBooked < 1) {
      return res.status(400).json({
        message: 'Please enter a valid number of tickets',
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        message: 'This event has already passed',
      });
    }

    if (event.availableTickets < ticketsBooked) {
      return res.status(400).json({
        message: 'Not enough tickets available',
      });
    }

    const totalAmount = event.ticketPrice * ticketsBooked;

    event.availableTickets -= ticketsBooked;

    await event.save();

    const newBooking = await Booking.create({
      customer: req.user.id,
      event: id,
      ticketsBooked,
      totalAmount,
      bookingStatus: 'CONFIRMED',
    });

    return res.status(201).json({
      message: 'Tickets booked successfully',
      data: newBooking,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

module.exports = router;
