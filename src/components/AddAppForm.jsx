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
        await onAdd({ company, role, status });
        setCompany('');
        setRole('');
        setStatus('Applied');
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="add-form">
            <FormInput
                label="Company"
                placeholder="e.g., Google"
                value={company}
                onChange={e => setCompany(e.target.value)}
                required
            />
            <FormInput
                label="Role"
                placeholder="e.g., Software Engineer"
                value={role}
                onChange={e => setCompany(e.target.value)}
                required
            />
            <div className="form-group select-group">
                <label className="form-label">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <Button type="submit" loading={loading}>
                Add Job
            </Button>
        </form>
    );
}

export default AddAppForm;