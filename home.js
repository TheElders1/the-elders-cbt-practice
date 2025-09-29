document.addEventListener('DOMContentLoaded', () => {
    // Initialize home dashboard only if we're on the home page
    if (!document.getElementById('home-dashboard')) return;

    // Get user data manager from main.js
    const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
    const currentUser = userData.currentUser ? userData.users[userData.currentUser] : null;

    if (!currentUser) {
        // 🔒 NO USER DATA - Redirect back to login
        console.log('No user data found, redirecting to login');
        window.location.href = 'index.html';
        return;
    }

    // Initialize home dashboard
    initializeHomeDashboard(currentUser);

    function initializeHomeDashboard(user) {
        // Update welcome message
        document.getElementById('user-welcome').textContent = `Welcome back, ${user.name}! (${user.department})`;

        // Populate course selection based on user's department
        populateCourseSelection(user.department);

        // Update stats
        document.getElementById('total-quizzes').textContent = user.totalQuizzesTaken;
        document.getElementById('average-score').textContent = `${user.averageScore}%`;
        document.getElementById('study-streak').textContent = user.studyStreak;
        document.getElementById('user-level').textContent = user.level;

        // Create performance chart (last 10 quizzes)
        createPerformanceChart(user.quizHistory.slice(-10));

        // Display recent achievements
        displayRecentAchievements(user.achievements);

        // Display recent activity
        displayRecentActivity(user.quizHistory.slice(-5));

        // Setup event listeners
        setupEventListeners();
        
        // Add welcome animation
        animateWelcome();
    }

    function animateWelcome() {
        const welcomeEl = document.getElementById('user-welcome');
        if (welcomeEl) {
            welcomeEl.style.opacity = '0';
            welcomeEl.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                welcomeEl.style.transition = 'all 0.5s ease';
                welcomeEl.style.opacity = '1';
                welcomeEl.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    function populateCourseSelection(department) {
        const coursesByDepartment = {
            "Computer Science": [
                { code: "MTH121", name: "Elementary Mathematics II" },
                { code: "GST121", name: "General Studies" },
                { code: "COS121", name: "Problem Solving" },
                { code: "PHY121", name: "Electricity & Magnetism" },
                { code: "CSC121", name: "Web Development with Django" },
                { code: "CSC122", name: "Web Technologies" }
            ],
            "Cyber Security": [
                { code: "MTH121", name: "Elementary Mathematics II" },
                { code: "GST121", name: "General Studies" },
                { code: "COS121", name: "Problem Solving" },
                { code: "PHY121", name: "Electricity & Magnetism" },
                { code: "CYB121", name: "Ethical Issues In Cyber Security" },
                { code: "CYB122", name: "Critical Thinking" }
            ],
            "Data Science": [
                { code: "MTH121", name: "Elementary Mathematics II" },
                { code: "GST121", name: "General Studies" },
                { code: "COS121", name: "Problem Solving" },
                { code: "PHY121", name: "Electricity & Magnetism" },
                { code: "DTS121", name: "Web Development with Django" },
                { code: "DTS122", name: "Web Technologies" }
            ],
            "Information Technology": [
                { code: "MTH121", name: "Elementary Mathematics II" },
                { code: "GST121", name: "General Studies" },
                { code: "COS121", name: "Problem Solving" },
                { code: "PHY121", name: "Electricity & Magnetism" },
                { code: "IFT121", name: "Ethical Issues in Cyber Security" },
                { code: "IFT122", name: "Critical Thinking" }
            ],
            "Software Engineering": [
                { code: "MTH121", name: "Elementary Mathematics II" },
                { code: "GST121", name: "General Studies" },
                { code: "COS121", name: "Problem Solving" },
                { code: "PHY121", name: "Electricity & Magnetism" },
                { code: "SEN121", name: "Web Development with Django" },
                { code: "SEN122", name: "Web Technologies" }
            ]
        };

        const courseSelect = document.getElementById('quick-course-select');
        const courses = coursesByDepartment[department] || [];
        
        // Clear existing options
        courseSelect.innerHTML = '<option value="" disabled selected>-- Select Course --</option>';
        
        // Add department-specific courses
        courses.forEach(course => {
            courseSelect.innerHTML += `<option value="${course.code}">${course.code} - ${course.name}</option>`;
        });
        
        // Add visual indicator of department
        const departmentIndicator = document.createElement('div');
        departmentIndicator.className = 'department-indicator';
        departmentIndicator.innerHTML = `📚 Showing courses for: <strong>${department}</strong>`;
        
        // Insert department indicator before course selection
        const courseCard = courseSelect.closest('.action-card');
        const existingIndicator = courseCard.querySelector('.department-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        courseCard.insertBefore(departmentIndicator, courseCard.querySelector('.course-selection-inline'));
    }

    function createPerformanceChart(recentQuizzes) {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        
        if (recentQuizzes.length === 0) {
            ctx.font = '16px Inter';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No quiz data available yet', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        const labels = recentQuizzes.map((quiz, index) => `Quiz ${index + 1}`);
        const scores = recentQuizzes.map(quiz => quiz.percentage);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score (%)',
                    data: scores,
                    borderColor: '#510F64',
                    backgroundColor: 'rgba(81, 15, 100, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#510F64',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    function displayRecentAchievements(userAchievements) {
        const container = document.getElementById('recent-achievements');
        
        const allAchievements = [
            { id: 'first_quiz', name: 'Getting Started', description: 'Complete your first quiz', icon: '🎯' },
            { id: 'perfect_score', name: 'Perfect Score', description: 'Score 100% on a quiz', icon: '💯' },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a quiz in under 15 minutes', icon: '⚡' },
            { id: 'streak_3', name: '3-Day Streak', description: 'Study for 3 consecutive days', icon: '🔥' },
            { id: 'streak_7', name: 'Week Warrior', description: 'Study for 7 consecutive days', icon: '📅' },
            { id: 'quiz_master_10', name: 'Quiz Master', description: 'Complete 10 quizzes', icon: '🎓' },
            { id: 'perfectionist', name: 'Perfectionist', description: 'Score 100% on 5 quizzes', icon: '🏆' }
        ];

        const recentAchievements = allAchievements
            .filter(achievement => userAchievements.includes(achievement.id))
            .slice(-3); // Show last 3 achievements

        if (recentAchievements.length === 0) {
            container.innerHTML = '<p class="no-data">🎯 Complete your first quiz to earn achievements!</p>';
            return;
        }

        container.innerHTML = '';
        recentAchievements.forEach(achievement => {
            const achievementEl = document.createElement('div');
            achievementEl.className = 'achievement-preview';
            achievementEl.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-content">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
            `;
            container.appendChild(achievementEl);
        });
    }

    function displayRecentActivity(recentQuizzes) {
        const container = document.getElementById('recent-activity-home');
        
        if (recentQuizzes.length === 0) {
            container.innerHTML = '<p class="no-data">📋 No recent activity to display.</p>';
            return;
        }

        container.innerHTML = '';
        recentQuizzes.reverse().forEach(quiz => {
            const date = new Date(quiz.date);
            const timeAgo = getTimeAgo(date);
            
            const activityEl = document.createElement('div');
            activityEl.className = 'activity-preview';
            activityEl.innerHTML = `
                <div class="activity-icon">${quiz.percentage === 100 ? '🏆' : quiz.percentage >= 80 ? '🎯' : '📝'}</div>
                <div class="activity-content">
                    <h4>${quiz.courseCode} - Segment ${quiz.segmentNumber}</h4>
                    <p>Scored ${quiz.score}/${quiz.totalQuestions} (${quiz.percentage}%)</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
                <div class="activity-score ${quiz.percentage >= 80 ? 'good-score' : quiz.percentage >= 50 ? 'ok-score' : 'poor-score'}">
                    ${quiz.percentage}%
                </div>
            `;
            container.appendChild(activityEl);
        });
    }

    function setupEventListeners() {
        // Course selection change
        document.getElementById('quick-course-select').addEventListener('change', function() {
            const startBtn = document.getElementById('quick-start-btn');
            startBtn.disabled = !this.value;
        });

        // Quick start quiz
        document.getElementById('quick-start-btn').addEventListener('click', function() {
            const courseSelect = document.getElementById('quick-course-select');
            const selectedCourse = courseSelect.value;
            
            if (selectedCourse) {
                // Add loading state
                this.disabled = true;
                this.innerHTML = '<span class="btn-text">Starting Quiz...</span><span class="btn-icon">⏳</span>';
                
                const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
                const currentUser = userData.users[userData.currentUser];
                
                const encodedName = encodeURIComponent(currentUser.name);
                const encodedCourse = encodeURIComponent(selectedCourse);
                const encodedDepartment = encodeURIComponent(currentUser.department);
                
                // Small delay for better UX
                setTimeout(() => {
                    window.location.href = `quiz.html?name=${encodedName}&course=${encodedCourse}&department=${encodedDepartment}`;
                }, 500);
            }
        });

        // Practice weak areas
        document.getElementById('practice-weak-btn').addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<span class="btn-text">Finding Weak Areas...</span><span class="btn-icon">🔍</span>';
            
            const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
            const currentUser = userData.users[userData.currentUser];
            
            // Find course with most weak areas
            let maxWeakAreas = 0;
            let targetCourse = null;
            
            Object.keys(currentUser.weakAreas || {}).forEach(courseCode => {
                const weakCount = Object.keys(currentUser.weakAreas[courseCode]).length;
                if (weakCount > maxWeakAreas) {
                    maxWeakAreas = weakCount;
                    targetCourse = courseCode;
                }
            });
            
            if (targetCourse) {
                const encodedName = encodeURIComponent(currentUser.name);
                const encodedCourse = encodeURIComponent(targetCourse);
                const encodedDepartment = encodeURIComponent(currentUser.department);
                
                setTimeout(() => {
                    window.location.href = `quiz.html?name=${encodedName}&course=${encodedCourse}&department=${encodedDepartment}`;
                }, 800);
            } else {
                // Reset button state
                this.disabled = false;
                this.innerHTML = '<span class="btn-text">Practice Weak Areas</span><span class="btn-icon">🎯</span>';
                
                // Show friendly message
                const messageEl = document.createElement('div');
                messageEl.className = 'friendly-message';
                messageEl.innerHTML = `
                    <div class="message-content">
                        <div class="message-icon">🎯</div>
                        <h4>Great News!</h4>
                        <p>No weak areas identified yet. Take a few quizzes first to get personalized recommendations!</p>
                        <button onclick="this.parentElement.parentElement.remove()" class="message-close">Got it!</button>
                    </div>
                `;
                document.body.appendChild(messageEl);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (messageEl.parentElement) {
                        messageEl.remove();
                    }
                }, 5000);
            }
        });

        // Logout functionality
        document.getElementById('logout-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
                userData.currentUser = null;
                localStorage.setItem('eldersUserData', JSON.stringify(userData));
                window.location.href = 'index.html';
            }
        });
    }

    function getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return date.toLocaleDateString();
    }
});
