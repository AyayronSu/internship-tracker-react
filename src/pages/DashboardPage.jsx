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
    total_items: 0,
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
      if (err.message === "Unauthorized") {
        showFeedback("error", "Your session has expired. Reloading...");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        showFeedback("error", "Unable to load applications. Please try again.");
      }
      console.error(err);
    }
  };

  const handleAddApplication = async (newApp) => {
    if (!newApp.company.trim() || !newApp.role.trim()) {
      showFeedback("error", "Company and Role names cannot be blank.");
      return;
    }
    try {
      await api.addApplication({
        company: newApp.company.trim(),
        role: newApp.role.trim(),
        status: newApp.status,
      });
      showFeedback("success", `${newApp.company.trim()} added successfully!`);
      setPage(1);
      setSort('newest');
      fetchApps();
    } catch (err) {
      showFeedback("error", err.message || "Failed to save application.");
      throw err;
    }
  };

  useEffect(() => { fetchApps(); }, [page, sort, filter]);

  return (
    <div className="app-container">
      {feedback.message && (
        <div className={`alert-banner ${feedback.type}-banner`}>
          <span>{feedback.message}</span>
          {feedback.type === 'error' && feedback.message !== "Your session has expired. Reloading..." && (
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

      <div className="control-bar">
        <div className="filter-section">
          <label className="filter-label">Status</label>
          <select
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="sort-section">
          <label className="sort-label">Sort</label>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {pagination.total_items > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {pagination.total_items} application{pagination.total_items !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No applications found. Add one above to get started.</p>
        </div>
      ) : (
        <div className="list-container">
          {applications.map(app => (
            <AppCard key={app.id} app={app} onUpdate={fetchApps} />
          ))}
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            disabled={!pagination.has_prev}
            onClick={() => setPage(prev => prev - 1)}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page <strong>{pagination.current_page}</strong> of {pagination.total_pages}
          </span>
          <button
            className="pagination-btn"
            disabled={!pagination.has_next}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;