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

    // Securely sends a notification using our Netlify Function.
    // This function does NOT block the rest of the code from running.
    async function sendNotification(message) {
        if (!navigator.onLine) {
            console.log("Offline: Skipping notification.");
            return;
        }
        try {
            // We use fetch but don't wait for it with 'await'.
            // This is "fire-and-forget".
            fetch('/.netlify/functions/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
            console.log("Notification request sent.");
        } catch (error) {
            console.error("Failed to send notification request:", error);
        }
    }


    // --- 2. LOGIC FOR THE SETUP PAGE (index.html) ---
    const userDetailsForm = document.getElementById('user-details-form');
    if (userDetailsForm) {
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
            courseSelect.innerHTML = '<option value="" disabled selected>-- Choose course --</option>';
            
            if (selectedDepartment && coursesByDepartment[selectedDepartment]) {
                const uniqueCourses = [...new Set(coursesByDepartment[selectedDepartment])];
                uniqueCourses.forEach(course => {
                    courseSelect.innerHTML += `<option value="${course}">${course}</option>`;
                });
                courseGroup.style.display = 'block';
            } else {
                courseGroup.style.display = 'none';
            }
        });

        userDetailsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = nameInput.value.trim();
            const department = departmentSelect.value;
            const course = courseSelect.value;

            // Simple, robust validation
            if (name.length < 2 || !department || !course) {
                alert("Please fill in all fields correctly before starting the quiz.");
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true; 
            submitButton.innerHTML = '<span class="btn-text">Loading...</span><span class="btn-icon">⏳</span>';

            // Prepare notification message
            const notificationMessage = `🔔 New Quiz Taker 🔔\n\nName: ${name}\nDept: ${department}\nCourse: ${course}`;
            
            // Send notification in the background
            sendNotification(notificationMessage);

            // **IMMEDIATELY REDIRECT TO THE QUIZ PAGE**
            const encodedName = encodeURIComponent(name);
            const encodedCourse = encodeURIComponent(course);
            const encodedDepartment = encodeURIComponent(department);
            window.location.href = `quiz.html?name=${encodedName}&course=${encodedCourse}&department=${encodedDepartment}`;
        });
    }


    // --- 3. LOGIC FOR THE QUIZ/RESULTS PAGE (quiz.html) ---
    const quizHost = document.getElementById('quiz-host');
    if (quizHost) {
        // --- State and DOM elements ---
        const loadingQuizEl = document.getElementById('loading-quiz');
        const segmentSelectionEl = document.getElementById('segment-selection-quiz');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        // ... (other DOM elements)
        
        let fullCourseQuestions = [];
        let currentSegmentQuestions = [];
        let userAnswers = [];
        // ... (other state variables)

        // --- Core Functions ---
        const showScreen = (screen) => {
            [loadingQuizEl, segmentSelectionEl, quizContainer, resultsContainer].forEach(el => {
                if(el) el.style.display = 'none';
            });
            if (screen) screen.style.display = 'block';
        }
        
        const startQuizForSegment = (segmentNumber) => {
            const segmentSize = 50;
            const startIndex = (segmentNumber - 1) * segmentSize;
            
            if (fullCourseQuestions.length < startIndex + 1) {
                alert(`Error: Course data is incomplete for Segment ${segmentNumber}.`);
                return;
            }
            
            currentSegmentQuestions = fullCourseQuestions.slice(startIndex, startIndex + segmentSize);
            userAnswers = new Array(currentSegmentQuestions.length).fill(null);
            
            // Save segment number for results notification
            quizHost.dataset.segment = segmentNumber;
            
            showScreen(quizContainer);
            // loadQuestion(0);
            // startTimer();
        };

        const submitQuiz = () => {
            // ... (Your existing submit logic)
            // Inside your submit logic, when sending the result:
            const segmentNumber = quizHost.dataset.segment || 'N/A';
            const resultsMessage = `✅ Quiz Result...\nSegment: ${segmentNumber}\n...`;
            sendNotification(resultsMessage);
            // ... then display results
        }

        // --- Initial Page Load Logic ---
        const params = new URLSearchParams(window.location.search);
        const userName = params.get('name');
        const courseCode = params.get('course');

        if (!userName || !courseCode) {
            alert("Error: Missing user name or course. Redirecting to homepage.");
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('user-info-display').textContent = `User: ${userName} | Course: ${courseCode}`;
        
        // Dynamically load the course script
        const script = document.createElement('script');
        script.src = `courses/${courseCode}.js`;
        
        script.onload = () => {
            if (window.quizData && window.quizData.questions && window.quizData.questions.length > 0) {
                fullCourseQuestions = window.quizData.questions;
                showScreen(segmentSelectionEl);
            } else {
                loadingQuizEl.innerHTML = `<p style="color:var(--danger-color);">Error: Could not load valid quiz data for ${courseCode}. The course file might be empty or formatted incorrectly.</p>`;
            }
        };
        script.onerror = () => {
             loadingQuizEl.innerHTML = `<p style="color:var(--danger-color);">Error: The course file 'courses/${courseCode}.js' could not be found or loaded.</p>`;
        };
        document.head.appendChild(script);

        document.getElementById('start-segment-1')?.addEventListener('click', () => startQuizForSegment(1));
        document.getElementById('start-segment-2')?.addEventListener('click', () => startQuizForSegment(2));
        // ... (all your other event listeners for next, prev, submit, etc.)
    }
});
