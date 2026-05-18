import { useState, useEffect } from "react";
import AppCard from "../components/AppCard";
import AddAppForm from "../components/AddAppForm";
import { api } from "../services/api";

function DashboardPage({ user, handleLogout }) {
    const [applications, setApplications] = useState([])
    const [filter, setFilter] = useState('All');
    const [error, setError] = useState(null);

    const fetchApps = async () => {
        try {
            const data = await api.getApplications();
            setApplications(data);
            setError(null);
        } catch (err) {
            setError("Unable to load applications.");
            console.error(err);
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
                <div className="brand">
                    <h1>Application Tracker</h1>
                    <p className="welcome-text">Logged in as: <strong>{user}</strong></p>
                </div>
                <div className="header-controls">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            <AddAppForm onAdd={fetchApps} />
            <hr />

            <div className="filter-section">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {error && (
                <div className="error-banner">
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

export default DashboardPage;