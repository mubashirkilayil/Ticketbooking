const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Music', 'Tech', 'Workshop', 'Sports', 'Other'],
      required: true,
    },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    totalTickets: { type: Number, required: true, min: 1 },
    availableTickets: { type: Number, required: true, min: 0 },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

eventSchema.index({ title: 'text', description: 'text', location: 'text' });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
