const API_AUTH_BASE = "http://localhost:5000/auth";

export function saveToken(token) {
    if (!token) {
        console.error('No token provided to save');
        return false;
    }
    console.log('Saving token:', token);
    localStorage.setItem('jwt', token);
    return true;
}

export function getToken() {
    const token = localStorage.getItem('jwt');
    console.log('Retrieved token:', token);
    return token;
}

export function clearToken() {
    console.log('Clearing token from storage');
    localStorage.removeItem('jwt');
}

export async function registerUser(username, email, password) {
    try {
        console.log('Attempting registration for:', email);
        const response = await fetch(`${API_AUTH_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        console.log('Registration response:', data);
        
        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        if (data.token && saveToken(data.token)) {
            console.log('Registration successful, token saved');
            return { success: true, data };
        } else {
            throw new Error("Failed to save authentication token");
        }
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: error.message };
    }
}

export async function loginUser(email, password) {
    try {
        console.log('Attempting login for:', email);
        const response = await fetch(`${API_AUTH_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        if (data.token && saveToken(data.token)) {
            console.log('Login successful, token saved');
            return { success: true, data };
        } else {
            throw new Error("Failed to save authentication token");
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
    }
}

export function isAuthenticated() {
    const token = getToken();
    console.log('Checking authentication, token exists:', !!token);
    return !!token;
}
