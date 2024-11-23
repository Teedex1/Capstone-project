const API_AUTH_BASE = "https://capstone-project-f0jquw.fly.dev/api/auth";

export function saveToken(token) {
    if (!token) {
        console.error('No token provided to save');
        return false;
    }
    localStorage.setItem('jwt', token);
    return true;
}

export function getToken() {
    return localStorage.getItem('jwt');
}

export function clearToken() {
    localStorage.removeItem('jwt');
}

export function isAuthenticated() {
    const token = getToken();
    if (!token) return false;

    // Check if token is expired
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch (e) {
        return false;
    }
}

export async function registerUser(username, email, password) {
    try {
        const response = await fetch(`${API_AUTH_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Registration failed");
        }

        const data = await response.json();
        
        if (data.token && saveToken(data.token)) {
            return { success: true, data };
        } else {
            throw new Error("Failed to save authentication token");
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_AUTH_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Login failed");
        }

        const data = await response.json();

        if (data.token && saveToken(data.token)) {
            return { success: true, data };
        } else {
            throw new Error("Failed to save authentication token");
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Check token validity and refresh if needed
export async function checkAndRefreshToken() {
    const token = getToken();
    if (!token) return false;

    try {
        const response = await fetch(`${API_AUTH_BASE}/verify`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            clearToken();
            return false;
        }

        return true;
    } catch (error) {
        clearToken();
        return false;
    }
}
