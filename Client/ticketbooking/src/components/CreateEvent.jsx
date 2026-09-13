import './CreateEvent.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, categories } from './constants';

function CreateEvent({ token, onCreated }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Music', date: '', location: '', ticketPrice: '', totalTickets: '' });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);
    setLoading(true);
    try {
      if (new Date(form.date) <= new Date()) throw new Error('Please choose a future date and time');
      if (Number(form.ticketPrice) < 0) throw new Error('Ticket price cannot be negative');
      if (!Number.isInteger(Number(form.totalTickets)) || Number(form.totalTickets) < 1) throw new Error('Capacity must be at least 1');

      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, ticketPrice: Number(form.ticketPrice), totalTickets: Number(form.totalTickets) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to create event');

      setSuccess(true);
      setForm({ title: '', description: '', category: 'Music', date: '', location: '', ticketPrice: '', totalTickets: '' });
      setTimeout(onCreated, 700);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h3>Create a new event</h3><p>Fill in the event details. All tickets are available initially.</p>
      {message && <div className="alert error">{message}</div>}
      {success && <div className="alert success">Event created successfully!</div>}
      <form className="event-form" onSubmit={submit}>
        <label>Event Title<input name="title" value={form.title} onChange={update} placeholder="e.g. Kerala Tech Summit" required /></label>
        <label>Category<select name="category" value={form.category} onChange={update}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Description<textarea name="description" value={form.description} onChange={update} placeholder="Tell customers about the event" rows="4" required /></label>
        <label>Date & Time<input type="datetime-local" name="date" value={form.date} onChange={update} required /></label>
        <label>Location<input name="location" value={form.location} onChange={update} placeholder="Kochi, Kerala" required /></label>
        <label>Ticket Price (₹)<input type="number" min="0" name="ticketPrice" value={form.ticketPrice} onChange={update} placeholder="500" required /></label>
        <label>Total Tickets<input type="number" min="1" name="totalTickets" value={form.totalTickets} onChange={update} placeholder="100" required /></label>
        <div className="form-actions"><button className="primary-btn" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</button></div>
      </form>
    </div>
  );
}

export default CreateEvent;
