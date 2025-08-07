document.addEventListener('DOMContentLoaded', () => {

    // --- 1. UNIVERSAL HELPERS & THEME LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const applyTheme = () => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
        }
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme();
        });
    }
    applyTheme(); // Apply theme on initial load

    // Securely send notification via our Netlify function
    async function sendNotification(message) {
        if (!navigator.onLine) {
            console.log("Offline mode: Skipping notification.");
            return; // Exit if offline
        }
        try {
            await fetch('/.netlify/functions/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
        } catch (error) {
            console.error("Failed to send notification:", error);
        }
    }

    // --- 2. LOGIC FOR THE SETUP PAGE (index.html) ---
    if (document.getElementById('user-details-form')) {
        const userDetailsForm = document.getElementById('user-details-form');
        const nameInput = document.getElementById('name-input');
        const departmentSelect = document.getElementById('department-select');
        const courseGroup = document.getElementById('course-selection-group');
        const courseSelect = document.getElementById('course-select');
        
        const coursesByDepartment = {
            "Computer Science": ["MTH121", "GST121", "COS121", "PHY121", "CSC121", "CSC122"],
            "Cyber Security": ["MTH121", "GST121", "COS121", "PHY121", "CYB121", "CYB122"],
            "Data Science": ["MTH121", "GST121", "COS121", "PHY121", "DTS121", "DTS122"],
            "Information Technology": ["MTH121", "GST121", "COS121", "PHY121", "IFT121", "IFT122"],
            "Software Engineering": ["MTH121", "GST121", "COS121", "PHY121", "SEN121", "SEN122"]
        };
        
        departmentSelect.addEventListener('change', function() {
            const selectedDepartment = this.value;
            courseSelect.innerHTML = '<option value="" disabled selected>-- Please choose a course --</option>';
            
            if (selectedDepartment && coursesByDepartment[selectedDepartment]) {
                const uniqueCourses = [...new Set(coursesByDepartment[selectedDepartment])]; // Remove duplicates
                uniqueCourses.forEach(course => {
                    courseSelect.innerHTML += `<option value="${course}">${course}</option>`;
                });
                courseGroup.style.display = 'block';
            } else {
                courseGroup.style.display = 'none';
            }
        });

        userDetailsForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const name = nameInput.value.trim();
            const department = departmentSelect.value;
            const course = courseSelect.value;

            if (!name || !department || !course) {
                alert("Please fill in all fields before starting the quiz.");
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true; 
            submitButton.innerHTML = '<span class="btn-text">Loading...</span><span class="btn-icon">⏳</span>';

            // Send notification securely without waiting for it to finish
            const notificationMessage = `🔔 New Quiz Taker 🔔\n\nFull Name: ${name}\nDepartment: ${department}\nCourse: ${course}`;
            sendNotification(notificationMessage);

            // Proceed to the quiz immediately
            const encodedName = encodeURIComponent(name);
            const encodedCourse = encodeURIComponent(course);
            const encodedDepartment = encodeURIComponent(department);
            window.location.href = `quiz.html?name=${encodedName}&course=${encodedCourse}&department=${encodedDepartment}`;
        });
    }

    // --- 3. LOGIC FOR THE QUIZ/RESULTS PAGE (quiz.html) ---
    if (document.getElementById('quiz-host')) {
        // --- DOM Elements ---
        const loadingQuizEl = document.getElementById('loading-quiz');
        const segmentSelectionEl = document.getElementById('segment-selection-quiz');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        // ... (all your other querySelectors are fine)
        const questionTextEl = document.getElementById('question-text');
        const optionsContainerEl = document.getElementById('options-container');

        // --- State Variables ---
        let fullCourseQuestions = [];
        let currentSegmentQuestions = [];
        let userAnswers = [];
        let currentQuestionIndex = 0;
        let timerInterval = null;
        let score = 0;
        
        // --- Core Quiz Functions (mostly unchanged, just added async to submit) ---
        
        function showScreen(screen) {
            loadingQuizEl.style.display = 'none';
            segmentSelectionEl.style.display = 'none';
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'none';
            if (screen) screen.style.display = 'block';
        }

        function loadQuestion(index) {
            // Your existing loadQuestion logic is great. No changes needed.
            const question = currentSegmentQuestions[index];
            document.getElementById('question-number').textContent = index + 1;
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
                    // updateQuizProgress(); // You can call your progress function here
                });
                optionsContainerEl.appendChild(optionDiv);
            });
            // updateNavigationButtons(); // Call your nav update function here
        }

        async function submitQuiz() {
            clearInterval(timerInterval);
            score = 0;
            userAnswers.forEach((answer, index) => {
                if (answer === currentSegmentQuestions[index]?.answer) {
                    score++;
                }
            });

            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text">Submitting...</span><span class="btn-icon">⏳</span>';

            const params = new URLSearchParams(window.location.search);
            const userName = params.get('name');
            const courseCode = params.get('course');
            const department = params.get('department');
            const segmentNumber = document.getElementById('start-segment-1').dataset.segment; // A way to get segment

            const resultsMessage = `✅ Quiz Result: ${userName} ✅\n\nDepartment: ${department}\nCourse: ${courseCode}\nSegment: ${segmentNumber}\nScore: ${score}/${currentSegmentQuestions.length}`;

            // Send notification securely and wait for it
            await sendNotification(resultsMessage);
            
            // Now display results on screen
            displayResultsOnScreen();
        }

        function displayResultsOnScreen() {
             // Your existing displayResultsOnScreen logic is great.
             showScreen(resultsContainer);
             document.getElementById('score-text').textContent = `Your score: ${score} out of ${currentSegmentQuestions.length}`;
             //... and so on
        }

        // --- Initial Page Load & Event Listeners (mostly unchanged) ---
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
        script.onload = () => {
            if (window.quizData?.questions) {
                fullCourseQuestions = window.quizData.questions;
                showScreen(segmentSelectionEl);
            } else {
                loadingQuizEl.innerHTML = `<p style="color:red;">Error: Could not load quiz data for ${courseCode}.</p>`;
            }
        };
        script.onerror = () => {
             loadingQuizEl.innerHTML = `<p style="color:red;">Error: The file 'courses/${courseCode}.js' could not be found.</p>`;
        };
        document.head.appendChild(script);

        // Your other event listeners (nextBtn, prevBtn, etc.) are fine.
        document.getElementById('submit-btn').addEventListener('click', submitQuiz);

        // Simplified segment start
        document.getElementById('start-segment-1').addEventListener('click', () => startQuizForSegment(1));
        document.getElementById('start-segment-2').addEventListener('click', () => startQuizForSegment(2));

        function startQuizForSegment(segmentNumber) {
            const segmentSize = 50;
            const startIndex = (segmentNumber - 1) * segmentSize;
            currentSegmentQuestions = fullCourseQuestions.slice(startIndex, startIndex + segmentSize);
            userAnswers = new Array(currentSegmentQuestions.length).fill(null);
            currentQuestionIndex = 0;
            score = 0;
            
            // Keep track of segment for notification
            document.getElementById('start-segment-1').dataset.segment = segmentNumber;

            showScreen(quizContainer);
            loadQuestion(0);
            // startTimer(); // Your timer function here
        }
    }
});
