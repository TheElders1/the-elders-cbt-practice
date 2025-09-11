document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 0. USER DATA MANAGEMENT & PERFORMANCE TRACKING
    // =========================================================================
    
    class UserDataManager {
        constructor() {
            this.userData = this.loadUserData();
        }

        loadUserData() {
            const data = localStorage.getItem('eldersUserData');
            if (data) {
                return JSON.parse(data);
            }
            return {
                users: {},
                currentUser: null
            };
        }

        saveUserData() {
            localStorage.setItem('eldersUserData', JSON.stringify(this.userData));
        }

        createOrGetUser(name) {
            const userId = name.toLowerCase().replace(/\s+/g, '_');
            if (!this.userData.users[userId]) {
                this.userData.users[userId] = {
                    id: userId,
                    name: name,
                    department: null, // Will be set during login
                    joinDate: new Date().toISOString(),
                    lastVisit: new Date().toISOString(),
                    totalXP: 0,
                    level: 1,
                    studyStreak: 0,
                    longestStreak: 0,
                    lastStudyDate: null,
                    achievements: [],
                    quizHistory: [],
                    weakAreas: {},
                    courseProgress: {},
                    totalQuizzesTaken: 0,
                    perfectScores: 0,
                    averageScore: 0
                };
                console.log('Created new user:', this.userData.users[userId]);
            } else {
                // Update last visit
                this.userData.users[userId].lastVisit = new Date().toISOString();
                this.updateStudyStreak(userId);
                console.log('Updated existing user:', this.userData.users[userId]);
            }
            this.userData.currentUser = userId;
            this.saveUserData();
            return this.userData.users[userId];
        }

        getCurrentUser() {
            if (this.userData.currentUser) {
                return this.userData.users[this.userData.currentUser];
            }
            return null;
        }

        updateStudyStreak(userId) {
            const user = this.userData.users[userId];
            const today = new Date().toDateString();
            const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate).toDateString() : null;
            
            if (lastStudy === today) {
                // Already studied today
                return;
            }
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            if (lastStudy === yesterdayStr) {
                // Continuing streak
                user.studyStreak += 1;
            } else if (lastStudy !== today) {
                // Streak broken or first time
                user.studyStreak = 1;
            }
            
            user.longestStreak = Math.max(user.longestStreak, user.studyStreak);
            user.lastStudyDate = new Date().toISOString();
        }

        recordQuizResult(courseCode, segmentNumber, score, totalQuestions, timeSpent, markedQuestions, wrongAnswers) {
            const user = this.getCurrentUser();
            if (!user) return;

            const quizResult = {
                id: Date.now(),
                date: new Date().toISOString(),
                courseCode,
                segmentNumber,
                score,
                totalQuestions,
                percentage: Math.round((score / totalQuestions) * 100),
                timeSpent,
                markedQuestions: markedQuestions.length,
                wrongAnswers
            };

            user.quizHistory.push(quizResult);
            user.totalQuizzesTaken += 1;
            
            // Update XP and level
            const xpGained = this.calculateXP(score, totalQuestions, timeSpent);
            user.totalXP += xpGained;
            user.level = Math.floor(user.totalXP / 1000) + 1;

            // Update perfect scores
            if (score === totalQuestions) {
                user.perfectScores += 1;
            }

            // Update average score
            const totalScore = user.quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0);
            user.averageScore = Math.round(totalScore / user.quizHistory.length);

            // Update course progress
            const courseKey = `${courseCode}_${segmentNumber}`;
            if (!user.courseProgress[courseKey]) {
                user.courseProgress[courseKey] = [];
            }
            user.courseProgress[courseKey].push(quizResult.percentage);

            // Update weak areas
            this.updateWeakAreas(user, courseCode, wrongAnswers);

            // Check for achievements
            this.checkAchievements(user, quizResult);

            this.saveUserData();
            return { xpGained, newAchievements: this.getNewAchievements(user) };
        }

        calculateXP(score, totalQuestions, timeSpent) {
            const baseXP = score * 10;
            const perfectBonus = score === totalQuestions ? 100 : 0;
            const speedBonus = timeSpent < 900 ? 50 : 0; // Bonus for completing in under 15 minutes
            return baseXP + perfectBonus + speedBonus;
        }

        updateWeakAreas(user, courseCode, wrongAnswers) {
            if (!user.weakAreas[courseCode]) {
                user.weakAreas[courseCode] = {};
            }
            
            wrongAnswers.forEach(qa => {
                const questionHash = this.hashQuestion(qa.question);
                if (!user.weakAreas[courseCode][questionHash]) {
                    user.weakAreas[courseCode][questionHash] = {
                        question: qa.question,
                        correctAnswer: qa.correctAnswer,
                        wrongCount: 0,
                        lastWrong: null
                    };
                }
                user.weakAreas[courseCode][questionHash].wrongCount += 1;
                user.weakAreas[courseCode][questionHash].lastWrong = new Date().toISOString();
            });
        }

        hashQuestion(question) {
            // Simple hash function for question identification
            let hash = 0;
            for (let i = 0; i < question.length; i++) {
                const char = question.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return hash.toString();
        }

        checkAchievements(user, quizResult) {
            const achievements = [
                { id: 'first_quiz', name: 'Getting Started', description: 'Complete your first quiz', condition: () => user.totalQuizzesTaken === 1 },
                { id: 'perfect_score', name: 'Perfect Score', description: 'Score 100% on a quiz', condition: () => quizResult.percentage === 100 },
                { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a quiz in under 15 minutes', condition: () => quizResult.timeSpent < 900 },
                { id: 'streak_3', name: '3-Day Streak', description: 'Study for 3 consecutive days', condition: () => user.studyStreak >= 3 },
                { id: 'streak_7', name: 'Week Warrior', description: 'Study for 7 consecutive days', condition: () => user.studyStreak >= 7 },
                { id: 'streak_30', name: 'Monthly Master', description: 'Study for 30 consecutive days', condition: () => user.studyStreak >= 30 },
                { id: 'quiz_master_10', name: 'Quiz Master', description: 'Complete 10 quizzes', condition: () => user.totalQuizzesTaken >= 10 },
                { id: 'quiz_master_50', name: 'Quiz Legend', description: 'Complete 50 quizzes', condition: () => user.totalQuizzesTaken >= 50 },
                { id: 'perfectionist', name: 'Perfectionist', description: 'Score 100% on 5 quizzes', condition: () => user.perfectScores >= 5 },
                { id: 'level_5', name: 'Level 5 Achiever', description: 'Reach Level 5', condition: () => user.level >= 5 },
                { id: 'level_10', name: 'Level 10 Master', description: 'Reach Level 10', condition: () => user.level >= 10 }
            ];

            achievements.forEach(achievement => {
                if (!user.achievements.includes(achievement.id) && achievement.condition()) {
                    user.achievements.push(achievement.id);
                }
            });
        }

        getNewAchievements(user) {
            // This would be called to get achievements earned in the last session
            // For now, return empty array - could be enhanced to track new achievements
            return [];
        }

        getWeakQuestions(courseCode, limit = 10) {
            const user = this.getCurrentUser();
            if (!user || !user.weakAreas[courseCode]) return [];

            return Object.values(user.weakAreas[courseCode])
                .sort((a, b) => b.wrongCount - a.wrongCount)
                .slice(0, limit);
        }

        getPerformanceData(courseCode = null) {
            const user = this.getCurrentUser();
            if (!user) return null;

            let quizzes = user.quizHistory;
            if (courseCode) {
                quizzes = quizzes.filter(quiz => quiz.courseCode === courseCode);
            }

            return {
                user,
                quizzes,
                totalQuizzes: quizzes.length,
                averageScore: quizzes.length > 0 ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizzes.length) : 0,
                bestScore: quizzes.length > 0 ? Math.max(...quizzes.map(quiz => quiz.percentage)) : 0,
                recentTrend: this.calculateTrend(quizzes.slice(-5))
            };
        }

        calculateTrend(recentQuizzes) {
            if (recentQuizzes.length < 2) return 'stable';
            const firstHalf = recentQuizzes.slice(0, Math.floor(recentQuizzes.length / 2));
            const secondHalf = recentQuizzes.slice(Math.floor(recentQuizzes.length / 2));
            
            const firstAvg = firstHalf.reduce((sum, quiz) => sum + quiz.percentage, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, quiz) => sum + quiz.percentage, 0) / secondHalf.length;
            
            if (secondAvg > firstAvg + 5) return 'improving';
            if (secondAvg < firstAvg - 5) return 'declining';
            return 'stable';
        }
    }

    // Initialize User Data Manager
    const userDataManager = new UserDataManager();

    // =========================================================================
    // 1. UNIVERSAL LOGIC (Runs on every page)
    // =========================================================================
    
    // --- Theme Toggler ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const applyTheme = () => {
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggleBtn.innerHTML = '☀️';
            } else {
                document.body.classList.remove('dark-mode');
                themeToggleBtn.innerHTML = '🌙';
            }
        };
        themeToggleBtn.addEventListener('click', () => {
            let newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme();
        });
        applyTheme();
    }

    // --- Secure Notification Helper ---
    async function sendNotification(message) {
        if (!navigator.onLine) { return; }
        try {
            fetch('/.netlify/functions/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
        } catch (error) {
            console.error("Failed to send notification request:", error);
        }
    }

    // =========================================================================
    // 2. LOGIN PAGE LOGIC (index.html)
    // =========================================================================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log('Login page loaded');
        
        // Check if user is already logged in
        const currentUser = userDataManager.getCurrentUser();
        
        if (currentUser) {
            // Redirect to home if already logged in
            window.location.href = 'home.html';
            return;
        }

        const nameInput = document.getElementById('name-input');
        const departmentSelect = document.getElementById('department-select');
        
        const showFormFeedback = (fieldId, message, type = 'error') => {
            const feedbackEl = document.getElementById(`${fieldId}-feedback`);
            if (feedbackEl) {
                feedbackEl.textContent = message;
                feedbackEl.className = `form-feedback ${type}`;
            }
        };

        const validateForm = () => {
            let isValid = true;
            if (nameInput.value.trim().length < 6) {
                showFormFeedback('name', 'Name must be at least 6 characters.');
                isValid = false;
            } else { showFormFeedback('name', '✓ Looks good!', 'success'); }

            if (!departmentSelect.value) {
                showFormFeedback('department', 'Please select a department.');
                isValid = false;
            } else { showFormFeedback('department', '', 'success'); }
            
            return isValid;
        };
        
        departmentSelect.addEventListener('change', function() {
            showFormFeedback('department', '✓ Department selected', 'success');
        });

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!validateForm()) return;
            
            const name = nameInput.value.trim();
            const department = departmentSelect.value;
            
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true; 
            submitButton.innerHTML = '<span class="btn-text">Logging in...</span><span class="btn-icon">⏳</span>';

            const notificationMessage = `🔔 User Login 🔔\n\nName: ${name}\nDept: ${department}`;
            sendNotification(notificationMessage);

            // Create or update user data
            const user = userDataManager.createOrGetUser(name);
            user.department = department; // Store department with user
            userDataManager.saveUserData();
            
            // Small delay to ensure data is saved before redirect
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 100);
        });
    }

    // =========================================================================
    // 3. QUIZ PAGE LOGIC (quiz.html)
    // =========================================================================
    const quizHost = document.getElementById('quiz-host');
    if (quizHost) {
        // --- DOM Elements ---
        const loadingQuizEl = document.getElementById('loading-quiz');
        const segmentSelectionEl = document.getElementById('segment-selection-quiz');
        const startSegment1Btn = document.getElementById('start-segment-1-btn');
        const startSegment2Btn = document.getElementById('start-segment-2-btn');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        const questionNumberEl = document.getElementById('question-number');
        const totalQuestionsEl = document.getElementById('total-questions');
        const questionTextEl = document.getElementById('question-text');
        const optionsContainerEl = document.getElementById('options-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const markQuestionBtn = document.getElementById('mark-question-btn');
        const scoreTextEl = document.getElementById('score-text');
        const feedbackTextEl = document.getElementById('feedback-text');
        const restartBtn = document.getElementById('restart-btn');
        const reviewBtn = document.getElementById('review-btn');
        const filterMarkedBtn = document.getElementById('filter-marked-btn');
        const timerEl = document.getElementById('timer');
        const detailedResultsEl = document.getElementById('detailed-results');
        const quizProgressFill = document.getElementById('quiz-progress-fill');
        const answeredCountEl = document.getElementById('answered-count');
        const totalCountEl = document.getElementById('total-count');
        const scorePercentageEl = document.getElementById('score-percentage');
        const progressPercentageEl = document.getElementById('progress-percentage');
        
        // --- State Variables ---
        let fullCourseQuestions = [];
        let currentQuizQuestions = [];
        let userAnswers = [];
        let markedQuestions = [];
        let score = 0;
        let timerInterval = null;
        let currentSegmentNumber = 0;
        let currentQuestionIndex = 0;
        let isReviewFiltered = false;
        const QUIZ_LENGTH = 50;
        const SEGMENT_POOL_SIZE = 100;
        const TIME_LIMIT_SECONDS = 25 * 60;
        let quizStartTime = null;
        let explanationsEnabled = false;

        // --- Core Quiz Functions ---
        const showScreen = (screen) => {
            [loadingQuizEl, segmentSelectionEl, quizContainer, resultsContainer].forEach(el => el.style.display = 'none');
            screen.style.display = 'block';
        };

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        const startQuizForSegment = (segmentNumber) => {
            currentSegmentNumber = segmentNumber;
            quizStartTime = Date.now();
            const startIndex = (segmentNumber - 1) * SEGMENT_POOL_SIZE;
            const endIndex = startIndex + SEGMENT_POOL_SIZE;

            if (fullCourseQuestions.length < startIndex + 1) {
                alert(`Error: Not enough questions in the course file for Segment ${segmentNumber}.`);
                return;
            }

            let segmentPool = [...fullCourseQuestions].slice(startIndex, endIndex);
            
            // Add adaptive learning - prioritize weak areas
            const params = new URLSearchParams(window.location.search);
            const courseCode = params.get('course');
            const weakQuestions = userDataManager.getWeakQuestions(courseCode, 20);
            
            if (weakQuestions.length > 0) {
                // Find matching questions in the pool and prioritize them
                const weakHashes = weakQuestions.map(wq => userDataManager.hashQuestion(wq.question));
                const priorityQuestions = [];
                const regularQuestions = [];
                
                segmentPool.forEach(q => {
                    const hash = userDataManager.hashQuestion(q.question);
                    if (weakHashes.includes(hash)) {
                        priorityQuestions.push(q);
                    } else {
                        regularQuestions.push(q);
                    }
                });
                
                // Shuffle both arrays
                shuffleArray(priorityQuestions);
                shuffleArray(regularQuestions);
                
                // Combine with priority questions first (up to 30% of quiz)
                const priorityCount = Math.min(priorityQuestions.length, Math.floor(QUIZ_LENGTH * 0.3));
                segmentPool = [...priorityQuestions.slice(0, priorityCount), ...regularQuestions];
            }
            
            shuffleArray(segmentPool);
            currentQuizQuestions = segmentPool.slice(0, QUIZ_LENGTH);
            
            if (currentQuizQuestions.length < QUIZ_LENGTH) {
                alert(`Warning: Segment ${segmentNumber} only has ${currentQuizQuestions.length} questions available.`);
            }

            userAnswers = new Array(currentQuizQuestions.length).fill(null);
            markedQuestions = new Array(currentQuizQuestions.length).fill(false);
            score = 0;
            currentQuestionIndex = 0;
            
            totalQuestionsEl.textContent = currentQuizQuestions.length;
            totalCountEl.textContent = currentQuizQuestions.length;

            loadQuestion(0);
            startTimer();
            updateQuizProgress();
            showScreen(quizContainer);
        };
        
        const loadQuestion = (index) => {
            if (!currentQuizQuestions[index]) return;
            const question = currentQuizQuestions[index];
            questionNumberEl.textContent = index + 1;
            questionTextEl.innerHTML = question.question;
            optionsContainerEl.innerHTML = '';

            question.options.forEach((optionText) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.innerHTML = `<input type="radio" name="q_options" value="${optionText}"><label>${optionText}</label>`;
                if (userAnswers[index] === optionText) {
                    optionDiv.querySelector('input').checked = true;
                }
                optionDiv.addEventListener('click', () => {
                    optionDiv.querySelector('input').checked = true;
                    userAnswers[index] = optionText;
                    updateQuizProgress();
                });
                optionsContainerEl.appendChild(optionDiv);
            });
            updateNavigationButtons();

            if (markedQuestions[index]) {
                markQuestionBtn.classList.add('active');
                markQuestionBtn.innerHTML = '🚩 Marked';
            } else {
                markQuestionBtn.classList.remove('active');
                markQuestionBtn.innerHTML = '🚩 Mark';
            }
        };
        
        const updateNavigationButtons = () => {
            prevBtn.disabled = currentQuestionIndex === 0;
            const isLast = currentQuestionIndex === currentQuizQuestions.length - 1;
            nextBtn.style.display = isLast ? 'none' : 'inline-flex';
            submitBtn.style.display = isLast ? 'inline-flex' : 'none';
        };

        const updateQuizProgress = () => {
            const answeredCount = userAnswers.filter(answer => answer !== null).length;
            answeredCountEl.textContent = answeredCount;
            const percentage = Math.round((answeredCount / currentQuizQuestions.length) * 100);
            quizProgressFill.style.width = `${percentage}%`;
            progressPercentageEl.textContent = `${percentage}%`;
        };

        const startTimer = () => {
            let timeLeft = TIME_LIMIT_SECONDS;
            clearInterval(timerInterval);
            const updateDisplay = () => {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerEl.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            };
            updateDisplay();
            timerInterval = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    submitQuiz();
                }
            }, 1000);
        };

        const submitQuiz = () => {
            clearInterval(timerInterval);
            const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
            score = 0;
            const wrongAnswers = [];
            
            userAnswers.forEach((answer, index) => {
                if (answer === currentQuizQuestions[index].answer) { 
                    score++; 
                } else {
                    wrongAnswers.push({
                        question: currentQuizQuestions[index].question,
                        userAnswer: answer || 'Not Answered',
                        correctAnswer: currentQuizQuestions[index].answer
                    });
                }
            });
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text">Submitting...</span>';

            const params = new URLSearchParams(window.location.search);
            const userName = params.get('name');
            const courseCode = params.get('course');
            const department = params.get('department');
            
            // Record quiz result in user data
            const result = userDataManager.recordQuizResult(
                courseCode, 
                currentSegmentNumber, 
                score, 
                currentQuizQuestions.length, 
                timeSpent, 
                markedQuestions.filter(marked => marked), 
                wrongAnswers
            );
            
            let resultsMessage = `✅ Quiz Result: ${userName} ✅\n\n`;
            resultsMessage += `Dept: ${department}\nCourse: ${courseCode}\n`;
            resultsMessage += `Segment: ${currentSegmentNumber}\n`;
            resultsMessage += `Score: ${score} out of ${currentQuizQuestions.length}`;
            if (result && result.xpGained) {
                resultsMessage += `\nXP Gained: ${result.xpGained}`;
            }
            sendNotification(resultsMessage);

            displayResultsOnScreen(result);
        };

        const displayResultsOnScreen = (gameResult = null) => {
            detailedResultsEl.style.display = 'none';
            scoreTextEl.textContent = `Your Score: ${score} / ${currentQuizQuestions.length}`;
            const percentage = Math.round((score / currentQuizQuestions.length) * 100);
            scorePercentageEl.textContent = `${percentage}%`;

            if (percentage >= 80) feedbackTextEl.textContent = "Excellent work!";
            else if (percentage >= 50) feedbackTextEl.textContent = "Good job! Keep practicing.";
            else feedbackTextEl.textContent = "Review the material and try again.";
            
            // Show XP and achievements if available
            if (gameResult && gameResult.xpGained) {
                const xpDisplay = document.createElement('div');
                xpDisplay.className = 'xp-display';
                xpDisplay.innerHTML = `
                    <div class="xp-gained">+${gameResult.xpGained} XP</div>
                    ${gameResult.newAchievements.length > 0 ? 
                        `<div class="new-achievements">🏆 New Achievement${gameResult.newAchievements.length > 1 ? 's' : ''} Unlocked!</div>` : 
                        ''
                    }
                `;
                resultsContainer.insertBefore(xpDisplay, resultsContainer.querySelector('.results-actions'));
            }
            
            showScreen(resultsContainer);
        };

        const toggleDetailedResults = () => {
            if (detailedResultsEl.style.display === 'none') {
                detailedResultsEl.innerHTML = ''; // Clear previous results
                currentQuizQuestions.forEach((q, i) => {
                    const userAnswer = userAnswers[i] || 'Not Answered';
                    const isCorrect = userAnswer === q.answer;
                    const isMarked = markedQuestions[i];

                    const statusIcon = isCorrect ? '✓' : '✗';
                    const statusText = isCorrect ? 'Correct' : 'Incorrect';
                    const statusClass = isCorrect ? 'correct-status' : 'incorrect-status';
                    const markedClass = isMarked ? 'marked-review' : '';
                    
                    // Add explanation if available and explanations are enabled
                    const explanationHTML = explanationsEnabled && q.explanation ? 
                        `<div class="question-explanation">
                            <strong>💡 Explanation:</strong> ${q.explanation}
                        </div>` : '';
                    
                    const reviewCardHTML = `
                        <div class="review-card ${markedClass}">
                            <div class="review-card-header">
                                <span class="review-question-number">Question ${i + 1}</span>
                                ${isMarked ? '<span class="review-marked-icon">🚩 Marked</span>' : ''}
                                <span class="review-status ${statusClass}">${statusIcon} ${statusText}</span>
                            </div>
                            <div class="review-card-body">
                                <p class="review-question-text">${q.question}</p>
                                <p class="review-answer user-answer ${isCorrect ? 'correct-answer' : 'incorrect-answer'}">
                                    <strong>Your Answer:</strong> ${userAnswer}
                                </p>
                                ${!isCorrect ? `
                                <p class="review-answer correct-answer-reveal">
                                    <strong>Correct Answer:</strong> ${q.answer}
                                </p>` : ''}
                                ${explanationHTML}
                            </div>
                        </div>
                    `;
                    detailedResultsEl.innerHTML += reviewCardHTML;
                });

                detailedResultsEl.style.display = 'block';
                reviewBtn.textContent = 'Hide Review';
                if (markedQuestions.includes(true)) {
                    filterMarkedBtn.style.display = 'inline-flex';
                }
                
                // Add explanation toggle button
                if (!document.getElementById('explanation-toggle')) {
                    const explanationToggle = document.createElement('button');
                    explanationToggle.id = 'explanation-toggle';
                    explanationToggle.className = 'nav-btn';
                    explanationToggle.textContent = explanationsEnabled ? 'Hide Explanations' : 'Show Explanations';
                    explanationToggle.addEventListener('click', () => {
                        explanationsEnabled = !explanationsEnabled;
                        explanationToggle.textContent = explanationsEnabled ? 'Hide Explanations' : 'Show Explanations';
                        toggleDetailedResults(); // Refresh the view
                        toggleDetailedResults(); // Show again with explanations
                    });
                    document.querySelector('.results-actions').appendChild(explanationToggle);
                }
            } else {
                detailedResultsEl.style.display = 'none';
                reviewBtn.textContent = 'Review Answers';
                filterMarkedBtn.style.display = 'none';
                isReviewFiltered = false;
                filterMarkedBtn.textContent = 'Show Marked Only';
                
                // Remove explanation toggle
                const explanationToggle = document.getElementById('explanation-toggle');
                if (explanationToggle) {
                    explanationToggle.remove();
                }
            }
        };

        // --- Event Listeners ---
        markQuestionBtn.addEventListener('click', () => {
            markedQuestions[currentQuestionIndex] = !markedQuestions[currentQuestionIndex];
            loadQuestion(currentQuestionIndex);
        });

        filterMarkedBtn.addEventListener('click', () => {
            isReviewFiltered = !isReviewFiltered;
            const allResultItems = detailedResultsEl.querySelectorAll('.review-card');
            if (isReviewFiltered) {
                allResultItems.forEach(item => {
                    item.style.display = item.classList.contains('marked-review') ? 'block' : 'none';
                });
                filterMarkedBtn.textContent = 'Show All';
            } else {
                allResultItems.forEach(item => item.style.display = 'block');
                filterMarkedBtn.textContent = 'Show Marked Only';
            }
        });

        startSegment1Btn.addEventListener('click', () => startQuizForSegment(1));
        startSegment2Btn.addEventListener('click', () => startQuizForSegment(2));
        nextBtn.addEventListener('click', () => { if (currentQuestionIndex < currentQuizQuestions.length - 1) { currentQuestionIndex++; loadQuestion(currentQuestionIndex); } });
        prevBtn.addEventListener('click', () => { if (currentQuestionIndex > 0) { currentQuestionIndex--; loadQuestion(currentQuestionIndex); } });
        submitBtn.addEventListener('click', submitQuiz);
        restartBtn.addEventListener('click', () => showScreen(segmentSelectionEl));
        reviewBtn.addEventListener('click', toggleDetailedResults);

        // --- Initial Page Load Logic ---
        const params = new URLSearchParams(window.location.search);
        const userName = params.get('name');
        const courseCode = params.get('course');
        if (!userName || !courseCode) { window.location.href = 'index.html'; return; }
        document.getElementById('user-info-display').textContent = `User: ${userName} | Course: ${courseCode}`;
        
        const script = document.createElement('script');
        script.src = `courses/${courseCode}.js`;
        
        const showCourseNotAvailableError = () => {
            loadingQuizEl.innerHTML = `
                <div class="error-message-container">
                    <div class="error-icon">!</div>
                    <h3 class="error-title">Course Not Available</h3>
                    <p class="error-subtitle">This course has not been uploaded yet. Please try another one.</p>
                    <a href="index.html" class="back-link-btn">← Go Back to Course Selection</a>
                </div>
            `;
            loadingQuizEl.style.display = 'block'; 
        };

        script.onload = () => {
            if (window.quizData?.questions?.length > 0) {
                fullCourseQuestions = window.quizData.questions;
                showScreen(segmentSelectionEl);
            } else {
                showCourseNotAvailableError();
            }
        };
        script.onerror = () => {
             showCourseNotAvailableError();
        };
        document.head.appendChild(script);
    }
    
    // =========================================================================
    // 4. HELP PAGE LOGIC (help.html)
    // =========================================================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.nextElementSibling;
                const icon = btn.querySelector('.faq-icon');
                const isActive = btn.classList.toggle('active');

                if (isActive) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.textContent = '−';
                } else {
                    answer.style.maxHeight = '0px';
                    icon.textContent = '+';
                }
            });
        });
    }
});

// =========================================================================
// GLOBAL FUNCTIONS (Called from HTML onclick attributes)
// =========================================================================

// Placed globally for the onclick attribute in contact.html
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => console.error('Failed to copy: ', err));
}

// Global function to show user dashboard
function showUserDashboard() {
    window.location.href = 'home.html';
}