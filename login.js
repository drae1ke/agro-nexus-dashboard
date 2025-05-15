
// Simple hash function for password hashing (for demo purposes)
// In production, use a proper hashing library like bcrypt
function hashPassword(password) {
    let hash = 0;
    if (password.length === 0) return hash;
    
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(16); // Convert to hex string
}

// Initialize admin users if none exist
function initializeAdminUsers() {
    const users = JSON.parse(localStorage.getItem('agrovet_admins') || '[]');
    
    // If no users exist, create a default admin (for development purposes)
    if (users.length === 0) {
        console.log('No admin users found. You can create one using the registration form.');
    }
}

// Handle tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button
            button.classList.add('active');
            
            // Show corresponding content
            const tabName = button.dataset.tab;
            document.querySelector(`#${tabName}Form`).classList.add('active');
            
            // Clear messages
            document.getElementById('loginMessage').innerHTML = '';
            document.getElementById('loginMessage').className = 'message';
            document.getElementById('registerMessage').innerHTML = '';
            document.getElementById('registerMessage').className = 'message';
        });
    });
}

// Handle login form submission
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const messageDiv = document.getElementById('loginMessage');
        
        if (!username || !password) {
            showMessage(messageDiv, 'Please enter both username and password', 'error');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('agrovet_admins') || '[]');
        
        // Find user with matching username
        const user = users.find(u => u.username === username);
        
        if (!user) {
            showMessage(messageDiv, 'Invalid username or password', 'error');
            return;
        }
        
        // Check if password hash matches
        if (user.passwordHash === hashPassword(password)) {
            // Set logged in status
            localStorage.setItem('agrovet_currentUser', JSON.stringify({
                username: user.username,
                loginTime: new Date().toISOString()
            }));
            
            showMessage(messageDiv, 'Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage(messageDiv, 'Invalid username or password', 'error');
        }
    });
}

// Handle register form submission
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;
        const messageDiv = document.getElementById('registerMessage');
        
        // Validation
        if (!username || !password || !passwordConfirm) {
            showMessage(messageDiv, 'Please fill in all fields', 'error');
            return;
        }
        
        if (password !== passwordConfirm) {
            showMessage(messageDiv, 'Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage(messageDiv, 'Password must be at least 6 characters', 'error');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('agrovet_admins') || '[]');
        
        // Check if username already exists
        if (users.some(u => u.username === username)) {
            showMessage(messageDiv, 'Username already taken', 'error');
            return;
        }
        
        // Create new user with hashed password
        const newUser = {
            username,
            passwordHash: hashPassword(password),
            createdAt: new Date().toISOString()
        };
        
        // Add user to localStorage
        users.push(newUser);
        localStorage.setItem('agrovet_admins', JSON.stringify(users));
        
        // Show success message and clear form
        showMessage(messageDiv, 'Account created successfully! You can now login.', 'success');
        registerForm.reset();
        
        // Switch to login tab after successful registration
        setTimeout(() => {
            document.querySelector('.tab-btn[data-tab="login"]').click();
        }, 1500);
    });
}

// Utility to show message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

// Check if user is already logged in
function checkLoggedInStatus() {
    const currentUser = JSON.parse(localStorage.getItem('agrovet_currentUser') || 'null');
    
    if (currentUser) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'index.html';
    }
}

// Initialize the app
function init() {
    initializeAdminUsers();
    setupTabs();
    setupLoginForm();
    setupRegisterForm();
    checkLoggedInStatus();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
