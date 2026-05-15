import { useState, useEffect } from 'react';
import AppCard from './components/AppCard';
import AddAppForm from './components/AddAppForm';
import Auth from './components/Auth';
import { api } from './services/api';
import './App.css'

function App() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    api.checkAuth()
      .then(data => {
        if (data.is_logged_in) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchApps = async () => {
    if (!user) return;

    try {
      const data = await api.getApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError("Unable to load applications. Please check your connection.");
      console.error(err)
    }
  };

  useEffect(() => {
    if (user) {
      fetchApps();
    }
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      setApplications([]);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const filteredApps = filter === 'All'
    ? applications
    : applications.filter(app => app.status === filter);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={(username) => setUser(username)} />;
  }

  return (
      <div className="app-container">
        <div className="header-container">
          <div className="brand">
              <h1>Application Tracker</h1>
              <p className="welcome-text">Logged in as: <strong>{user}</strong></p>
          </div>
          <div className="header-controls">
            <button onClick={() => setDarkMode(!darkMode)} className='theme-toggle'>
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        <AddAppForm onAdd={fetchApps} />
        <hr />
        
        <div className="filter-section">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {error && (
          <div className='error-banner'>
            {error} <button onClick={fetchApps}>Retry</button>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="empty-state">
            No applications found. Start by adding one above!
          </div>
        ) : (
          <div className="list-container">
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} onUpdate={fetchApps} />
            ))}
          </div>
        )}
      </div>
    );
}

export default App
