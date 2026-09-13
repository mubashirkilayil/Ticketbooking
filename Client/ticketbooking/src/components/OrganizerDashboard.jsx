import './OrganizerDashboard.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from './constants';
import AttendeesModal from './AttendeesModal';

function OrganizerDashboard({ token }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/events/organizer/my-events`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to fetch events');
      setEvents(data.data || []);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, [token]);

  return (
    <section>
      <div className="page-heading organizer-heading">
        <div><p className="eyebrow">ORGANIZER</p><h2>Manage your events</h2><p>Create events, track ticket sales and view attendees.</p></div>
        <Link className="primary-btn small" to="/organizer/create-event">+ Create Event</Link>
      </div>
      {message && <div className="alert error">{message}</div>}
      {loading ? <div className="loading"><div className="spinner" /> Loading your events...</div> : events.length === 0 ? <div className="empty"><h3>No events created</h3><p>Create your first event to start selling tickets.</p></div> : <div className="organizer-grid">
        {events.map((event) => <article className="organizer-card" key={event._id}>
          <div className="event-top"><span className="category-badge">{event.category}</span><span className={event.availableTickets === 0 ? 'ticket-badge sold' : 'ticket-badge'}>{event.availableTickets} left</span></div>
          <h3>{event.title}</h3><p>{event.location}</p><p>{new Date(event.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          <div className="stats"><div><span>Tickets sold</span><strong>{event.ticketsSold}</strong></div><div><span>Revenue</span><strong>₹{event.revenue.toLocaleString('en-IN')}</strong></div><div><span>Capacity</span><strong>{event.totalTickets}</strong></div></div>
          <button className="secondary-btn" onClick={() => setSelectedEvent(event)}>View Attendees</button>
        </article>)}
      </div>}
      {selectedEvent && <AttendeesModal event={selectedEvent} token={token} onClose={() => setSelectedEvent(null)} />}
    </section>
  );
}

export default OrganizerDashboard;
