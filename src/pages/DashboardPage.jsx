import { useState, useEffect } from "react";
import AppCard from "../components/AppCard";
import AddAppForm from "../components/AddAppForm";
import { api } from "../services/api";

function DashboardPage({ user }) {
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
            <AddAppForm onAdd={fetchApps} />

            <div className="filter-section">
                <label className="filter-label">Filter Status:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {error && (
                <div className="error-banner">
                    {error} <button className="retry-btn" onClick={fetchApps}>Retry</button>
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