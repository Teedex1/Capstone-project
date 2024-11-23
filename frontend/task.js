const API_BASE = "https://task-management-dawn-resonance-5917.fly.dev/api/tasks";
import { getToken } from './auth.js';

export async function fetchTasks() {
    const token = getToken();
    if (!token) {
        return { success: false, error: "No authentication token found" };
    }

    try {
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        
        const response = await fetch(API_BASE, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Failed to fetch tasks");
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return { success: false, error: error.message };
    }
}

export async function addTask(task) {
    const token = getToken();
    if (!token) {
        return { success: false, error: "No authentication token found" };
    }

    try {
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        const response = await fetch(API_BASE, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Failed to add task");
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error adding task:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteTask(taskId) {
    const token = getToken();
    if (!token) {
        return { success: false, error: "No authentication token found" };
    }

    try {
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        const response = await fetch(`${API_BASE}/${taskId}`, {
            method: "DELETE",
            headers: headers
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Failed to delete task");
        }

        return { success: true };
    } catch (error) {
        console.error("Error deleting task:", error);
        return { success: false, error: error.message };
    }
}

// Update an existing task
export async function updateTask(taskId, taskData) {
    const token = getToken();
    if (!token) {
        return { success: false, error: "No authentication token found" };
    }

    try {
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        const response = await fetch(`${API_BASE}/${taskId}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Failed to update task");
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error updating task:", error);
        return { success: false, error: error.message };
    }
}
