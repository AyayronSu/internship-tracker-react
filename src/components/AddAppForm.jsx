import { useState } from "react";
import { api } from "../services/api";

function AddAppForm({ onAdd }) {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: 'Applied'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.company.trim() || !formData.role.trim()) {
            alert("Please enter both a company name and a role.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            await api.addApplication(formData);
            setFormData({ company: '', role: '', status: 'Applied' });
            onAdd();
        } catch (err) {
            alert("Failed to save application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <input 
                type="text"  
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <input 
                type="text"  
                placeholder="Job Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add Application"}
            </button>
        </form>
    )
}

export default AddAppForm;