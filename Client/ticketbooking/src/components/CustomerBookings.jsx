import './CustomerBookings.css';
import { useEffect, useState } from 'react';
import { API_URL } from './constants';

function CustomerBookings({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/bookings/my-bookings`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to fetch bookings');
        setBookings(data.data || []);
      } catch (e) {
        setMessage(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">CUSTOMER</p><h2>My Bookings</h2><p>Your confirmed event tickets.</p></div></div>
      {message && <div className="alert error">{message}</div>}
      {loading ? <div className="loading"><div className="spinner" /> Loading bookings...</div> : bookings.length === 0 ? <div className="empty"><h3>No bookings yet</h3><p>Book an event and it will appear here.</p></div> : <div className="booking-list">
        {bookings.map((booking) => <article className="booking-card" key={booking._id}>
          <div><span className="category-badge">{booking.event?.category}</span><h3>{booking.event?.title || 'Event unavailable'}</h3><p>{booking.event?.location}</p><p>{booking.event?.date && new Date(booking.event.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
          <div className="booking-right"><strong>{booking.ticketsBooked} ticket(s)</strong><span>₹{booking.totalAmount.toLocaleString('en-IN')}</span><small>{booking.bookingStatus}</small></div>
        </article>)}
      </div>}
    </section>
  );
}

export default CustomerBookings;
