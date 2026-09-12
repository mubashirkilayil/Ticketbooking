const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    ticketsBooked: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    bookingStatus: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ event: 1, createdAt: -1 });

// export default mongoose.model('Booking', bookingSchema);
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
