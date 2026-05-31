import { useState, useEffect } from "react";
import AppCard from "../components/AppCard";
import AddAppForm from "../components/AddAppForm";
import { api } from "../services/api";

function DashboardPage({ user }) {
    const [applications, setApplications] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        has_next: false,
        has_prev: false,
        total_items: 0
    });

    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
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
            const data = await api.getApplications(page, sort, filter);
            setApplications(data.applications);
            setPagination(data.pagination);
        } catch (err) {
            showFeedback("error", "Unable to load applications timeline.");
            console.error(err);
        }
    };

    const handleAddApplication = async (newApp) => {
        try {
            await api.addApplication(newApp);
            showFeedback("success", `Successfully added ${newApp.company}!`);
            setPage(1);
            setSort('newest');
            fetchApps();
        } catch (err) {
            const serverMessage = err.message || "Failed to save application tracker.";
            showFeedback("error", serverMessage);
            throw err;
        };
    };

    useEffect(() => {
        fetchApps();
    }, [page, sort, filter]);

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

            <div className="control-bar" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <div className="filter-section">
                    <label className="filter-label">Filter Status:</label>
                    <select 
                        value={filter} 
                        onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="sort-section">
                    <label className="sort-label">Sort By: </label>
                    <select
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    No applications found. Start by adding one above!
                </div>
            ) : (
                <div className="list-container">
                    {applications.map(app => (
                        <AppCard key={app.id} app={app} onUpdate={fetchApps} />
                    ))}
                </div>
            )}

            {pagination.total_pages > 1 && (
                <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
                    <button 
                        className="pagination-btn"
                        disabled={!pagination.has_prev}
                        onClick={() => setPage(prev => prev - 1)}
                    >
                        Previous
                    </button>

                    <span className="pagination-info">
                        Page <strong>{pagination.current_page}</strong> of {pagination.total_pages}
                    </span>

                    <button 
                        className="pagination-btn"
                        disabled={!pagination.has_next}
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;