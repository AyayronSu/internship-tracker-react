import { useState } from "react";
import { api } from "../services/api";

function AppCard({ app, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedApp, setEditedApp] = useState({ ...app });

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${app.company}?`)) return;
        await api.deleteApplication(app.id);
        onUpdate();
    };

    const handleSave = async () => {
        await api.updateApplication(app.id, editedApp);
        setIsEditing(false);
        onUpdate();
    };

    if (isEditing) {
        return (
            <div className="card edit-mode">
                <input 
                    type="text" 
                    value={editedApp.company}
                    onChange={(e) => setEditedApp({...editedApp, company: e.target.value})}
                />
                <input 
                    type="text" 
                    value={editedApp.role}
                    onChange={(e) => setEditedApp({...editedApp, role: e.target.value})}
                />
                <select
                    value={editedApp.status}
                    onChange={(e) => setEditedApp({...editedApp, status: e.target.value})}
                >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <div className="card-actions">
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-info">
                <h3>{app.company}</h3>
                <p><strong>{app.role}</strong></p>
                <span className={`status-tag ${app.status.toLowerCase()}`}>
                    {app.status}
                </span>
            </div>
            <div className="card-actions">
                <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default AppCard;