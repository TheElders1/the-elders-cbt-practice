document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('goals-page')) return;

    // Get user data
    const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
    const currentUser = userData.currentUser ? userData.users[userData.currentUser] : null;

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize user goals data if not exists
    if (!currentUser.studyGoals) currentUser.studyGoals = [];
    if (!currentUser.studyReminders) currentUser.studyReminders = [];
    if (!currentUser.goalStats) {
        currentUser.goalStats = {
            totalGoals: 0,
            completedGoals: 0,
            goalStreak: 0,
            lastGoalCompleted: null
        };
    }

    // DOM Elements
    const currentGoalsContainer = document.getElementById('current-goals-container');
    const completedGoalsContainer = document.getElementById('completed-goals-container');
    const remindersContainer = document.getElementById('reminders-container');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const addReminderBtn = document.getElementById('add-reminder-btn');
    const addGoalForm = document.getElementById('add-goal-form');
    const addReminderForm = document.getElementById('add-reminder-form');
    const goalTypeSelect = document.getElementById('goal-type');
    const goalCourseSelect = document.getElementById('goal-course');

    // Initialize
    populateCourseSelect();
    displayGoals();
    displayReminders();
    updateProgressStats();
    setupEventListeners();
    checkReminders();

    function populateCourseSelect() {
        const coursesByDepartment = {
            "Computer Science": [
                { code: "MTH121", name: "Elementary Mathematics II" },
                { code: "GST121", name: "General Studies" },
                { code: "COS121", name: "Problem Solving" },
                { code: "PHY121", name: "Electricity & Magnetism" },
                { code: "CSC121", name: "Web Development with Django" },
                { code: "CSC122", name: "Advanced Programming" }
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
                { code: "DTS122", name: "Data Analysis" }
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
                { code: "SEN122", name: "Software Architecture" }
            ]
        };

        const courses = coursesByDepartment[currentUser.department] || [];
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.code;
            option.textContent = `${course.code} - ${course.name}`;
            goalCourseSelect.appendChild(option);
        });
    }

    function setupEventListeners() {
        addGoalBtn.addEventListener('click', () => openModal('add-goal-modal'));
        addReminderBtn.addEventListener('click', () => openModal('add-reminder-modal'));
        addGoalForm.addEventListener('submit', handleAddGoal);
        addReminderForm.addEventListener('submit', handleAddReminder);
        
        goalTypeSelect.addEventListener('change', handleGoalTypeChange);
        
        document.getElementById('clear-completed-btn').addEventListener('click', clearCompletedGoals);

        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                closeModal(modal.id);
            });
        });

        // Set default deadline to next week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        document.getElementById('goal-deadline').value = nextWeek.toISOString().split('T')[0];
    }

    function handleGoalTypeChange() {
        const goalType = goalTypeSelect.value;
        const targetValueGroup = document.getElementById('target-value-group');
        const courseSelectGroup = document.getElementById('course-select-group');
        const goalTitleInput = document.getElementById('goal-title');
        const goalTargetInput = document.getElementById('goal-target');

        // Show/hide course selection for course mastery goals
        if (goalType === 'course_mastery') {
            courseSelectGroup.style.display = 'block';
            goalTargetInput.placeholder = 'Target average score (%)';
        } else {
            courseSelectGroup.style.display = 'none';
        }

        // Update placeholder text based on goal type
        const placeholders = {
            'quiz_count': 'Complete 10 quizzes this week',
            'score_target': 'Achieve 85% average score',
            'streak_target': 'Maintain 7 day study streak',
            'course_mastery': 'Master CSC121 with 90% average',
            'time_based': 'Study 10 hours this week',
            'custom': 'Your custom goal'
        };

        const targetPlaceholders = {
            'quiz_count': '10',
            'score_target': '85',
            'streak_target': '7',
            'course_mastery': '90',
            'time_based': '10',
            'custom': '1'
        };

        if (placeholders[goalType]) {
            goalTitleInput.placeholder = placeholders[goalType];
            goalTargetInput.placeholder = targetPlaceholders[goalType];
        }
    }

    function handleAddGoal(e) {
        e.preventDefault();
        
        const goalData = {
            id: Date.now(),
            type: document.getElementById('goal-type').value,
            title: document.getElementById('goal-title').value,
            description: document.getElementById('goal-description').value,
            target: parseInt(document.getElementById('goal-target').value),
            course: document.getElementById('goal-course').value,
            deadline: document.getElementById('goal-deadline').value,
            priority: document.getElementById('goal-priority').value,
            progress: 0,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        currentUser.studyGoals.push(goalData);
        currentUser.goalStats.totalGoals++;
        saveUserData();
        displayGoals();
        updateProgressStats();
        closeModal('add-goal-modal');
        addGoalForm.reset();
        
        showNotification('🎯 Study goal created successfully!');
    }

    function handleAddReminder(e) {
        e.preventDefault();
        
        const selectedDays = Array.from(document.querySelectorAll('.day-checkbox input:checked'))
            .map(cb => cb.value);

        if (selectedDays.length === 0) {
            showNotification('❌ Please select at least one day for the reminder!');
            return;
        }

        const reminderData = {
            id: Date.now(),
            title: document.getElementById('reminder-title').value,
            time: document.getElementById('reminder-time').value,
            days: selectedDays,
            message: document.getElementById('reminder-message').value || 'Time to study! 📚',
            active: true,
            createdAt: new Date().toISOString()
        };

        currentUser.studyReminders.push(reminderData);
        saveUserData();
        displayReminders();
        closeModal('add-reminder-modal');
        addReminderForm.reset();
        
        showNotification('⏰ Study reminder created successfully!');
        scheduleNotifications();
    }

    function displayGoals() {
        const activeGoals = currentUser.studyGoals.filter(goal => !goal.completed);
        const completedGoals = currentUser.studyGoals.filter(goal => goal.completed);

        displayGoalsList(activeGoals, currentGoalsContainer, false);
        displayGoalsList(completedGoals, completedGoalsContainer, true);
    }

    function displayGoalsList(goals, container, isCompleted) {
        if (goals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">${isCompleted ? '🏆' : '🎯'}</div>
                    <h3>No ${isCompleted ? 'Completed' : 'Active'} Goals</h3>
                    <p>${isCompleted ? 'Complete some goals to see them here!' : 'Create your first study goal to get started!'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        goals.forEach(goal => {
            const progress = calculateGoalProgress(goal);
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const isOverdue = daysLeft < 0;
            
            const goalEl = document.createElement('div');
            goalEl.className = `goal-card priority-${goal.priority} ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
            goalEl.innerHTML = `
                <div class="goal-header">
                    <div class="goal-priority">${getPriorityIcon(goal.priority)}</div>
                    <div class="goal-actions">
                        ${!isCompleted ? `
                            <button onclick="markGoalComplete('${goal.id}')" class="icon-btn success">✓</button>
                        ` : ''}
                        <button onclick="deleteGoal('${goal.id}')" class="icon-btn danger">🗑️</button>
                    </div>
                </div>
                <div class="goal-content">
                    <h4>${goal.title}</h4>
                    ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${progress}% complete</span>
                    </div>
                    <div class="goal-details">
                        <span class="goal-type">${formatGoalType(goal.type)}</span>
                        ${goal.course ? `<span class="goal-course">${goal.course}</span>` : ''}
                    </div>
                </div>
                <div class="goal-footer">
                    <div class="goal-deadline ${isOverdue ? 'overdue' : daysLeft <= 3 ? 'urgent' : ''}">
                        ${isOverdue ? `⚠️ ${Math.abs(daysLeft)} days overdue` : 
                          daysLeft === 0 ? '🔥 Due today' :
                          daysLeft === 1 ? '⏰ Due tomorrow' :
                          `📅 ${daysLeft} days left`}
                    </div>
                    ${isCompleted ? `
                        <div class="completion-date">
                            ✅ Completed ${new Date(goal.completedAt).toLocaleDateString()}
                        </div>
                    ` : ''}
                </div>
            `;
            container.appendChild(goalEl);
        });
    }

    function calculateGoalProgress(goal) {
        switch (goal.type) {
            case 'quiz_count':
                return Math.min(100, Math.round((currentUser.totalQuizzesTaken / goal.target) * 100));
            case 'score_target':
                return Math.min(100, Math.round((currentUser.averageScore / goal.target) * 100));
            case 'streak_target':
                return Math.min(100, Math.round((currentUser.studyStreak / goal.target) * 100));
            case 'course_mastery':
                if (goal.course && currentUser.courseProgress[`${goal.course}_1`]) {
                    const courseScores = [
                        ...(currentUser.courseProgress[`${goal.course}_1`] || []),
                        ...(currentUser.courseProgress[`${goal.course}_2`] || [])
                    ];
                    const avgScore = courseScores.reduce((sum, score) => sum + score, 0) / courseScores.length;
                    return Math.min(100, Math.round((avgScore / goal.target) * 100));
                }
                return 0;
            default:
                return goal.progress || 0;
        }
    }

    function getPriorityIcon(priority) {
        const icons = {
            'low': '🟢',
            'medium': '🟡',
            'high': '🔴'
        };
        return icons[priority] || '🟡';
    }

    function formatGoalType(type) {
        const types = {
            'quiz_count': 'Quiz Count',
            'score_target': 'Score Target',
            'streak_target': 'Study Streak',
            'course_mastery': 'Course Mastery',
            'time_based': 'Time Based',
            'custom': 'Custom'
        };
        return types[type] || 'Custom';
    }

    function displayReminders() {
        if (currentUser.studyReminders.length === 0) {
            remindersContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⏰</div>
                    <h3>No Study Reminders</h3>
                    <p>Create reminders to stay consistent with your study schedule!</p>
                </div>
            `;
            return;
        }

        remindersContainer.innerHTML = '';
        currentUser.studyReminders.forEach(reminder => {
            const reminderEl = document.createElement('div');
            reminderEl.className = `reminder-card ${reminder.active ? 'active' : 'inactive'}`;
            reminderEl.innerHTML = `
                <div class="reminder-header">
                    <h4>${reminder.title}</h4>
                    <div class="reminder-actions">
                        <button onclick="toggleReminder('${reminder.id}')" class="icon-btn">
                            ${reminder.active ? '🔕' : '🔔'}
                        </button>
                        <button onclick="deleteReminder('${reminder.id}')" class="icon-btn danger">🗑️</button>
                    </div>
                </div>
                <div class="reminder-content">
                    <div class="reminder-time">⏰ ${formatTime(reminder.time)}</div>
                    <div class="reminder-days">
                        ${reminder.days.map(day => `<span class="day-badge">${day.substring(0, 3)}</span>`).join('')}
                    </div>
                    <div class="reminder-message">${reminder.message}</div>
                </div>
                <div class="reminder-status">
                    ${reminder.active ? '🟢 Active' : '🔴 Inactive'}
                </div>
            `;
            remindersContainer.appendChild(reminderEl);
        });
    }

    function updateProgressStats() {
        const activeGoals = currentUser.studyGoals.filter(goal => !goal.completed).length;
        const completedGoals = currentUser.studyGoals.filter(goal => goal.completed).length;
        const totalGoals = currentUser.studyGoals.length;
        const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

        document.getElementById('active-goals').textContent = activeGoals;
        document.getElementById('completed-goals').textContent = completedGoals;
        document.getElementById('completion-rate').textContent = `${completionRate}%`;
        document.getElementById('goal-streak').textContent = currentUser.goalStats.goalStreak;
    }

    function checkReminders() {
        if (!('Notification' in window)) return;

        // Request notification permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        scheduleNotifications();
    }

    function scheduleNotifications() {
        if (Notification.permission !== 'granted') return;

        currentUser.studyReminders.forEach(reminder => {
            if (!reminder.active) return;

            const now = new Date();
            const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
            
            if (reminder.days.includes(currentDay)) {
                const [hours, minutes] = reminder.time.split(':');
                const reminderTime = new Date();
                reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                const timeUntilReminder = reminderTime.getTime() - now.getTime();
                
                if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
                    setTimeout(() => {
                        new Notification('📚 Study Reminder', {
                            body: reminder.message,
                            icon: 'ELD.png'
                        });
                    }, timeUntilReminder);
                }
            }
        });
    }

    function formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${ampm}`;
    }

    // Global functions for onclick handlers
    window.markGoalComplete = function(goalId) {
        const goal = currentUser.studyGoals.find(g => g.id == goalId);
        if (!goal) return;

        goal.completed = true;
        goal.completedAt = new Date().toISOString();
        goal.progress = 100;
        
        currentUser.goalStats.completedGoals++;
        currentUser.goalStats.goalStreak++;
        currentUser.goalStats.lastGoalCompleted = new Date().toISOString();

        saveUserData();
        displayGoals();
        updateProgressStats();
        
        showNotification('🎉 Congratulations! Goal completed!');
        
        // Add celebration animation
        celebrateGoalCompletion();
    };

    window.deleteGoal = function(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            currentUser.studyGoals = currentUser.studyGoals.filter(g => g.id != goalId);
            saveUserData();
            displayGoals();
            updateProgressStats();
            showNotification('🗑️ Goal deleted successfully!');
        }
    };

    window.toggleReminder = function(reminderId) {
        const reminder = currentUser.studyReminders.find(r => r.id == reminderId);
        if (!reminder) return;

        reminder.active = !reminder.active;
        saveUserData();
        displayReminders();
        
        const status = reminder.active ? 'activated' : 'deactivated';
        showNotification(`🔔 Reminder ${status}!`);
        
        if (reminder.active) {
            scheduleNotifications();
        }
    };

    window.deleteReminder = function(reminderId) {
        if (confirm('Are you sure you want to delete this reminder?')) {
            currentUser.studyReminders = currentUser.studyReminders.filter(r => r.id != reminderId);
            saveUserData();
            displayReminders();
            showNotification('🗑️ Reminder deleted successfully!');
        }
    };

    function clearCompletedGoals() {
        if (confirm('Are you sure you want to clear all completed goals?')) {
            currentUser.studyGoals = currentUser.studyGoals.filter(goal => !goal.completed);
            saveUserData();
            displayGoals();
            updateProgressStats();
            showNotification('🗑️ Completed goals cleared!');
        }
    }

    function celebrateGoalCompletion() {
        // Create celebration animation
        const celebration = document.createElement('div');
        celebration.className = 'celebration-animation';
        celebration.innerHTML = '🎉🎊✨🏆✨🎊🎉';
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    function saveUserData() {
        const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
        userData.users[currentUser.id] = currentUser;
        localStorage.setItem('eldersUserData', JSON.stringify(userData));
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});