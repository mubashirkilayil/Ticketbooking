const express = require('express');

const Event = require('../db/Models/Event');
const Booking = require('../db/Models/Booking');

const {
  protect,
  authorize,
} = require('../middleware/auth');

const router = express.Router();

// Get organizer events with sales summary
router.get(
  '/organizer/my-events',
  protect,
  authorize('ORGANIZER'),
  async (req, res) => {
    try {
      const events = await Event.find({
        organizer: req.user.id,
      })
        .sort({ date: 1 })
        .lean();

      const eventIds = events.map((event) => event._id);

      const sales = await Booking.aggregate([
        {
          $match: {
            event: { $in: eventIds },
            bookingStatus: 'CONFIRMED',
          },
        },
        {
          $group: {
            _id: '$event',
            ticketsSold: { $sum: '$ticketsBooked' },
            revenue: { $sum: '$totalAmount' },
          },
        },
      ]);

      const salesMap = {};

      sales.forEach((item) => {
        salesMap[item._id.toString()] = item;
      });

      const result = events.map((event) => {
        const sale = salesMap[event._id.toString()];

        return {
          ...event,
          ticketsSold: sale ? sale.ticketsSold : 0,
          revenue: sale ? sale.revenue : 0,
        };
      });

      return res.status(200).json({
        message: 'Events fetched successfully',
        data: result,
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }
);

// Get event attendees
router.get(
  '/:id/attendees',
  protect,
  authorize('ORGANIZER'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({
          message: 'Event not found',
        });
      }

      if (event.organizer.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }

      const attendees = await Booking.find({
        event: event._id,
        bookingStatus: 'CONFIRMED',
      })
        .populate('customer', 'name email')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: 'Attendees fetched successfully',
        data: attendees,
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }
);

// Get upcoming events
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {
      date: { $gte: new Date() },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    return res.status(200).json({
      message: 'Events fetched successfully',
      data: events,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

// Create event - Organizer only
router.post(
  '/',
  protect,
  authorize('ORGANIZER'),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        date,
        location,
        ticketPrice,
        totalTickets,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !date ||
        !location ||
        ticketPrice === undefined ||
        totalTickets === undefined
      ) {
        return res.status(400).json({
          message: 'Please fill all required fields',
        });
      }

      const eventDate = new Date(date);

      if (Number.isNaN(eventDate.getTime())) {
        return res.status(400).json({
          message: 'Invalid event date',
        });
      }

      if (eventDate <= new Date()) {
        return res.status(400).json({
          message: 'Event date must be in the future',
        });
      }

      const price = Number(ticketPrice);
      const capacity = Number(totalTickets);

      if (Number.isNaN(price) || price < 0) {
        return res.status(400).json({
          message: 'Ticket price cannot be negative',
        });
      }

      if (!Number.isInteger(capacity) || capacity < 1) {
        return res.status(400).json({
          message: 'Total tickets must be at least 1',
        });
      }

      const newEvent = await Event.create({
        title,
        description,
        category,
        date: eventDate,
        location,
        ticketPrice: price,
        totalTickets: capacity,
        availableTickets: capacity,
        organizer: req.user.id,
      });

      return res.status(201).json({
        message: 'Event created successfully',
        data: newEvent,
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }
);

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate(
      'organizer',
      'name email'
    );

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      message: 'Event fetched successfully',
      data: event,
    });
  } catch (e) {
    return res.status(400).json({
      message: 'Invalid event ID',
    });
  }
});

module.exports = router;
