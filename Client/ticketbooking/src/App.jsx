import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import PrivateRoutes from './components/PrivateRoutes';
import AuthPage from './components/AuthPage';
import CustomerEvents from './components/CustomerEvents';
import CustomerBookings from './components/CustomerBookings';
import OrganizerDashboard from './components/OrganizerDashboard';
import CreateEvent from './components/CreateEvent';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ticketUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('ticketToken') || '');

  const login = (data) => {
    localStorage.setItem('ticketToken', data.token);
    localStorage.setItem('ticketUser', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('ticketToken');
    localStorage.removeItem('ticketUser');
    setToken('');
    setUser(null);
  };

  return (
    <div className="app">
      {user && token && <Header user={user} logout={logout} />}

      <main className={user && token ? 'main-container' : ''}>
        <Routes>
          {!user || !token ? (
            <>
              <Route path="/login" element={<AuthPage initialMode="login" onLogin={login} />} />
              <Route path="/signup" element={<AuthPage initialMode="register" onLogin={login} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route element={<PrivateRoutes user={user} token={token} role="CUSTOMER" />}>
                <Route path="/events" element={<CustomerEvents token={token} />} />
                <Route path="/my-bookings" element={<CustomerBookings token={token} />} />
              </Route>

              <Route element={<PrivateRoutes user={user} token={token} role="ORGANIZER" />}>
                <Route path="/organizer" element={<OrganizerDashboard token={token} />} />
                <Route path="/organizer/create-event" element={<CreateEvent token={token} />} />
              </Route>

              <Route
                path="/"
                element={<Navigate to={user.role === 'ORGANIZER' ? '/organizer' : '/events'} replace />}
              />
              <Route
                path="*"
                element={<Navigate to={user.role === 'ORGANIZER' ? '/organizer' : '/events'} replace />}
              />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
