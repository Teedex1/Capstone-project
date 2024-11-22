import { loginUser, registerUser, getToken, clearToken } from './auth.js';
import { fetchTasks, addTask, deleteTask } from './task.js';

// UI Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const authForms = document.getElementById('auth-forms');
const taskManager = document.getElementById('taskManager');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const themeToggle = document.getElementById('themeToggle');
const logoutBtn = document.getElementById('logoutBtn');

// Theme Management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Logout functionality
logoutBtn.addEventListener('click', () => {
    clearToken();
    authForms.style.display = 'block';
    taskManager.style.display = 'none';
    showMessage('Logged out successfully!');
});

// Message display
function showMessage(text, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
    
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
}

// Switch between login and register forms
showRegisterLink.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLoginLink.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Handle Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    const result = await registerUser(username, email, password);
    
    if (result.success) {
        showMessage('Registration successful! Please log in.');
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        registerForm.reset();
    } else {
        showMessage(result.error, 'error');
    }
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = await loginUser(email, password);
    
    if (result.success) {
        showMessage('Login successful!');
        authForms.style.display = 'none';
        taskManager.style.display = 'block';
        loginForm.reset();
        loadTasks();
    } else {
        showMessage(result.error, 'error');
    }
});

// Handle Task Creation
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const deadline = document.getElementById('taskDeadline').value;
    
    const result = await addTask({
        title,
        description,
        priority,
        deadline
    });
    
    if (result.success) {
        showMessage('Task added successfully!');
        taskForm.reset();
        loadTasks();
    } else {
        showMessage(result.error, 'error');
    }
});

// Load and display tasks
async function loadTasks() {
    const result = await fetchTasks();
    
    if (result.success) {
        displayTasks(result.data);
    } else {
        showMessage(result.error, 'error');
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<div class="no-tasks"><i class="fas fa-tasks"></i><p>No tasks found. Add a new task to get started!</p></div>';
        updateTaskStats([]); // Update stats with empty array
        return;
    }
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item priority-${task.priority}">
            <h3>${task.title}</h3>
            <p>${task.description || 'No description provided'}</p>
            <p><strong>Priority:</strong> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
            <p><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleDateString()}</p>
            <div class="task-actions">
                <button onclick="deleteTask('${task._id}')" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');

    updateTaskStats(tasks); // Update stats after displaying tasks
}

// Update task statistics
function updateTaskStats(tasks) {
    const totalTasksElement = document.getElementById('totalTasks');
    const highPriorityElement = document.getElementById('highPriorityTasks');
    const dueTodayElement = document.getElementById('dueTodayTasks');

    // Total tasks
    const totalTasks = tasks.length;
    
    // High priority tasks
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    
    // Tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueTodayTasks = tasks.filter(task => {
        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);
        return deadline.getTime() === today.getTime();
    }).length;

    // Update the UI
    if (totalTasksElement) totalTasksElement.textContent = totalTasks;
    if (highPriorityElement) highPriorityElement.textContent = highPriorityTasks;
    if (dueTodayElement) dueTodayElement.textContent = dueTodayTasks;
}

// Handle task deletion
window.deleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
        const result = await deleteTask(taskId);
        
        if (result.success) {
            showMessage('Task deleted successfully!');
            loadTasks();
        } else {
            showMessage(result.error, 'error');
        }
    }
};

// Check authentication status on page load
window.addEventListener('DOMContentLoaded', () => {
    const token = getToken();
    if (token) {
        authForms.style.display = 'none';
        taskManager.style.display = 'block';
        loadTasks();
    }
});
