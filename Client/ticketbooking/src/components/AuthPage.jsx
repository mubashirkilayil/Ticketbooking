import './AuthPage.css';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from './constants';

function AuthPage({ initialMode = 'login', onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.pathname === '/signup' ? 'register' : initialMode;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : form;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      if (mode === 'login') {
        onLogin(data);
        navigate(data.user.role === 'ORGANIZER' ? '/organizer' : '/events', {
          replace: true,
        });
      } else {
        setMessage('Registration successful. Please login.');
        setForm({ ...form, password: '' });
        navigate('/login', { replace: true });
      }
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">TB</div>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p>
          {mode === 'login'
            ? 'Login to continue to TicketBook'
            : 'Join TicketBook as a customer or organizer'}
        </p>

        {message && (
          <div
            className={
              message.includes('successful') ? 'alert success' : 'alert error'
            }
          >
            {message}
          </div>
        )}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Your name"
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              placeholder="Minimum 6 characters"
              minLength="6"
              required
            />
          </label>
          {mode === 'register' && (
            <label>
              Account Type
              <select name="role" value={form.role} onChange={update}>
                <option value="CUSTOMER">Customer</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
            </label>
          )}
          <button className="primary-btn" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Login'
                : 'Create Account'}
          </button>
        </form>

        {mode === 'login' ? (
          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        ) : (
          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
