const BASE_URL = 'http://127.0.0.1:5000'; 

export const api = {
    checkAuth: async () => {
        const response = await fetch(`${BASE_URL}/check-auth`, { credentials: 'include' });
        return await response.json();
    },
    logout: async () => {
        const response = await fetch(`${BASE_URL}/logout`, { credentials: 'include' });
        return await response.json();
    },
    getApplications: async () => {
        const response = await fetch(`${BASE_URL}/applications`, { credentials: 'include' });
        if (response.status === 401) throw new Error("Unauthorized");
        return await response.json();
    },
    addApplication: async (appData) => {
        const response = await fetch(`${BASE_URL}/applications`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData),
        });
        if (response.status === 401) throw new Error("Unauthorized");
        return await response.json();
    },
    updateApplication: async (id, appData) => {
        const response = await fetch(`${BASE_URL}/applications/${id}`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData),
        });
        if (response.status === 401) throw new Error("Unauthorized");
        return await response.json();
    },

    deleteApplication: async (id) => {
        const response = await fetch(`${BASE_URL}/applications/${id}`, {
            credentials: 'include',
            method: 'DELETE',
        });
        if (response.status === 401) throw new Error("Unauthorized")
        return response.ok;
    }
}