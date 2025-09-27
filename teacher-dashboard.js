document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('teacher-dashboard-page')) return;

    // Teacher authentication check
    const teacherAuth = localStorage.getItem('teacherAuth');
    if (!teacherAuth) {
        window.location.href = 'teacher-login.html';
        return;
    }

    // Initialize dashboard
    initializeTeacherDashboard();

    function initializeTeacherDashboard() {
        loadStudentData();
        setupEventListeners();
        updateOverviewStats();
        createCoursePerformanceChart();
        createPerformanceTrendsChart();
        loadRecentActivity();
        loadProblemAreas();
    }

    function loadStudentData() {
        const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
        const students = Object.values(userData.users || {});
        
        displayStudentsTable(students);
        return students;
    }

    function updateOverviewStats() {
        const students = loadStudentData();
        const today = new Date().toDateString();
        
        // Calculate stats
        const totalStudents = students.length;
        const totalQuizzes = students.reduce((sum, student) => sum + (student.totalQuizzesTaken || 0), 0);
        const averageScore = students.length > 0 ? 
            Math.round(students.reduce((sum, student) => sum + (student.averageScore || 0), 0) / students.length) : 0;
        const activeToday = students.filter(student => {
            const lastVisit = student.lastVisit ? new Date(student.lastVisit).toDateString() : null;
            return lastVisit === today;
        }).length;

        // Update DOM
        document.getElementById('total-students').textContent = totalStudents;
        document.getElementById('total-quizzes-taken').textContent = totalQuizzes;
        document.getElementById('average-class-score').textContent = `${averageScore}%`;
        document.getElementById('active-students-today').textContent = activeToday;
    }

    function displayStudentsTable(students) {
        const tbody = document.getElementById('students-table-body');
        tbody.innerHTML = '';

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No students found</td></tr>';
            return;
        }

        students.forEach(student => {
            const row = document.createElement('tr');
            const lastActivity = student.lastVisit ? 
                new Date(student.lastVisit).toLocaleDateString() : 'Never';
            
            row.innerHTML = `
                <td class="student-name">
                    <div class="student-info">
                        <strong>${student.name}</strong>
                        <small>Level ${student.level || 1}</small>
                    </div>
                </td>
                <td>${student.department || 'N/A'}</td>
                <td>${student.totalQuizzesTaken || 0}</td>
                <td class="score-cell">
                    <span class="score-badge ${getScoreClass(student.averageScore)}">
                        ${student.averageScore || 0}%
                    </span>
                </td>
                <td>
                    <span class="streak-badge">
                        🔥 ${student.studyStreak || 0}
                    </span>
                </td>
                <td>${lastActivity}</td>
                <td>
                    <button onclick="viewStudentDetails('${student.id}')" class="action-btn">
                        👁️ View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function getScoreClass(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'average';
        return 'needs-improvement';
    }

    function createCoursePerformanceChart() {
        const ctx = document.getElementById('course-performance-chart').getContext('2d');
        const students = loadStudentData();
        
        // Aggregate course performance data
        const courseData = {};
        students.forEach(student => {
            if (student.courseProgress) {
                Object.keys(student.courseProgress).forEach(courseKey => {
                    const [courseCode] = courseKey.split('_');
                    if (!courseData[courseCode]) {
                        courseData[courseCode] = { scores: [], count: 0 };
                    }
                    const scores = student.courseProgress[courseKey];
                    courseData[courseCode].scores.push(...scores);
                    courseData[courseCode].count++;
                });
            }
        });

        const labels = Object.keys(courseData);
        const averages = labels.map(course => {
            const scores = courseData[course].scores;
            return scores.length > 0 ? 
                Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Score (%)',
                    data: averages,
                    backgroundColor: 'rgba(81, 15, 100, 0.8)',
                    borderColor: '#510F64',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                }
            }
        });
    }

    function createPerformanceTrendsChart() {
        const ctx = document.getElementById('performance-trends-chart').getContext('2d');
        const students = loadStudentData();
        
        // Get last 30 days of quiz data
        const last30Days = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last30Days.push(date.toDateString());
        }

        const dailyAverages = last30Days.map(dateStr => {
            const dayQuizzes = [];
            students.forEach(student => {
                if (student.quizHistory) {
                    student.quizHistory.forEach(quiz => {
                        const quizDate = new Date(quiz.date).toDateString();
                        if (quizDate === dateStr) {
                            dayQuizzes.push(quiz.percentage);
                        }
                    });
                }
            });
            return dayQuizzes.length > 0 ? 
                Math.round(dayQuizzes.reduce((sum, score) => sum + score, 0) / dayQuizzes.length) : null;
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: 'Daily Class Average (%)',
                    data: dailyAverages,
                    borderColor: '#510F64',
                    backgroundColor: 'rgba(81, 15, 100, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    spanGaps: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                }
            }
        });
    }

    function loadRecentActivity() {
        const container = document.getElementById('recent-activity-teacher');
        const students = loadStudentData();
        
        // Collect all recent quiz activities
        const allActivities = [];
        students.forEach(student => {
            if (student.quizHistory) {
                student.quizHistory.slice(-5).forEach(quiz => {
                    allActivities.push({
                        ...quiz,
                        studentName: student.name,
                        studentDepartment: student.department
                    });
                });
            }
        });

        // Sort by date (most recent first)
        allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display top 10 activities
        const recentActivities = allActivities.slice(0, 10);
        
        if (recentActivities.length === 0) {
            container.innerHTML = '<p class="no-data">No recent activity</p>';
            return;
        }

        container.innerHTML = '';
        recentActivities.forEach(activity => {
            const activityEl = document.createElement('div');
            activityEl.className = 'activity-item';
            activityEl.innerHTML = `
                <div class="activity-icon">${activity.percentage >= 80 ? '🏆' : '📝'}</div>
                <div class="activity-content">
                    <div class="activity-header">
                        <strong>${activity.studentName}</strong>
                        <span class="activity-course">${activity.courseCode}</span>
                    </div>
                    <div class="activity-details">
                        Scored ${activity.score}/${activity.totalQuestions} (${activity.percentage}%) 
                        in Segment ${activity.segmentNumber}
                    </div>
                    <div class="activity-time">${getTimeAgo(new Date(activity.date))}</div>
                </div>
                <div class="activity-score ${getScoreClass(activity.percentage)}">
                    ${activity.percentage}%
                </div>
            `;
            container.appendChild(activityEl);
        });
    }

    function loadProblemAreas() {
        const container = document.getElementById('problem-areas-container');
        const students = loadStudentData();
        
        // Aggregate weak areas across all students
        const problemAreas = {};
        students.forEach(student => {
            if (student.weakAreas) {
                Object.keys(student.weakAreas).forEach(courseCode => {
                    Object.values(student.weakAreas[courseCode]).forEach(weakArea => {
                        const key = `${courseCode}: ${weakArea.question.substring(0, 100)}...`;
                        if (!problemAreas[key]) {
                            problemAreas[key] = {
                                question: weakArea.question,
                                courseCode: courseCode,
                                correctAnswer: weakArea.correctAnswer,
                                totalWrongCount: 0,
                                affectedStudents: 0
                            };
                        }
                        problemAreas[key].totalWrongCount += weakArea.wrongCount;
                        problemAreas[key].affectedStudents++;
                    });
                });
            }
        });

        // Sort by most problematic (highest wrong count and affected students)
        const sortedProblems = Object.values(problemAreas)
            .sort((a, b) => (b.totalWrongCount + b.affectedStudents) - (a.totalWrongCount + a.affectedStudents))
            .slice(0, 10);

        if (sortedProblems.length === 0) {
            container.innerHTML = '<p class="no-data">No common problem areas identified</p>';
            return;
        }

        container.innerHTML = '';
        sortedProblems.forEach(problem => {
            const problemEl = document.createElement('div');
            problemEl.className = 'problem-area-card';
            problemEl.innerHTML = `
                <div class="problem-header">
                    <span class="course-badge">${problem.courseCode}</span>
                    <span class="problem-stats">
                        ${problem.affectedStudents} student${problem.affectedStudents > 1 ? 's' : ''} • 
                        ${problem.totalWrongCount} wrong answer${problem.totalWrongCount > 1 ? 's' : ''}
                    </span>
                </div>
                <div class="problem-content">
                    <div class="problem-question">${problem.question}</div>
                    <div class="problem-answer">
                        <strong>Correct Answer:</strong> ${problem.correctAnswer}
                    </div>
                </div>
            `;
            container.appendChild(problemEl);
        });
    }

    function setupEventListeners() {
        // Search functionality
        document.getElementById('student-search').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const students = loadStudentData();
            const filteredStudents = students.filter(student => 
                student.name.toLowerCase().includes(searchTerm) ||
                (student.department && student.department.toLowerCase().includes(searchTerm))
            );
            displayStudentsTable(filteredStudents);
        });

        // Sort functionality
        document.getElementById('sort-students').addEventListener('change', function() {
            const sortBy = this.value;
            const students = loadStudentData();
            
            students.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'score':
                        return (b.averageScore || 0) - (a.averageScore || 0);
                    case 'activity':
                        return new Date(b.lastVisit || 0) - new Date(a.lastVisit || 0);
                    case 'quizzes':
                        return (b.totalQuizzesTaken || 0) - (a.totalQuizzesTaken || 0);
                    default:
                        return 0;
                }
            });
            
            displayStudentsTable(students);
        });

        // Export data functionality
        document.getElementById('export-data-btn').addEventListener('click', exportStudentData);

        // Filter functionality
        document.getElementById('department-filter').addEventListener('change', function() {
            const department = this.value;
            const students = loadStudentData();
            const filteredStudents = department === 'all' ? 
                students : 
                students.filter(student => student.department === department);
            displayStudentsTable(filteredStudents);
        });

        // Modal functionality
        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('student-detail-modal').style.display = 'none';
        });

        // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                
                // Update active tab
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(`tab-${tabName}`).classList.add('active');
            });
        });

        // Logout functionality
        document.getElementById('logout-teacher-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('teacherAuth');
                window.location.href = 'teacher-login.html';
            }
        });
    }

    function exportStudentData() {
        const students = loadStudentData();
        const csvData = [
            ['Name', 'Department', 'Total Quizzes', 'Average Score', 'Study Streak', 'Level', 'Total XP', 'Last Visit']
        ];

        students.forEach(student => {
            csvData.push([
                student.name,
                student.department || 'N/A',
                student.totalQuizzesTaken || 0,
                student.averageScore || 0,
                student.studyStreak || 0,
                student.level || 1,
                student.totalXP || 0,
                student.lastVisit ? new Date(student.lastVisit).toLocaleDateString() : 'Never'
            ]);
        });

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student_data_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Global function for viewing student details
    window.viewStudentDetails = function(studentId) {
        const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
        const student = userData.users[studentId];
        
        if (!student) return;

        // Update modal title
        document.getElementById('student-detail-name').textContent = `${student.name} - Detailed View`;
        
        // Update overview tab
        const overviewTab = document.getElementById('tab-overview');
        overviewTab.innerHTML = `
            <div class="student-detail-stats">
                <div class="detail-stat-card">
                    <div class="detail-stat-icon">🎯</div>
                    <div class="detail-stat-content">
                        <div class="detail-stat-number">${student.totalQuizzesTaken || 0}</div>
                        <div class="detail-stat-label">Total Quizzes</div>
                    </div>
                </div>
                <div class="detail-stat-card">
                    <div class="detail-stat-icon">📈</div>
                    <div class="detail-stat-content">
                        <div class="detail-stat-number">${student.averageScore || 0}%</div>
                        <div class="detail-stat-label">Average Score</div>
                    </div>
                </div>
                <div class="detail-stat-card">
                    <div class="detail-stat-icon">🔥</div>
                    <div class="detail-stat-content">
                        <div class="detail-stat-number">${student.studyStreak || 0}</div>
                        <div class="detail-stat-label">Study Streak</div>
                    </div>
                </div>
                <div class="detail-stat-card">
                    <div class="detail-stat-icon">⭐</div>
                    <div class="detail-stat-content">
                        <div class="detail-stat-number">${student.level || 1}</div>
                        <div class="detail-stat-label">Level</div>
                    </div>
                </div>
            </div>
            <div class="student-info-details">
                <p><strong>Department:</strong> ${student.department || 'N/A'}</p>
                <p><strong>Join Date:</strong> ${new Date(student.joinDate).toLocaleDateString()}</p>
                <p><strong>Last Visit:</strong> ${student.lastVisit ? new Date(student.lastVisit).toLocaleDateString() : 'Never'}</p>
                <p><strong>Total XP:</strong> ${student.totalXP || 0}</p>
                <p><strong>Perfect Scores:</strong> ${student.perfectScores || 0}</p>
            </div>
        `;

        // Show modal
        document.getElementById('student-detail-modal').style.display = 'flex';
    };

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