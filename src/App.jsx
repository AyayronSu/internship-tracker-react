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
        <header className="main-header">
          <div className="brand-group">
            <div className="logo-icon">🚀</div>
            <div>
              <h1>ApplyTrack</h1>
              <p>Logged in as <span>{user}</span></p>
            </div>
          </div>
          <div className="nav-actions">
            <button onClick={() => setDarkMode(!darkMode)} className="icon-btn">
                  {darkMode ? '☀️' : '🌙'}
            </button>         
            <button className="logout-pill" onClick={handleLogout}>Logout</button>   
          </div>
        </header>

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
            <div className="empty-icon">📁</div>
            <h3>No applications yet</h3>
            <p>Your dream job is waiting. Add your first application above to start tracking your journey!</p>
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
