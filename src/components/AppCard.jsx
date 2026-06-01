import { useState } from "react";
import FormInput from "./ui/FormInput";
import Button from "./ui/Button";
import { api } from "../services/api";

function AppCard({ app, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState(app.company);
  const [role, setRole] = useState(app.role);
  const [status, setStatus] = useState(app.status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!company.trim() || !role.trim()) {
      alert("Company and Role fields cannot be left empty.");
      return;
    }
    setLoading(true);
    try {
      await api.updateApplication(app.id, {
        company: company.trim(),
        role: role.trim(),
        status,
      });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCompany(app.company);
    setRole(app.role);
    setStatus(app.status);
    setIsEditing(false);
  };

  const accentClass = `accent-${app.status.toLowerCase()}`;

  if (isEditing) {
    return (
      <div className={`card editing-card ${accentClass}`}>
        <div className="card-edit-inputs">
          <FormInput
            label="Company"
            value={company}
            onChange={e => setCompany(e.target.value)}
            disabled={loading}
          />
          <FormInput
            label="Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            disabled={loading}
          />
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="status-select"
              disabled={loading}
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="card-actions">
          <Button variant="primary" onClick={handleSave} loading={loading} loadingText="Saving...">
            Save changes
          </Button>
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${accentClass}`}>
      <div className="card-info">
        <h3>{app.company}</h3>
        <p>{app.role}</p>
        <div className="card-meta">
          <span className={`status-tag ${app.status.toLowerCase()}`}>
            {app.status}
          </span>
        </div>
      </div>
      <div className="card-actions">
        <Button variant="secondary" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            if (window.confirm(`Remove ${app.company} from your tracker?`)) {
              try {
                await api.deleteApplication(app.id);
                onUpdate();
              } catch (err) {
                console.error("Deletion failed:", err);
              }
            }
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default AppCard;