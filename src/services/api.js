const API_BASE_URL = 'http://127.0.0.1:5000/applications';

export const api = {
    getApplications: async () => {
        const response = await fetch(API_BASE_URL, {
            credentials: 'include',
        });
        if (response.status === 401) throw new Error("Unauthorized");
        return await response.json();
    },

    addApplication: async (appData) => {
        const response = await fetch(API_BASE_URL, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData),
        });
        if (response.status === 401) throw new Error("Unauthorized");
        return await response.json();
    },

    updateApplication: async (id, appData) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData),
        });
        if (response.status === 401) throw new Error("Unauthorized");
        return await response.json();
    },

    deleteApplication: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            credentials: 'include',
            method: 'DELETE',
        });
        if (response.status === 401) throw new Error("Unauthorized")
        return response.ok;
    }
}