import './Header.css';
import { Link, useLocation } from 'react-router-dom';

function Header({ user, logout }) {
  const location = useLocation();

  return (
    <header className="header">
      <Link className="brand" to={user.role === 'ORGANIZER' ? '/organizer' : '/events'}>
        <div className="brand-icon">TB</div>
        <div>
          <h1>TicketBook</h1>
          <span>Events & Tickets</span>
        </div>
      </Link>

      <nav>
        {user.role === 'CUSTOMER' ? (
          <>
            <Link className={location.pathname === '/events' ? 'nav-btn active' : 'nav-btn'} to="/events">Events</Link>
            <Link className={location.pathname === '/my-bookings' ? 'nav-btn active' : 'nav-btn'} to="/my-bookings">My Bookings</Link>
          </>
        ) : (
          <>
            <Link className={location.pathname === '/organizer' ? 'nav-btn active' : 'nav-btn'} to="/organizer">Dashboard</Link>
            <Link className={location.pathname === '/organizer/create-event' ? 'nav-btn active' : 'nav-btn'} to="/organizer/create-event">Create Event</Link>
          </>
        )}
      </nav>

      <div className="user-area">
        <div className="user-info">
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
