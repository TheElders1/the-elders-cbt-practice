document.addEventListener('DOMContentLoaded', () => {

    // --- 1. UNIVERSAL THEME TOGGLE LOGIC (Runs on every page) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const applyTheme = () => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '🌙';
        }
    };
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme();
        });
    }
    applyTheme();

    // --- HELPER FUNCTION TO CHECK INTERNET CONNECTION ---
    function isOnline() {
        return navigator.onLine;
    }

    // --- HELPER FUNCTIONS FOR ENHANCED UI ---
    function updateProgressStep(step) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((stepEl, index) => {
            if (index < step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });
    }

    function showFormFeedback(fieldId, message, type = 'success') {
        const feedback = document.getElementById(`${fieldId}-feedback`);
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `form-feedback ${type}`;
        }
    }

    function validateForm() {
        const name = document.getElementById('name-input').value.trim();
        const department = document.getElementById('department-select').value;
        const course = document.getElementById('course-select').value;
        
        let isValid = true;
        
        if (name.length < 6) {
            showFormFeedback('name', 'Name must be at least 6 characters long', 'error');
            isValid = false;
        } else {
            showFormFeedback('name', '✓ Valid name', 'success');
        }
        
        if (!department) {
            showFormFeedback('department', 'Please select a department', 'error');
            isValid = false;
        } else {
            showFormFeedback('department', '✓ Department selected', 'success');
        }
        
        if (!course) {
            showFormFeedback('course', 'Please select a course', 'error');
            isValid = false;
        } else {
            showFormFeedback('course', '✓ Course selected', 'success');
        }
        
        return isValid;
    }
    // --- 2. LOGIC FOR THE SETUP PAGE (index.html) ---
    const userDetailsForm = document.getElementById('user-details-form');
    if (userDetailsForm) {
        // This block only runs on index.html
        const departmentSelect = document.getElementById('department-select');
        const courseGroup = document.getElementById('course-selection-group');
        const courseSelect = document.getElementById('course-select');
        const nameInput = document.getElementById('name-input');
        
        const coursesByDepartment = {
            "Computer Science": ["MTH121", "GST121", "COS121", "PHY121", "CSC121", "CSC122"],
            "Cyber Security": ["MTH121", "GST121", "COS121", "PHY121", "CYB121", "CYB122", "CYB121"],
            "Data Science": ["MTH121", "GST121", "COS121", "PHY121", "DTS121", "DTS122"],
            "Information Technology": ["MTH121", "GST121", "COS121", "PHY121", "IFT121", "IFT122", "IFT121"],
            "Software Engineering": ["MTH121", "GST121", "COS121", "PHY121", "SEN121", "SEN122"]
        };

        // Real-time validation
        nameInput.addEventListener('input', () => {
            const name = nameInput.value.trim();
            if (name.length >= 6) {
                showFormFeedback('name', '✓ Valid name', 'success');
                updateProgressStep(2);
            } else if (name.length > 0) {
                showFormFeedback('name', 'Name must be at least 6 characters long', 'error');
                updateProgressStep(1);
            } else {
                showFormFeedback('name', '', '');
                updateProgressStep(1);
            }
        });

        departmentSelect.addEventListener('change', function() {
            const selectedDepartment = this.value;
            courseSelect.innerHTML = '';
            courseGroup.style.display = 'none';
            showFormFeedback('course', '', '');

            if (selectedDepartment && coursesByDepartment[selectedDepartment]) {
                showFormFeedback('department', '✓ Department selected', 'success');
                const defaultOption = document.createElement('option');
                defaultOption.value = ""; defaultOption.textContent = "-- Please choose a course --";
                defaultOption.disabled = true; defaultOption.selected = true;
                courseSelect.appendChild(defaultOption);
                
                coursesByDepartment[selectedDepartment].forEach(course => {
                    const option = document.createElement('option');
                    option.value = course; option.textContent = course;
                    courseSelect.appendChild(option);
                });
                courseGroup.style.display = 'block';
            } else {
                showFormFeedback('department', 'Please select a department', 'error');
            }
        });

        courseSelect.addEventListener('change', function() {
            if (this.value) {
                showFormFeedback('course', '✓ Course selected', 'success');
                updateProgressStep(3);
            } else {
                showFormFeedback('course', 'Please select a course', 'error');
                updateProgressStep(2);
            }
        });

        userDetailsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const name = document.getElementById('name-input').value;
            const department = document.getElementById('department-select').value;
            const course = document.getElementById('course-select').value;
            const submitButton = this.querySelector('button[type="submit"]');
            
            submitButton.disabled = true; 
            submitButton.innerHTML = '<span class="btn-text">Loading...</span><span class="btn-icon">⏳</span>';

            const startQuiz = () => {
                const encodedName = encodeURIComponent(name);
                const encodedCourse = encodeURIComponent(course);
                const encodedDepartment = encodeURIComponent(department);
                window.location.href = `quiz.html?name=${encodedName}&course=${encodedCourse}&department=${encodedDepartment}`;
            };

            // START: CONDITIONAL TELEGRAM LOGIC
            if (isOnline()) {
                const botToken = '7628140416:AAGIcoDDsVinxldjvBqzPzLjiLFMnKz8Rik';
                const chatId = '7129036848';
                
                let message = `🔔 New Quiz Taker 🔔\n\n`;
                message += `Full Name: ${name}\n`;
                message += `Department: ${department}\n`;
                message += `Course: ${course}`;

                const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

                fetch(url, { method: 'GET' })
                    .catch(err => console.error("Telegram 'New Taker' message failed:", err))
                    .finally(startQuiz);
            } else {
                // If offline, just go straight to the quiz
                console.log("Offline mode: Bypassing Telegram notification.");
                startQuiz();
            }
            // END: CONDITIONAL TELEGRAM LOGIC
        });
    }

    // --- 3. LOGIC FOR THE QUIZ/RESULTS PAGE (quiz.html) ---
    const quizHost = document.getElementById('quiz-host');
    if (quizHost) {
        // --- DOM Elements for Quiz Page ---
        const loadingQuizEl = document.getElementById('loading-quiz');
        const segmentSelectionEl = document.getElementById('segment-selection-quiz');
        const startSegment1Btn = document.getElementById('start-segment-1');
        const startSegment2Btn = document.getElementById('start-segment-2');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        const questionNumberEl = document.getElementById('question-number');
        const totalQuestionsEl = document.getElementById('total-questions');
        const questionTextEl = document.getElementById('question-text');
        const optionsContainerEl = document.getElementById('options-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const scoreTextEl = document.getElementById('score-text');
        const feedbackTextEl = document.getElementById('feedback-text');
        const restartBtn = document.getElementById('restart-btn');
        const reviewBtn = document.getElementById('review-btn');
        const timerEl = document.getElementById('timer');
        const detailedResultsEl = document.getElementById('detailed-results');
        const quizProgressFill = document.getElementById('quiz-progress-fill');
        const answeredCountEl = document.getElementById('answered-count');
        const totalCountEl = document.getElementById('total-count');
        const scorePercentageEl = document.getElementById('score-percentage');

        // --- State Variables ---
        let fullCourseQuestions = [];
        let currentSegmentQuestions = [];
        let currentQuestionIndex = 0;
        let userAnswers = [];
        let score = 0;
        let timerInterval = null;
        let currentSegmentNumber = 0;
        let detailedResultsVisible = false;
        
        const TIME_LIMIT_SECONDS = 25 * 60;

        // --- Core Functions ---
        function showScreen(screen) {
            loadingQuizEl.style.display = 'none';
            segmentSelectionEl.style.display = 'none';
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'none';
            screen.style.display = 'block';
        }

        function updateQuizProgress() {
            const answeredCount = userAnswers.filter(answer => answer !== null).length;
            const percentage = (answeredCount / currentSegmentQuestions.length) * 100;
            
            if (quizProgressFill) {
                quizProgressFill.style.width = `${percentage}%`;
            }
            
            const progressText = document.querySelector('.quiz-progress-text span');
            if (progressText) {
                progressText.textContent = `${Math.round(percentage)}%`;
            }
            
            if (answeredCountEl) {
                answeredCountEl.textContent = answeredCount;
            }
            
            if (totalCountEl) {
                totalCountEl.textContent = currentSegmentQuestions.length;
            }
        }
        function startQuizForSegment(segmentNumber) {
            currentSegmentNumber = segmentNumber;
            const segmentSize = 50;
            const startIndex = (segmentNumber - 1) * segmentSize;
            const endIndex = startIndex + segmentSize;

            if (fullCourseQuestions.length < endIndex) {
                alert(`Error: This course does not have enough questions for Segment ${segmentNumber}.`);
                return;
            }

            currentSegmentQuestions = fullCourseQuestions.slice(startIndex, endIndex);
            shuffleArray(currentSegmentQuestions);
            userAnswers = new Array(currentSegmentQuestions.length).fill(null);
            score = 0;
            currentQuestionIndex = 0;
            totalQuestionsEl.textContent = currentSegmentQuestions.length;
            if (totalCountEl) totalCountEl.textContent = currentSegmentQuestions.length;
            
            loadQuestion(0);
            startTimer();
            updateQuizProgress();
            showScreen(quizContainer);
        }
        
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function loadQuestion(index) {
            const question = currentSegmentQuestions[index];
            questionNumberEl.textContent = index + 1;
            questionTextEl.textContent = question.question;
            optionsContainerEl.innerHTML = '';
            
            question.options.forEach((option, i) => {
                const optionId = `q${index}_o${i}`;
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.innerHTML = `<input type="radio" id="${optionId}" name="q_options" value="${option}"><label for="${optionId}">${option}</label>`;
                
                if (userAnswers[index] === option) {
                    optionDiv.querySelector('input').checked = true;
                }
                
                optionDiv.addEventListener('click', () => {
                    optionDiv.querySelector('input').checked = true;
                    userAnswers[index] = option;
                    updateQuizProgress();
                });
                
                optionsContainerEl.appendChild(optionDiv);
            });
            updateNavigationButtons();
            
            // Smooth scroll to top of question
            document.querySelector('#question-area').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }

        function updateNavigationButtons() {
            prevBtn.disabled = currentQuestionIndex === 0;
            const isLast = currentQuestionIndex === currentSegmentQuestions.length - 1;
            nextBtn.style.display = isLast ? 'none' : 'inline-block';
            submitBtn.style.display = isLast ? 'inline-block' : 'none';
        }
        
        function startTimer() {
            let timeLeft = TIME_LIMIT_SECONDS;
            clearInterval(timerInterval);
            const updateDisplay = () => {
                 const minutes = Math.floor(timeLeft / 60);
                 const seconds = timeLeft % 60;
                 timerEl.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                 if (timeLeft <= 60) {
                     timerEl.style.color = 'var(--timer-critical)';
                     timerEl.style.animation = 'pulse 1s infinite';
                 } else if (timeLeft <= 300) {
                     timerEl.style.color = 'var(--timer-warning)';
                 }
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
        }
        
        function submitQuiz() {
            clearInterval(timerInterval);
            score = 0;
            userAnswers.forEach((answer, index) => {
                if (answer === currentSegmentQuestions[index].answer) {
                    score++;
                }
            });
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text">Submitting...</span><span class="btn-icon">⏳</span>';

            // START: CONDITIONAL TELEGRAM LOGIC FOR RESULTS
            if (isOnline()) {
                const params = new URLSearchParams(window.location.search);
                const userName = params.get('name');
                const courseCode = params.get('course');
                const department = params.get('department');
                
                const botToken = '7628140416:AAGIcoDDsVinxldjvBqzPzLjiLFMnKz8Rik';
                const chatId = '7129036848';
                
                let resultsMessage = `✅ Quiz Result for ${userName} ✅\n\n`;
                resultsMessage += `Department: ${department}\n`;
                resultsMessage += `Course: ${courseCode}\n`;
                resultsMessage += `Segment: ${currentSegmentNumber}\n`;
                resultsMessage += `Final Score: ${score} out of ${currentSegmentQuestions.length}`;

                const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(resultsMessage)}`;

                fetch(url, { method: 'GET' })
                    .catch(err => console.error("Failed to send results to Telegram:", err))
                    .finally(() => {
                        displayResultsOnScreen();
                    });
            } else {
                // If offline, just display results without sending
                console.log("Offline mode: Bypassing Telegram results submission.");
                displayResultsOnScreen();
            }
            // END: CONDITIONAL TELEGRAM LOGIC FOR RESULTS
        }
        
        function displayResultsOnScreen() {
            // Initially hide detailed results
            detailedResultsEl.style.display = 'none';
            detailedResultsVisible = false;

            scoreTextEl.textContent = `Your score: ${score} out of ${currentSegmentQuestions.length}`;
            const percentage = currentSegmentQuestions.length > 0 ? (score / currentSegmentQuestions.length) * 100 : 0;
            
            if (scorePercentageEl) {
                scorePercentageEl.textContent = `${Math.round(percentage)}%`;
            }
            
            if (percentage >= 80) feedbackTextEl.textContent = "Excellent work!";
            else if (percentage >= 50) feedbackTextEl.textContent = "Good job! Keep practicing.";
            else feedbackTextEl.textContent = "Review the material and try again.";
            
            showScreen(resultsContainer);
            
            // Scroll to top of results
            resultsContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
        
        function toggleDetailedResults() {
            if (!detailedResultsVisible) {
                // Generate detailed results
                detailedResultsEl.innerHTML = '';
                currentSegmentQuestions.forEach((q, i) => {
                    const userAnswer = userAnswers[i];
                    const isCorrect = userAnswer === q.answer;
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    const statusClass = isCorrect ? 'status-correct' : 'status-incorrect';
                    let resultHTML = `<p><b>Question ${i + 1}:</b> ${q.question}</p>
                                      <p class="user-answer">Your Answer: <span class="${statusClass}">${userAnswer || 'Not Answered'}</span></p>`;
                    if (!isCorrect) {
                        resultHTML += `<p class="correct-answer-reveal">Correct Answer: ${q.answer}</p>`;
                    }
                    resultItem.innerHTML = resultHTML;
                    detailedResultsEl.appendChild(resultItem);
                });
                
                detailedResultsEl.style.display = 'block';
                reviewBtn.innerHTML = '<span class="btn-text">Hide Review</span><span class="btn-icon">👁️</span>';
                detailedResultsVisible = true;
            } else {
                detailedResultsEl.style.display = 'none';
                reviewBtn.innerHTML = '<span class="btn-text">Review Answers</span><span class="btn-icon">📋</span>';
                detailedResultsVisible = false;
            }
        }

        // --- Event Listeners ---
        nextBtn.addEventListener('click', () => { 
            if (currentQuestionIndex < currentSegmentQuestions.length - 1) {
                currentQuestionIndex++;
                loadQuestion(currentQuestionIndex);
            }
        });
        prevBtn.addEventListener('click', () => { 
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion(currentQuestionIndex);
            }
        });
        submitBtn.addEventListener('click', () => { submitQuiz(); });
        startSegment1Btn.addEventListener('click', () => startQuizForSegment(1));
        startSegment2Btn.addEventListener('click', () => startQuizForSegment(2));
        restartBtn.addEventListener('click', () => showScreen(segmentSelectionEl));
        if (reviewBtn) {
            reviewBtn.addEventListener('click', toggleDetailedResults);
        }

        // --- Initial Page Load Logic ---
        const params = new URLSearchParams(window.location.search);
        const userName = params.get('name');
        const courseCode = params.get('course');
        if (!userName || !courseCode) {
            window.location.href = 'index.html';
            return;
        }
        document.getElementById('user-info-display').textContent = `User: ${userName} | Course: ${courseCode}`;
        const script = document.createElement('script');
        script.src = `courses/${courseCode}.js`;
        document.head.appendChild(script);
        script.onload = () => {
            if (window.quizData && window.quizData.questions) {
                fullCourseQuestions = window.quizData.questions;
                document.getElementById('quiz-header-title').textContent = window.quizData.title || courseCode;
                showScreen(segmentSelectionEl);
            } else {
                loadingQuizEl.innerHTML = `<p style="color:red;">Error: Could not load quiz data for ${courseCode}.</p>`;
            }
        };
        script.onerror = () => {
            loadingQuizEl.innerHTML = `<p style="color:red;">Error: The file 'courses/${courseCode}.js' could not be found.</p>`;
        };
    }
});