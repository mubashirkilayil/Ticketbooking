import './AttendeesModal.css';
import { useEffect, useState } from 'react';
import { API_URL } from './constants';

function AttendeesModal({ event, token, onClose }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/events/${event._id}/attendees`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to fetch attendees');
        setAttendees(data.data || []);
      } catch (e) {
        setMessage(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [event._id, token]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal large" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <span className="category-badge">ATTENDEES</span><h2>{event.title}</h2>
        {message && <div className="alert error">{message}</div>}
        {loading ? <div className="loading"><div className="spinner" /> Loading attendees...</div> : attendees.length === 0 ? <div className="empty"><h3>No attendees yet</h3></div> : <div className="attendee-list">
          {attendees.map((booking) => <div className="attendee" key={booking._id}>
            <div className="avatar">{booking.customer?.name?.charAt(0).toUpperCase() || '?'}</div>
            <div><strong>{booking.customer?.name || 'Unknown customer'}</strong><span>{booking.customer?.email}</span></div>
            <div className="attendee-tickets">{booking.ticketsBooked} ticket(s)</div>
          </div>)}
        </div>}
      </div>
    </div>
  );
}

export default AttendeesModal;
