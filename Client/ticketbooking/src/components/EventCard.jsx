import './EventCard.css';
function EventCard({ event, onBook }) {
  const date = new Date(event.date);
  const soldOut = event.availableTickets <= 0;

  return (
    <article className="event-card">
      <div className="event-top">
        <span className="category-badge">{event.category}</span>
        <span className={soldOut ? 'ticket-badge sold' : 'ticket-badge'}>{soldOut ? 'Sold Out' : `${event.availableTickets} left`}</span>
      </div>
      <div className="date-box">
        <strong>{date.toLocaleDateString('en-IN', { day: '2-digit' })}</strong>
        <span>{date.toLocaleDateString('en-IN', { month: 'short' })}</span>
      </div>
      <h3>{event.title}</h3>
      <p className="description">{event.description}</p>
      <div className="event-details">
        <span>📍 {event.location}</span>
        <span>🕒 {date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        <span>₹{event.ticketPrice.toLocaleString('en-IN')} / ticket</span>
      </div>
      <button className="primary-btn" disabled={soldOut} onClick={onBook}>{soldOut ? 'Sold Out' : 'Book Tickets'}</button>
    </article>
  );
}

export default EventCard;
