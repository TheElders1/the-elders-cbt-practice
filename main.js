document.addEventListener('DOMContentLoaded', () => {

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
    // 2. SETUP PAGE LOGIC (index.html)
    // =========================================================================
    const userDetailsForm = document.getElementById('user-details-form');
    if (userDetailsForm) {
        const nameInput = document.getElementById('name-input');
        const departmentSelect = document.getElementById('department-select');
        const courseGroup = document.getElementById('course-selection-group');
        const courseSelect = document.getElementById('course-select');
        
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

            if (courseGroup.style.display !== 'none' && !courseSelect.value) {
                showFormFeedback('course', 'Please select a course.');
                isValid = false;
            } else { showFormFeedback('course', '', 'success'); }
            
            return isValid;
        };
        
        const coursesByDepartment = {
            "Computer Science": ["MTH121", "GST121", "COS121", "PHY121", "CSC121", "CSC122"],
            "Cyber Security": ["MTH121", "GST121", "COS121", "PHY121", "CYB121", "CYB122"],
            "Data Science": ["MTH121", "GST121", "COS121", "PHY121", "DTS121", "DTS122"],
            "Information Technology": ["MTH121", "GST121", "COS121", "PHY121", "IFT121", "IFT122"],
            "Software Engineering": ["MTH121", "GST121", "COS121", "PHY121", "SEN121", "SEN122"]
        };

        departmentSelect.addEventListener('change', function() {
            const selectedDepartment = this.value;
            courseSelect.innerHTML = '';
            showFormFeedback('department', '✓ Department selected', 'success');
            
            if (selectedDepartment && coursesByDepartment[selectedDepartment]) {
                courseSelect.innerHTML = `<option value="" disabled selected>-- Please choose a course --</option>`;
                const uniqueCourses = [...new Set(coursesByDepartment[selectedDepartment])];
                uniqueCourses.forEach(course => courseSelect.innerHTML += `<option value="${course}">${course}</option>`);
                courseGroup.style.display = 'block';
            } else {
                courseGroup.style.display = 'none';
            }
        });

        userDetailsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!validateForm()) return;
            
            const name = nameInput.value.trim();
            const department = departmentSelect.value;
            const course = courseSelect.value;
            
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true; 
            submitButton.innerHTML = '<span class="btn-text">Loading...</span><span class="btn-icon">⏳</span>';

            const notificationMessage = `🔔 New Quiz Taker 🔔\n\nName: ${name}\nDept: ${department}\nCourse: ${course}`;
            sendNotification(notificationMessage);

            const encodedName = encodeURIComponent(name);
            const encodedCourse = encodeURIComponent(course);
            const encodedDepartment = encodeURIComponent(department);
            window.location.href = `quiz.html?name=${encodedName}&course=${encodedCourse}&department=${encodedDepartment}`;
        });
    }

    // =========================================================================
    // 3. QUIZ PAGE LOGIC (quiz.html) - WITH "MARK FOR REVIEW"
    // =========================================================================
    const quizHost = document.getElementById('quiz-host');
    if (quizHost) {
        // --- DOM Elements ---
        const loadingQuizEl = document.getElementById('loading-quiz');
        const segmentSelectionEl = document.getElementById('segment-selection-quiz');
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
        let currentSegmentQuestions = [];
        let userAnswers = [];
        let markedQuestions = [];
        let score = 0;
        let timerInterval = null;
        let currentSegmentNumber = 0;
        let currentQuestionIndex = 0;
        let isReviewFiltered = false;
        const TIME_LIMIT_SECONDS = 25 * 60;

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
            const segmentSize = 50;
            const startIndex = (segmentNumber - 1) * segmentSize;
            
            if (fullCourseQuestions.length < startIndex + 1) {
                alert(`Error: Course data is incomplete for Segment ${segmentNumber}.`);
                return;
            }

            currentSegmentQuestions = [...fullCourseQuestions].slice(startIndex, startIndex + segmentSize);
            shuffleArray(currentSegmentQuestions);
            userAnswers = new Array(currentSegmentQuestions.length).fill(null);
            markedQuestions = new Array(currentSegmentQuestions.length).fill(false); // Reset marked questions
            score = 0;
            currentQuestionIndex = 0;
            
            totalQuestionsEl.textContent = currentSegmentQuestions.length;
            totalCountEl.textContent = currentSegmentQuestions.length;

            loadQuestion(0);
            startTimer();
            updateQuizProgress();
            showScreen(quizContainer);
        };

        const loadQuestion = (index) => {
            if (!currentSegmentQuestions[index]) return;
            const question = currentSegmentQuestions[index];
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
            const isLast = currentQuestionIndex === currentSegmentQuestions.length - 1;
            nextBtn.style.display = isLast ? 'none' : 'inline-flex';
            submitBtn.style.display = isLast ? 'inline-flex' : 'none';
        };

        const updateQuizProgress = () => {
            const answeredCount = userAnswers.filter(answer => answer !== null).length;
            answeredCountEl.textContent = answeredCount;
            const percentage = Math.round((answeredCount / currentSegmentQuestions.length) * 100);
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
            score = 0;
            userAnswers.forEach((answer, index) => {
                if (answer === currentSegmentQuestions[index].answer) { score++; }
            });
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text">Submitting...</span>';

            const params = new URLSearchParams(window.location.search);
            const userName = params.get('name');
            const courseCode = params.get('course');
            const department = params.get('department');
            
            let resultsMessage = `✅ Quiz Result: ${userName} ✅\n\n`;
            resultsMessage += `Dept: ${department}\nCourse: ${courseCode}\n`;
            resultsMessage += `Segment: ${currentSegmentNumber}\n`;
            resultsMessage += `Score: ${score} out of ${currentSegmentQuestions.length}`;
            sendNotification(resultsMessage);

            displayResultsOnScreen();
        };

        const displayResultsOnScreen = () => {
            detailedResultsEl.style.display = 'none';
            scoreTextEl.textContent = `Your Score: ${score} / ${currentSegmentQuestions.length}`;
            const percentage = Math.round((score / currentSegmentQuestions.length) * 100);
            scorePercentageEl.textContent = `${percentage}%`;

            if (percentage >= 80) feedbackTextEl.textContent = "Excellent work!";
            else if (percentage >= 50) feedbackTextEl.textContent = "Good job! Keep practicing.";
            else feedbackTextEl.textContent = "Review the material and try again.";
            
            showScreen(resultsContainer);
        };

        const toggleDetailedResults = () => {
            if (detailedResultsEl.style.display === 'none') {
                detailedResultsEl.innerHTML = '<h3>Answer Review</h3>';
                currentSegmentQuestions.forEach((q, i) => {
                    const userAnswer = userAnswers[i] || 'Not Answered';
                    const isCorrect = userAnswer === q.answer;
                    const isMarked = markedQuestions[i];

                    const resultItem = document.createElement('div');
                    resultItem.className = `result-item ${isCorrect ? 'correct' : 'incorrect'}`;
                    if (isMarked) {
                        resultItem.classList.add('marked-review');
                    }

                    resultItem.innerHTML = `
                        <p><b>Q${i + 1}:</b> ${q.question} ${isMarked ? '🚩' : ''}</p>
                        <p>Your Answer: ${userAnswer}</p>
                        ${!isCorrect ? `<p class="correct-answer">Correct Answer: ${q.answer}</p>` : ''}
                    `;
                    detailedResultsEl.appendChild(resultItem);
                });
                detailedResultsEl.style.display = 'block';
                reviewBtn.textContent = 'Hide Review';
                if (markedQuestions.includes(true)) {
                    filterMarkedBtn.style.display = 'inline-flex';
                }
            } else {
                detailedResultsEl.style.display = 'none';
                reviewBtn.textContent = 'Review Answers';
                filterMarkedBtn.style.display = 'none';
                isReviewFiltered = false;
                filterMarkedBtn.textContent = 'Show Marked Only';
            }
        };

        // --- Event Listeners ---
        markQuestionBtn.addEventListener('click', () => {
            markedQuestions[currentQuestionIndex] = !markedQuestions[currentQuestionIndex];
            if (markedQuestions[currentQuestionIndex]) {
                markQuestionBtn.classList.add('active');
                markQuestionBtn.innerHTML = '🚩 Marked';
            } else {
                markQuestionBtn.classList.remove('active');
                markQuestionBtn.innerHTML = '🚩 Mark';
            }
        });

        filterMarkedBtn.addEventListener('click', () => {
            isReviewFiltered = !isReviewFiltered;
            const allResultItems = detailedResultsEl.querySelectorAll('.result-item');
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

        nextBtn.addEventListener('click', () => { if (currentQuestionIndex < currentSegmentQuestions.length - 1) { currentQuestionIndex++; loadQuestion(currentQuestionIndex); } });
        prevBtn.addEventListener('click', () => { if (currentQuestionIndex > 0) { currentQuestionIndex--; loadQuestion(currentQuestionIndex); } });
        submitBtn.addEventListener('click', submitQuiz);
        document.getElementById('start-segment-1')?.addEventListener('click', () => startQuizForSegment(1));
        document.getElementById('start-segment-2')?.addEventListener('click', () => startQuizForSegment(2));
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
        script.onload = () => {
            if (window.quizData?.questions?.length > 0) {
                fullCourseQuestions = window.quizData.questions;
                showScreen(segmentSelectionEl);
            } else {
                loadingQuizEl.innerHTML = `<p style="color:var(--danger-color);">Error: Could not load quiz data for ${courseCode}.</p>`;
            }
        };
        script.onerror = () => { loadingQuizEl.innerHTML = `<p style="color:var(--danger-color);">Error: Course file 'courses/${courseCode}.js' not found.</p>`; };
        document.head.appendChild(script);
    }
    
    // --- FAQ Accordion Logic (For help.html) ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.textContent = '−';
            } else {
                answer.style.maxHeight = '0px';
                icon.textContent = '+';
            }
        });
    });
});

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