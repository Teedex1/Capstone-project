const API_BASE = "http://localhost:5000/api/tasks";
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
        
        console.log('Fetch Tasks - Token:', token);
        console.log('Fetch Tasks - Headers:', headers);

        const response = await fetch(API_BASE, {
            method: "GET",
            headers: headers,
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch tasks");
        }

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

        console.log('Add Task - Token:', token);
        console.log('Add Task - Headers:', headers);
        console.log('Add Task - Body:', task);

        const response = await fetch(API_BASE, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(task),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add task");
        }

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

        console.log('Delete Task - Token:', token);
        console.log('Delete Task - Headers:', headers);

        const response = await fetch(`${API_BASE}/${taskId}`, {
            method: "DELETE",
            headers: headers,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to delete task");
        }

        return { success: true };
    } catch (error) {
        console.error("Error deleting task:", error);
        return { success: false, error: error.message };
    }
}

export async function updateTask(taskId, updates) {
    const token = getToken();
    if (!token) {
        return { success: false, error: "No authentication token found" };
    }

    try {
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        console.log('Update Task - Token:', token);
        console.log('Update Task - Headers:', headers);
        console.log('Update Task - Body:', updates);

        const response = await fetch(`${API_BASE}/${taskId}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update task");
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error updating task:", error);
        return { success: false, error: error.message };
    }
}
