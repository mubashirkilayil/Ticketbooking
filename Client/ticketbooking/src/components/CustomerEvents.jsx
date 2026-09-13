import './CustomerEvents.css';
import { useEffect, useState } from 'react';
import { API_URL, categories } from './constants';
import EventCard from './EventCard';
import BookingModal from './BookingModal';

function CustomerEvents({ token }) {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search.trim()) params.append('search', search.trim());
      const response = await fetch(`${API_URL}/events?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to fetch events');
      setEvents(data.data || []);
      setMessage('');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadEvents, 250);
    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">DISCOVER EVENTS</p><h2>Find your next experience</h2><p>Browse upcoming events and book your tickets.</p></div></div>
      <div className="filters">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events, places..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      {message && <div className="alert error">{message}</div>}
      {loading ? <div className="loading"><div className="spinner" /> Loading events...</div> : events.length === 0 ? <div className="empty"><h3>No events found</h3><p>Try another search or category.</p></div> : <div className="event-grid">{events.map((event) => <EventCard key={event._id} event={event} onBook={() => setSelectedEvent(event)} />)}</div>}
      {selectedEvent && <BookingModal event={selectedEvent} token={token} onClose={() => setSelectedEvent(null)} onBooked={() => { setSelectedEvent(null); loadEvents(); }} />}
    </section>
  );
}

export default CustomerEvents;
