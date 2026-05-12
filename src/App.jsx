import { useState, useEffect } from 'react';
import AppCard from './components/AppCard';
import AddAppForm from './components/AddAppForm';
import { api } from './services/api';
import './App.css'

function App() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const fetchApps = async () => {
    try {
      const data = await api.getApplications();
      setApplications(data)
    } catch (err) {
      setError("Unable to reach the server. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const filteredApps = filter === 'All'
    ? applications
    : applications.filter(app => app.status === filter);

  return (
    <div className="app-container">
      <div className="header-container">
        <h1>Application Tracker</h1>
        <button onClick={() => setDarkMode(!darkMode)} className='theme-toggle'>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
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

      {error && <div className='error-banner'>{error} <button onClick={fetchApps}>Retry</button></div>}

      {loading ? (
        <div className="loading-spinner">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="empty-state">No applications found. Start by adding one above!</div>
      ) : (
        <div className="list-container">
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} onUpdate={fetchApps} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
