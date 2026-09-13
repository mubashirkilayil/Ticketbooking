const express = require('express');
const mongoose = require('mongoose');

const Booking = require('../db/Models/Booking');
const Event = require('../db/Models/Event');

const {
  protect,
  authorize,
} = require('../middleware/auth');

const router = express.Router();

// Get my bookings - Customer only
router.get(
  '/my-bookings',
  protect,
  authorize('CUSTOMER'),
  async (req, res) => {
    try {
      const bookings = await Booking.find({
        customer: req.user.id,
      })
        .populate(
          'event',
          'title description category date location ticketPrice availableTickets'
        )
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: 'Bookings fetched successfully',
        data: bookings,
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }
);

// Book tickets - Customer only
router.post(
  '/:id/book',
  protect,
  authorize('CUSTOMER'),
  async (req, res) => {
    const session = await mongoose.startSession();

    try {
      const { id } = req.params;
      const tickets = Number(req.body.ticketsBooked);

      if (!Number.isInteger(tickets) || tickets < 1) {
        return res.status(400).json({
          message: 'Please enter a valid number of tickets',
        });
      }

      session.startTransaction();

      const event = await Event.findOneAndUpdate(
        {
          _id: id,
          date: { $gte: new Date() },
          availableTickets: { $gte: tickets },
        },
        {
          $inc: { availableTickets: -tickets },
        },
        {
          new: true,
          session,
        }
      );

      if (!event) {
        const existingEvent = await Event.findById(id).session(session);

        await session.abortTransaction();

        if (!existingEvent) {
          return res.status(404).json({
            message: 'Event not found',
          });
        }

        if (existingEvent.date < new Date()) {
          return res.status(400).json({
            message: 'Event has already started',
          });
        }

        return res.status(409).json({
          message: 'Not enough tickets available',
        });
      }

      const totalAmount = event.ticketPrice * tickets;

      const booking = await Booking.create(
        [
          {
            customer: req.user.id,
            event: id,
            ticketsBooked: tickets,
            totalAmount,
            bookingStatus: 'CONFIRMED',
          },
        ],
        { session }
      );

      await session.commitTransaction();

      return res.status(201).json({
        message: 'Tickets booked successfully',
        data: booking[0],
      });
    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      return res.status(500).json({
        message: e.message,
      });
    } finally {
      await session.endSession();
    }
  }
);

module.exports = router;
