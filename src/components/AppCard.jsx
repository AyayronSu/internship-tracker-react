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
        setLoading(true);
        try {
            await api.updateApplication(app.id, { company, role, status });
            setIsEditing(false);
            onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (isEditing) {
    return (
    <div className="card editing-card">
        <div className="card-edit-inputs">
        <FormInput label="Company" value={company} onChange={e => setCompany(e.target.value)} />
        <FormInput label="Role" value={role} onChange={e => setRole(e.target.value)} />
        <div className="form-group">
            <label className="form-label">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="status-select">
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            </select>
        </div>
        </div>
        <div className="card-actions">
        <Button variant="primary" onClick={handleSave} loading={loading}>Save</Button>
        <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
    </div>
    );
}

    return (
        <div className="card">
        <div className="card-info">
            <h3>{app.company}</h3>
            <p>{app.role}</p>
            <span className={`status-tag ${app.status.toLowerCase()}`}>{app.status}</span>
        </div>
        <div className="card-actions">
            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
            <Button variant="danger" onClick={async () => {
            if (window.confirm(`Delete ${app.company}?`)) {
                await api.deleteApplication(app.id);
                onUpdate();
            }
            }}>Delete</Button>
        </div>
        </div>
    );
    }

export default AppCard;