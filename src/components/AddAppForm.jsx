import { useState } from "react";
import FormInput from "./ui/FormInput";
import Button from "./ui/Button";

function AddAppForm({ onAdd }) {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Applied');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { api } = await import('../services/api');

        try {
            await api.addApplication({ company, role, status });
            setCompany('');
            setRole('');
            setStatus('Applied');
            onAdd();
        } catch (err) {
            console.error("Failed to add application:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <FormInput 
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
            />
            <FormInput 
                placeholder="Job Role/Title"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
            />
            <div className="form-group select-group">
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <button type="submit" loading={loading}>
                Add Application
            </button>
        </form>
    )
}

export default AddAppForm;