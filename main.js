document.addEventListener('DOMContentLoaded', () => {

    // --- 1. UNIVERSAL THEME TOGGLE LOGIC ---
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

    // --- HELPER FUNCTION TO SEND NOTIFICATIONS SECURELY ---
    async function sendNotification(message) {
        if (!navigator.onLine) {
            console.log("Offline: Skipping notification.");
            return;
        }
        try {
            // "Fire-and-forget" fetch call to our Netlify Function
            fetch('/.netlify/functions/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
        } catch (error) {
            console.error("Failed to send notification request:", error);
        }
    }

    // --- 2. LOGIC FOR THE SETUP PAGE (index.html) ---
    const userDetailsForm = document.getElementById('user-details-form');
    if (userDetailsForm) {
        // --- DOM ELEMENTS ---
        const nameInput = document.getElementById('name-input');
        const departmentSelect = document.getElementById('department-select');
        const courseGroup = document.getElementById('course-selection-group');
        const courseSelect = document.getElementById('course-select');
        
        // --- HELPER FUNCTIONS ---
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
            } else { showFormFeedback('department', ''); }

            if (!courseSelect.value) {
                showFormFeedback('course', 'Please select a course.');
                isValid = false;
            } else { showFormFeedback('course', ''); }
            
            return isValid;
        };
        
        // --- EVENT LISTENERS ---
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
                const defaultOption = document.createElement('option');
                defaultOption.value = "";
                defaultOption.textContent = "-- Please choose a course --";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                courseSelect.appendChild(defaultOption);
                
                const uniqueCourses = [...new Set(coursesByDepartment[selectedDepartment])];
                uniqueCourses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course;
                    option.textContent = course;
                    courseSelect.appendChild(option);
                });
                courseGroup.style.display = 'block';
            } else {
                courseGroup.style.display = 'none';
            }
        });

        userDetailsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!validateForm()) return; // Stop if form is not valid
            
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

    // --- 3. LOGIC FOR THE QUIZ PAGE (quiz.html) ---
    const quizHost = document.getElementById('quiz-host');
    if (quizHost) {
        // --- This block only runs on quiz.html ---
        const loadingQuizEl = document.getElementById('loading-quiz');
        const segmentSelectionEl = document.getElementById('segment-selection-quiz');
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        
        // --- Your existing quiz logic variables and functions will go here ---
        // For example:
        // let fullCourseQuestions = [];
        // let currentSegmentQuestions = [];
        // function loadQuestion(index) { ... }
        // function submitQuiz() { ... }
        // etc.
        
        // --- INITIAL PAGE LOAD LOGIC ---
        const params = new URLSearchParams(window.location.search);
        const userName = params.get('name');
        const courseCode = params.get('course');

        if (!userName || !courseCode) {
            alert("Error: Missing user name or course. Redirecting to homepage.");
            window.location.href = 'index.html';
            return; // Stop script execution
        }

        const userInfoDisplay = document.getElementById('user-info-display');
        if (userInfoDisplay) {
            userInfoDisplay.textContent = `User: ${userName} | Course: ${courseCode}`;
        }
        
        // Dynamically load the course data
        const script = document.createElement('script');
        script.src = `courses/${courseCode}.js`;
        
        script.onload = () => {
            if (window.quizData && window.quizData.questions && window.quizData.questions.length > 0) {
                // fullCourseQuestions = window.quizData.questions; // Assign questions
                loadingQuizEl.style.display = 'none';
                segmentSelectionEl.style.display = 'block'; // Show segment selection
            } else {
                loadingQuizEl.innerHTML = `<p style="color:var(--danger-color);">Error: Could not load valid quiz data for ${courseCode}. The file may be empty or incorrect.</p>`;
            }
        };
        
        script.onerror = () => {
             loadingQuizEl.innerHTML = `<p style="color:var(--danger-color);">Error: The course file 'courses/${courseCode}.js' could not be found.</p>`;
        };
        
        document.head.appendChild(script);

        // Add event listeners for the segment buttons
        document.getElementById('start-segment-1')?.addEventListener('click', () => {
            // startQuizForSegment(1); // Call your function to start the quiz
            console.log("Starting Segment 1...");
            segmentSelectionEl.style.display = 'none';
            quizContainer.style.display = 'block'; // Example: Show the quiz container
        });

        document.getElementById('start-segment-2')?.addEventListener('click', () => {
            // startQuizForSegment(2); // Call your function to start the quiz
            console.log("Starting Segment 2...");
            segmentSelectionEl.style.display = 'none';
            quizContainer.style.display = 'block'; // Example: Show the quiz container
        });
    }
});