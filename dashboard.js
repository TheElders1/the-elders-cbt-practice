document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard only if we're on the dashboard page
    if (!document.getElementById('dashboard-page')) return;

    // Get user data manager from main.js
    const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
    const currentUser = userData.currentUser ? userData.users[userData.currentUser] : null;

    if (!currentUser) {
        // Redirect to home if no user data
        window.location.href = 'index.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard(currentUser);

    function initializeDashboard(user) {
        // Update welcome message
        document.getElementById('user-welcome').textContent = `Welcome back, ${user.name}!`;

        // Update stats
        document.getElementById('total-quizzes').textContent = user.totalQuizzesTaken;
        document.getElementById('average-score').textContent = `${user.averageScore}%`;
        document.getElementById('perfect-scores').textContent = user.perfectScores;
        document.getElementById('study-streak').textContent = user.studyStreak;
        document.getElementById('user-level').textContent = user.level;
        document.getElementById('total-xp').textContent = user.totalXP;

        // Create performance chart
        createPerformanceChart(user.quizHistory);

        // Display achievements
        displayAchievements(user.achievements);

        // Display weak areas
        displayWeakAreas(user.weakAreas);

        // Display course progress
        displayCourseProgress(user.courseProgress);

        // Display recent activity
        displayRecentActivity(user.quizHistory.slice(-10));

        // Setup reset data button
        setupResetDataButton();
    }

    function createPerformanceChart(quizHistory) {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        
        // Prepare data for the last 20 quizzes
        const recentQuizzes = quizHistory.slice(-20);
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

    function displayAchievements(userAchievements) {
        const container = document.getElementById('achievements-container');
        
        const allAchievements = [
            { id: 'first_quiz', name: 'Getting Started', description: 'Complete your first quiz', icon: '🎯' },
            { id: 'perfect_score', name: 'Perfect Score', description: 'Score 100% on a quiz', icon: '💯' },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a quiz in under 15 minutes', icon: '⚡' },
            { id: 'streak_3', name: '3-Day Streak', description: 'Study for 3 consecutive days', icon: '🔥' },
            { id: 'streak_7', name: 'Week Warrior', description: 'Study for 7 consecutive days', icon: '📅' },
            { id: 'streak_30', name: 'Monthly Master', description: 'Study for 30 consecutive days', icon: '🗓️' },
            { id: 'quiz_master_10', name: 'Quiz Master', description: 'Complete 10 quizzes', icon: '🎓' },
            { id: 'quiz_master_50', name: 'Quiz Legend', description: 'Complete 50 quizzes', icon: '👑' },
            { id: 'perfectionist', name: 'Perfectionist', description: 'Score 100% on 5 quizzes', icon: '🏆' },
            { id: 'level_5', name: 'Level 5 Achiever', description: 'Reach Level 5', icon: '⭐' },
            { id: 'level_10', name: 'Level 10 Master', description: 'Reach Level 10', icon: '🌟' }
        ];

        container.innerHTML = '';
        
        allAchievements.forEach(achievement => {
            const isUnlocked = userAchievements.includes(achievement.id);
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            achievementEl.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-content">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
                ${isUnlocked ? '<div class="achievement-status">✓</div>' : '<div class="achievement-status">🔒</div>'}
            `;
            container.appendChild(achievementEl);
        });
    }

    function displayWeakAreas(weakAreas) {
        const container = document.getElementById('weak-areas-container');
        container.innerHTML = '';

        const allWeakQuestions = [];
        Object.keys(weakAreas).forEach(courseCode => {
            Object.values(weakAreas[courseCode]).forEach(weakQuestion => {
                allWeakQuestions.push({
                    ...weakQuestion,
                    courseCode
                });
            });
        });

        if (allWeakQuestions.length === 0) {
            container.innerHTML = '<p class="no-data">🎉 Great job! No weak areas identified yet.</p>';
            return;
        }

        // Sort by wrong count and show top 10
        allWeakQuestions.sort((a, b) => b.wrongCount - a.wrongCount);
        const topWeakQuestions = allWeakQuestions.slice(0, 10);

        topWeakQuestions.forEach(weakQuestion => {
            const weakAreaEl = document.createElement('div');
            weakAreaEl.className = 'weak-area-card';
            const truncatedQuestion = weakQuestion.question.length > 100 ? 
                weakQuestion.question.substring(0, 100) + '...' : 
                weakQuestion.question;
            weakAreaEl.innerHTML = `
                <div class="weak-area-header">
                    <span class="course-badge">${weakQuestion.courseCode}</span>
                    <span class="wrong-count">❌ ${weakQuestion.wrongCount} time${weakQuestion.wrongCount > 1 ? 's' : ''}</span>
                </div>
                <div class="weak-area-content">
                    <p class="weak-question" title="${weakQuestion.question}">${truncatedQuestion}</p>
                    <p class="correct-answer"><strong>Correct Answer:</strong> ${weakQuestion.correctAnswer}</p>
                </div>
            `;
            container.appendChild(weakAreaEl);
        });
    }

    function displayCourseProgress(courseProgress) {
        const container = document.getElementById('course-progress-container');
        container.innerHTML = '';

        if (Object.keys(courseProgress).length === 0) {
            container.innerHTML = '<p class="no-data">📚 Start taking quizzes to see your course progress!</p>';
            return;
        }

        Object.keys(courseProgress).forEach(courseKey => {
            const scores = courseProgress[courseKey];
            const [courseCode, segmentNumber] = courseKey.split('_');
            const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
            const bestScore = Math.max(...scores);
            const trend = calculateTrend(scores);

            const progressEl = document.createElement('div');
            progressEl.className = 'course-progress-card';
            progressEl.innerHTML = `
                <div class="course-progress-header">
                    <h4>${courseCode} - Segment ${segmentNumber}</h4>
                    <span class="trend-indicator ${trend}">${getTrendIcon(trend)}</span>
                </div>
                <div class="course-progress-stats">
                    <div class="progress-stat">
                        <span class="stat-label">Attempts</span>
                        <span class="stat-value">${scores.length}</span>
                    </div>
                    <div class="progress-stat">
                        <span class="stat-label">Average</span>
                        <span class="stat-value">${averageScore}%</span>
                    </div>
                    <div class="progress-stat">
                        <span class="stat-label">Best</span>
                        <span class="stat-value">${bestScore}%</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${averageScore}%"></div>
                </div>
            `;
            container.appendChild(progressEl);
        });
    }

    function displayRecentActivity(recentQuizzes) {
        const container = document.getElementById('recent-activity-container');
        container.innerHTML = '';

        if (recentQuizzes.length === 0) {
            container.innerHTML = '<p class="no-data">📋 No recent activity to display.</p>';
            return;
        }

        recentQuizzes.reverse().forEach(quiz => {
            const date = new Date(quiz.date);
            const timeAgo = getTimeAgo(date);
            const timeSpentMinutes = Math.round(quiz.timeSpent / 60);
            
            const activityEl = document.createElement('div');
            activityEl.className = 'activity-card';
            activityEl.innerHTML = `
                <div class="activity-icon">${quiz.percentage === 100 ? '🏆' : quiz.percentage >= 80 ? '🎯' : '📝'}</div>
                <div class="activity-content">
                    <h4>${quiz.courseCode} - Segment ${quiz.segmentNumber}</h4>
                    <p>Scored ${quiz.score}/${quiz.totalQuestions} (${quiz.percentage}%) • ${timeSpentMinutes} min</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
                <div class="activity-score ${quiz.percentage >= 80 ? 'good-score' : quiz.percentage >= 50 ? 'ok-score' : 'poor-score'}">
                    ${quiz.percentage}%
                </div>
            `;
            container.appendChild(activityEl);
        });
    }

    function calculateTrend(scores) {
        if (scores.length < 2) return 'stable';
        const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        const secondHalf = scores.slice(Math.floor(scores.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 5) return 'improving';
        if (secondAvg < firstAvg - 5) return 'declining';
        return 'stable';
    }

    function getTrendIcon(trend) {
        switch (trend) {
            case 'improving': return '📈';
            case 'declining': return '📉';
            default: return '➡️';
        }
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

    function setupResetDataButton() {
        document.getElementById('reset-data-btn').addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'reset-modal';
            modal.innerHTML = `
                <div class="reset-modal-content">
                    <h3>⚠️ Reset All Data</h3>
                    <p>This will permanently delete:</p>
                    <ul>
                        <li>All quiz history and scores</li>
                        <li>Achievements and progress</li>
                        <li>Performance analytics</li>
                        <li>User preferences</li>
                    </ul>
                    <p><strong>This action cannot be undone!</strong></p>
                    <div class="reset-modal-actions">
                        <button class="nav-btn danger-btn" onclick="confirmReset()">Yes, Reset Everything</button>
                        <button class="segment-btn" onclick="closeResetModal()">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            window.confirmReset = () => {
                localStorage.removeItem('eldersUserData');
                alert('✅ All data has been reset successfully!');
                window.location.href = 'index.html';
            };
            
            window.closeResetModal = () => {
                modal.remove();
                delete window.confirmReset;
                delete window.closeResetModal;
            };
        });
    }
});

// Add CSS for reset modal
const resetModalCSS = `
.reset-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.reset-modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    animation: slideInUp 0.3s ease;
}

.reset-modal-content h3 {
    color: #dc3545;
    margin-bottom: 15px;
}

.reset-modal-content ul {
    text-align: left;
    margin: 15px 0;
    padding-left: 20px;
}

.reset-modal-content li {
    margin-bottom: 5px;
}

.reset-modal-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
}

.dark-mode .reset-modal-content {
    background: #2d2d2d;
    color: #e0e0e0;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject the CSS
if (!document.getElementById('reset-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'reset-modal-styles';
    style.textContent = resetModalCSS;
    document.head.appendChild(style);
}
                }
            }
        });
    }
});