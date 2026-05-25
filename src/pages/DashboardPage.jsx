import { useState, useEffect } from "react";
import AppCard from "../components/AppCard";
import AddAppForm from "../components/AddAppForm";
import { api } from "../services/api";

function DashboardPage({ user }) {
    const [applications, setApplications] = useState([])
    const [filter, setFilter] = useState('All');
    const [feedback, setFeedback] = useState({ type: null, message: null });
    
    const showFeedback = (type, message) => {
        setFeedback({ type, message });

        if (type === 'success') {
            setTimeout(() => setFeedback({ type: null, message: null }), 4000);
        }
    };

    const fetchApps = async () => {
        try {
            const data = await api.getApplications();
            setApplications(data);
        } catch (err) {
            showFeedback("error", "Unable to load applications timeline.");
            console.error(err);
        }
    };

    const handleAddApplication = async (newApp) => {
        try {
            await api.addApplication(newApp);
            showFeedback("success", `Successfully added ${newApp.company}!`);
            fetchApps();
        } catch (err) {
            const serverMessage = err.message || "Failed to save application tracker.";
            showFeedback("error", serverMessage);
            throw err;
        };
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const filteredApps = filter === 'All'
        ? applications
        : applications.filter(app => app.status === filter);

    return (
        <div className="app-container">
            {feedback.message && (
                <div className={`alert-banner ${feedback.type}-banner`}>
                    <span>{feedback.message}</span>
                    {feedback.type === 'error' && (
                        <button className="retry-btn" onClick={fetchApps}>Retry</button>
                    )}
                    <button 
                        className="close-btn"
                        onClick={() => setFeedback({ type: null, message: null })}
                    >
                        ×
                    </button>
                </div>
            )}

            <AddAppForm onAdd={handleAddApplication} />

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