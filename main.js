// Enhanced Main JavaScript for The Elders CBT Practice Platform
// This file handles core functionality, user management, and database integration

// Global variables
let databaseService = null;
let isOnline = navigator.onLine;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 The Elders CBT Practice - Initializing...');
    
    // Initialize theme
    initializeTheme();
    
    // Initialize database service
    initializeDatabaseService();
    
    // Initialize page-specific functionality
    initializePageFunctionality();
    
    // Setup online/offline detection
    setupNetworkDetection();
    
    console.log('✅ Initialization complete');
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.textContent = isDark ? '☀️' : '🌙';
            
            // Smooth transition
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
}

// Database Service Initialization
async function initializeDatabaseService() {
    try {
        // Check if Supabase is available
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            const { DatabaseService } = await import('./lib/supabase.js');
            databaseService = new DatabaseService();
            console.log('✅ Database service initialized');
        } else {
            console.log('📱 Using localStorage mode');
        }
    } catch (error) {
        console.log('📱 Database not available, using localStorage:', error.message);
    }
}

// Page-specific initialization
function initializePageFunctionality() {
    const currentPage = getCurrentPage();
    console.log(`📄 Current page: ${currentPage}`);
    
    switch (currentPage) {
        case 'index':
            initializeLoginPage();
            break;
        case 'home':
            initializeHomePage();
            break;
        case 'quiz':
            initializeQuizPage();
            break;
        case 'dashboard':
            initializeDashboardPage();
            break;
        case 'help':
            initializeHelpPage();
            break;
        default:
            console.log('ℹ️ No specific initialization for this page');
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

// Login Page Initialization
function initializeLoginPage() {
    console.log('🔐 Initializing login page...');
    
    // Check if user is already logged in
    const userData = getUserData();
    if (userData.currentUser && userData.users[userData.currentUser]) {
        console.log('👤 User already logged in, redirecting...');
        window.location.href = 'home.html';
        return;
    }
    
    // Setup login form
    const loginForm = document.getElementById('login-form');
    const nameInput = document.getElementById('name-input');
    const departmentSelect = document.getElementById('department-select');
    
    if (!loginForm || !nameInput || !departmentSelect) {
        console.error('❌ Login form elements not found');
        return;
    }
    
    // Real-time validation
    nameInput.addEventListener('input', function() {
        validateNameInput(this);
    });
    
    departmentSelect.addEventListener('change', function() {
        validateDepartmentSelect(this);
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    console.log('✅ Login page initialized');
}

// Validate name input
function validateNameInput(input) {
    const feedback = document.getElementById('name-feedback');
    const value = input.value.trim();
    
    if (value.length === 0) {
        setInputState(input, feedback, '', '');
    } else if (value.length < 6) {
        setInputState(input, feedback, 'error', 'Name must be at least 6 characters long');
    } else {
        setInputState(input, feedback, 'success', 'Looks good!');
    }
}

// Validate department selection
function validateDepartmentSelect(select) {
    const feedback = document.getElementById('department-feedback');
    
    if (select.value) {
        setInputState(select, feedback, 'success', 'Department selected');
    } else {
        setInputState(select, feedback, '', '');
    }
}

// Set input validation state
function setInputState(input, feedback, state, message) {
    // Remove existing states
    input.classList.remove('input-success', 'input-error');
    
    // Add new state
    if (state) {
        input.classList.add(`input-${state}`);
    }
    
    // Update feedback
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `form-feedback ${state ? `feedback-${state}` : ''}`;
    }
}

// Handle login form submission
async function handleLogin() {
    console.log('🔄 Processing login...');
    
    const nameInput = document.getElementById('name-input');
    const departmentSelect = document.getElementById('department-select');
    const submitBtn = document.querySelector('button[type="submit"]');
    
    const name = nameInput.value.trim();
    const department = departmentSelect.value;
    
    // Validation
    if (name.length < 6) {
        showError('Name must be at least 6 characters long');
        return;
    }
    
    if (!department) {
        showError('Please select a department');
        return;
    }
    
    // Show loading state
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">Logging in...</span><span class="btn-icon">⏳</span>';
    
    try {
        // Create or get user
        const user = await createOrGetUser(name, department);
        
        // Save to localStorage
        const userData = getUserData();
        const userId = generateUserId(name, department);
        
        userData.users[userId] = user;
        userData.currentUser = userId;
        
        localStorage.setItem('eldersUserData', JSON.stringify(userData));
        
        console.log('✅ Login successful:', user.name);
        
        // Success feedback
        submitBtn.innerHTML = '<span class="btn-text">Success!</span><span class="btn-icon">✅</span>';
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
        
    } catch (error) {
        console.error('❌ Login failed:', error);
        showError('Login failed. Please try again.');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
    }
}

// Create or get user
async function createOrGetUser(name, department) {
    const userId = generateUserId(name, department);
    const userData = getUserData();
    
    // Check if user exists in localStorage
    if (userData.users[userId]) {
        console.log('👤 Existing user found');
        const user = userData.users[userId];
        
        // Update last visit
        user.lastVisit = new Date().toISOString();
        
        // Try to sync with database
        if (databaseService) {
            try {
                await databaseService.updateUser(user.email, {
                    last_visit: user.lastVisit
                });
            } catch (error) {
                console.log('⚠️ Database sync failed:', error.message);
            }
        }
        
        return user;
    }
    
    // Create new user
    console.log('👤 Creating new user');
    const newUser = {
        id: userId,
        name: name,
        department: department,
        email: `${userId}@theelders.local`,
        joinDate: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        totalXP: 0,
        level: 1,
        studyStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        totalQuizzesTaken: 0,
        perfectScores: 0,
        averageScore: 0,
        quizHistory: [],
        achievements: [],
        weakAreas: {},
        courseProgress: {}
    };
    
    // Try to save to database
    if (databaseService) {
        try {
            await databaseService.createUser(newUser);
            console.log('✅ User saved to database');
        } catch (error) {
            console.log('⚠️ Database save failed:', error.message);
        }
    }
    
    return newUser;
}

// Generate consistent user ID
function generateUserId(name, department) {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanDept = department.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${cleanName}_${cleanDept}`;
}

// Get user data from localStorage
function getUserData() {
    try {
        const data = localStorage.getItem('eldersUserData');
        return data ? JSON.parse(data) : { users: {}, currentUser: null };
    } catch (error) {
        console.error('❌ Error reading user data:', error);
        return { users: {}, currentUser: null };
    }
}

// Show error message
function showError(message) {
    // Remove existing error
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-message">${message}</span>
        </div>
    `;
    
    // Insert before form
    const form = document.getElementById('login-form');
    form.parentNode.insertBefore(errorDiv, form);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Home Page Initialization
function initializeHomePage() {
    console.log('🏠 Initializing home page...');
    
    // Check if user is logged in
    const userData = getUserData();
    if (!userData.currentUser || !userData.users[userData.currentUser]) {
        console.log('❌ No user logged in, redirecting...');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('✅ Home page initialized');
}

// Quiz Page Initialization
function initializeQuizPage() {
    console.log('📝 Initializing quiz page...');
    
    // Check if user is logged in
    const userData = getUserData();
    if (!userData.currentUser || !userData.users[userData.currentUser]) {
        console.log('❌ No user logged in, redirecting...');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize quiz functionality
    initializeQuiz();
}

// Dashboard Page Initialization
function initializeDashboardPage() {
    console.log('📊 Initializing dashboard page...');
    
    // Check if user is logged in
    const userData = getUserData();
    if (!userData.currentUser || !userData.users[userData.currentUser]) {
        console.log('❌ No user logged in, redirecting...');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('✅ Dashboard page initialized');
}

// Help Page Initialization
function initializeHelpPage() {
    console.log('❓ Initializing help page...');
    
    // Initialize FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        if (question && answer && icon) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('faq-open');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('faq-open');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherIcon) otherIcon.textContent = '+';
                });
                
                // Toggle current item
                if (!isOpen) {
                    item.classList.add('faq-open');
                    icon.textContent = '−';
                }
            });
        }
    });
    
    console.log('✅ Help page initialized');
}

// Network Detection
function setupNetworkDetection() {
    window.addEventListener('online', function() {
        isOnline = true;
        console.log('🌐 Back online');
        showNetworkStatus('Connected', 'success');
    });
    
    window.addEventListener('offline', function() {
        isOnline = false;
        console.log('📱 Gone offline');
        showNetworkStatus('Offline - Using local storage', 'warning');
    });
}

// Show network status
function showNetworkStatus(message, type) {
    // Remove existing status
    const existingStatus = document.querySelector('.network-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create status element
    const statusDiv = document.createElement('div');
    statusDiv.className = `network-status network-${type}`;
    statusDiv.innerHTML = `
        <span class="status-icon">${type === 'success' ? '🌐' : '📱'}</span>
        <span class="status-message">${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(statusDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        statusDiv.remove();
    }, 3000);
}

// Quiz functionality (simplified version)
function initializeQuiz() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name');
    const courseCode = urlParams.get('course');
    const department = urlParams.get('department');
    
    if (!userName || !courseCode || !department) {
        console.error('❌ Missing quiz parameters');
        window.location.href = 'home.html';
        return;
    }
    
    console.log(`📝 Starting quiz: ${courseCode} for ${userName}`);
    
    // Load quiz data
    loadQuizData(courseCode);
}

// Load quiz data
async function loadQuizData(courseCode) {
    try {
        // Show loading
        const loadingEl = document.getElementById('loading-quiz');
        if (loadingEl) {
            loadingEl.style.display = 'block';
        }
        
        // Load course script
        const script = document.createElement('script');
        script.src = `courses/${courseCode}.js`;
        script.onload = function() {
            console.log(`✅ Loaded quiz data for ${courseCode}`);
            initializeQuizInterface();
        };
        script.onerror = function() {
            console.error(`❌ Failed to load quiz data for ${courseCode}`);
            showQuizError('Course not found. Please try another course.');
        };
        
        document.head.appendChild(script);
        
    } catch (error) {
        console.error('❌ Error loading quiz:', error);
        showQuizError('Failed to load quiz. Please try again.');
    }
}

// Initialize quiz interface
function initializeQuizInterface() {
    const loadingEl = document.getElementById('loading-quiz');
    const segmentEl = document.getElementById('segment-selection-quiz');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (segmentEl) segmentEl.style.display = 'block';
    
    // Setup segment buttons
    const segment1Btn = document.getElementById('start-segment-1-btn');
    const segment2Btn = document.getElementById('start-segment-2-btn');
    
    if (segment1Btn) {
        segment1Btn.addEventListener('click', () => startQuizSegment(1));
    }
    
    if (segment2Btn) {
        segment2Btn.addEventListener('click', () => startQuizSegment(2));
    }
}

// Start quiz segment
function startQuizSegment(segmentNumber) {
    console.log(`🚀 Starting segment ${segmentNumber}`);
    
    // Hide segment selection
    const segmentEl = document.getElementById('segment-selection-quiz');
    const quizEl = document.getElementById('quiz-container');
    
    if (segmentEl) segmentEl.style.display = 'none';
    if (quizEl) quizEl.style.display = 'block';
    
    // Initialize quiz logic here
    // This would contain the full quiz implementation
}

// Show quiz error
function showQuizError(message) {
    const loadingEl = document.getElementById('loading-quiz');
    if (loadingEl) {
        loadingEl.innerHTML = `
            <div class="error-state">
                <div class="error-icon">❌</div>
                <h3>Quiz Loading Failed</h3>
                <p>${message}</p>
                <button onclick="window.location.href='home.html'" class="segment-btn">
                    Return to Home
                </button>
            </div>
        `;
    }
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function calculateLevel(xp) {
    return Math.floor(xp / 1000) + 1;
}

function getXPForNextLevel(currentXP) {
    const currentLevel = calculateLevel(currentXP);
    return currentLevel * 1000;
}

// Export functions for use in other files
window.EldersCBT = {
    getUserData,
    databaseService: () => databaseService,
    isOnline: () => isOnline,
    formatDate,
    formatTime,
    calculateLevel,
    getXPForNextLevel
};

console.log('📚 The Elders CBT Practice - Main script loaded');