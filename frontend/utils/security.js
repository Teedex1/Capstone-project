// Input validation and sanitization utilities

// Sanitize string input to prevent XSS
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Validate task input
export function validateTaskInput(title, description, priority, deadline) {
    const errors = [];

    // Title validation
    if (!title || typeof title !== 'string') {
        errors.push('Title is required');
    } else if (title.length < 1 || title.length > 100) {
        errors.push('Title must be between 1 and 100 characters');
    }

    // Description validation
    if (description && description.length > 500) {
        errors.push('Description must not exceed 500 characters');
    }

    // Priority validation
    const validPriorities = ['Low', 'Medium', 'High'];
    if (!validPriorities.includes(priority)) {
        errors.push('Invalid priority level');
    }

    // Deadline validation
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
        errors.push('Invalid deadline date');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validate email format
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validate user input for registration
export function validateUserInput(username, email, password) {
    const errors = [];

    // Username validation
    if (!username || typeof username !== 'string') {
        errors.push('Username is required');
    } else if (username.length < 3 || username.length > 30) {
        errors.push('Username must be between 3 and 30 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Email validation
    if (!validateEmail(email)) {
        errors.push('Invalid email format');
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
