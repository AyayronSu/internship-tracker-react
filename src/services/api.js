const API_BASE_URL = 'https://internship-application-tracker-io4x.onrender.com/';

export const api = {
    getApplications: async () => {
        const response = await fetch(API_BASE_URL);
        return await response.json();
    },

    addApplication: async (appData) => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData),
        });
        return await response.json();
    },

    updateApplication: async (id, appData) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData),
        });
        return await response.json();
    },

    deleteApplication: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    }
}