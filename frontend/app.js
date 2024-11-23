import { loginUser, registerUser, getToken, clearToken, checkAndRefreshToken } from './auth.js';
import { fetchTasks, addTask, deleteTask, updateTask } from './task.js';

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
const taskSearch = document.getElementById('taskSearch');
const clearSearch = document.getElementById('clearSearch');

let allTasks = []; // Store all tasks for filtering

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
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
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
        loadTasks();
        loginForm.reset();
    } else {
        showMessage(result.error, 'error');
    }
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    clearToken();
    authForms.style.display = 'block';
    taskManager.style.display = 'none';
    showMessage('Logged out successfully!');
});

// Load tasks from the server
async function loadTasks() {
    const result = await fetchTasks();
    if (result.success) {
        allTasks = result.data;
        console.log('Loaded tasks:', allTasks);
        const filteredTasks = filterTasks(allTasks);
        displayTasks(filteredTasks);
        updateTaskStats(filteredTasks);
    } else {
        showMessage(result.error, 'error');
    }
}

// Filter tasks based on search and priority 
function filterTasks(tasks) {
    if (!tasks) return [];
    
    const searchTerm = taskSearch ? taskSearch.value.toLowerCase() : '';
    const selectedPriority = priorityFilter ? priorityFilter.value : 'all';

    return tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                            task.description.toLowerCase().includes(searchTerm);
        
        const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
        
        return matchesSearch && matchesPriority;
    });
}

// Add priority filter controls
const filterContainer = document.querySelector('.filter-container');
if (filterContainer) {
    const priorityFilterHTML = `
        <select id="priorityFilter" class="filter-select">
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
        </select>
    `;
    filterContainer.insertAdjacentHTML('beforeend', priorityFilterHTML);
}

// Initialize priority filter
const priorityFilter = document.getElementById('priorityFilter');
if (priorityFilter) {
    priorityFilter.addEventListener('change', () => {
        const filteredTasks = filterTasks(allTasks);
        displayTasks(filteredTasks);
        updateTaskStats(filteredTasks);
    });
}

// Search event listeners
if (taskSearch) {
    taskSearch.addEventListener('input', (e) => {
        const filteredTasks = filterTasks(allTasks);
        displayTasks(filteredTasks);
        updateTaskStats(filteredTasks);
    });
}

if (clearSearch) {
    clearSearch.addEventListener('click', () => {
        taskSearch.value = '';
        displayTasks(allTasks);
        updateTaskStats(allTasks);
    });
}

// Display tasks in the UI
function displayTasks(tasks) {
    const taskList = document.getElementById('tasksList');
    if (!taskList) return;

    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="no-tasks"><i class="fas fa-tasks"></i><p>No tasks found. Add a new task to get started!</p></div>';
        return;
    }

    tasks.forEach(task => {
        const date = new Date(task.deadline);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const taskElement = document.createElement('div');
        taskElement.className = 'task-item priority-' + task.priority.toLowerCase();
        taskElement.innerHTML = `
            <div class="task-content">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="task-meta">
                    <span class="task-priority">
                        <i class="fas fa-flag"></i> ${task.priority}
                    </span>
                    <span class="task-deadline">
                        <i class="fas fa-calendar"></i> ${formattedDate}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="handleEditTask('${task._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="handleDeleteTask('${task._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

// Update task statistics
function updateTaskStats(tasks) {
    const totalTasksElement = document.getElementById('totalTasks');
    const highPriorityElement = document.getElementById('highPriorityTasks');
    const dueTodayElement = document.getElementById('dueTodayTasks');

    if (!totalTasksElement || !highPriorityElement || !dueTodayElement) return;

    const totalTasks = tasks.length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'High').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueTodayTasks = tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return taskDate.toDateString() === today.toDateString();
    }).length;

    totalTasksElement.textContent = totalTasks;
    highPriorityElement.textContent = highPriorityTasks;
    dueTodayElement.textContent = dueTodayTasks;
}

// Handle Task Creation/Update
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const deadline = document.getElementById('taskDeadline').value;

    if (!title) {
        showMessage('Task title is required', 'error');
        return;
    }

    if (!deadline) {
        showMessage('Deadline is required', 'error');
        return;
    }

    const taskData = {
        title,
        description,
        priority,
        deadline: new Date(deadline).toISOString()
    };

    try {
        let result;
        if (currentEditingTask) {
            result = await updateTask(currentEditingTask._id, taskData);
            if (result.success) {
                showMessage('Task updated successfully!');
                currentEditingTask = null;
                const submitBtn = document.querySelector('#taskForm button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Task';
            } else {
                throw new Error(result.error);
            }
        } else {
            result = await addTask(taskData);
            if (result.success) {
                showMessage('Task added successfully!');
            } else {
                throw new Error(result.error);
            }
        }

        if (result.success) {
            taskForm.reset();
            await loadTasks();
            const filteredTasks = filterTasks(allTasks);
            displayTasks(filteredTasks);
            updateTaskStats(filteredTasks);
        }
    } catch (error) {
        console.error('Task operation failed:', error);
        showMessage(error.message || 'Failed to process task', 'error');
    }
});

// Edit task functionality
let currentEditingTask = null;

window.handleEditTask = async function(taskId) {
    const task = allTasks.find(t => t._id === taskId);
    if (!task) return;

    currentEditingTask = task;
    
    // Format the date for the input field (YYYY-MM-DD)
    const date = new Date(task.deadline);
    const formattedDate = date.toISOString().split('T')[0];
    
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDeadline').value = formattedDate;
    
    const submitBtn = document.querySelector('#taskForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Task';
    
    document.querySelector('.task-controls').scrollIntoView({ behavior: 'smooth' });
}

// Handle task deletion
window.handleDeleteTask = async function(taskId) {
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
window.addEventListener('DOMContentLoaded', async () => {
    if (await checkAndRefreshToken()) {
        authForms.style.display = 'none';
        taskManager.style.display = 'block';
        loadTasks();
    } else {
        authForms.style.display = 'block';
        taskManager.style.display = 'none';
    }
});

// Periodically check token validity
setInterval(async () => {
    if (taskManager.style.display !== 'none') {
        if (!(await checkAndRefreshToken())) {
            authForms.style.display = 'block';
            taskManager.style.display = 'none';
            showMessage('Session expired. Please login again.', 'error');
        }
    }
}, 300000); // Check every 5 minutes