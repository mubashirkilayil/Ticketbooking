import './BookingModal.css';
import { useState } from 'react';
import { API_URL } from './constants';

function BookingModal({ event, token, onClose, onBooked }) {
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const total = Number(tickets) * event.ticketPrice;

  const book = async () => {
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/events/${event._id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ticketsBooked: Number(tickets) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Booking failed');
      onBooked();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <span className="category-badge">{event.category}</span>
        <h2>Book {event.title}</h2>
        <p>{event.location}</p>
        {message && <div className="alert error">{message}</div>}
        <label>Number of tickets
          <input type="number" min="1" max={event.availableTickets} value={tickets} onChange={(e) => setTickets(e.target.value)} />
        </label>
        <div className="total-box"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
        <button className="primary-btn" disabled={loading || Number(tickets) < 1 || Number(tickets) > event.availableTickets} onClick={book}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

export default BookingModal;
