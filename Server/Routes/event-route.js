const express = require('express');

const Event = require('../db/Models/Event');
const Booking = require('../db/Models/Booking');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {
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

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate('organizer', 'name email');

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
    return res.status(500).json({
      message: e.message,
    });
  }
});

// Create event
router.post('/', async (req, res) => {
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

    if (new Date(date) <= new Date()) {
      return res.status(400).json({
        message: 'Event date must be in the future',
      });
    }

    const newEvent = await Event.create({
      title,
      description,
      category,
      date,
      location,
      ticketPrice,
      totalTickets,
      availableTickets: totalTickets,
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
});

// Organizer - My events
router.get('/organizer/my-events', async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user.id,
    })
      .sort({ date: 1 })
      .lean();

    const eventIds = events.map(event => event._id);

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
          ticketsSold: {
            $sum: '$ticketsBooked',
          },
          revenue: {
            $sum: '$totalAmount',
          },
        },
      },
    ]);

    const salesMap = Object.fromEntries(
      sales.map(item => [item._id.toString(), item])
    );

    const result = events.map(event => ({
      ...event,
      ticketsSold: salesMap[event._id.toString()]?.ticketsSold || 0,
      revenue: salesMap[event._id.toString()]?.revenue || 0,
    }));

    return res.status(200).json({
      message: 'Events fetched successfully',
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

// Get event attendees
router.get('/:id/attendees', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    if (event.organizer.toString() !== req.user.id) {
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
});

// Book tickets
router.post('/:id/book', async (req, res) => {
  try {
    const { id } = req.params;
    const { requestedTickets } = req.body;

    const tickets = Number(requestedTickets);

    if (!Number.isInteger(tickets) || tickets < 1) {
      return res.status(400).json({
        message: 'Please enter a valid number of tickets',
      });
    }

    const event = await Event.findOneAndUpdate(
      {
        _id: id,
        date: { $gte: new Date() },
        availableTickets: { $gte: tickets },
      },
      {
        $inc: {
          availableTickets: -tickets,
        },
      },
      {
        new: true,
      }
    );

    if (!event) {
      const existingEvent = await Event.findById(id);

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

    const newBooking = await Booking.create({
      customer: req.user.id,
      event: id,
      ticketsBooked: tickets,
      totalAmount: totalAmount,
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
