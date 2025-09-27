document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('quiz-builder-page')) return;

    // Get user data
    const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
    const currentUser = userData.currentUser ? userData.users[userData.currentUser] : null;

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // DOM Elements
    const courseSelect = document.getElementById('course-select');
    const topicsSection = document.getElementById('topics-section');
    const topicsList = document.getElementById('topics-list');
    const difficultySection = document.getElementById('difficulty-section');
    const quizSettings = document.getElementById('quiz-settings');
    const questionCountSlider = document.getElementById('question-count');
    const questionCountDisplay = document.getElementById('question-count-display');
    const timeLimitSlider = document.getElementById('time-limit');
    const timeLimitDisplay = document.getElementById('time-limit-display');
    const previewBtn = document.getElementById('preview-quiz-btn');
    const startQuizBtn = document.getElementById('start-custom-quiz-btn');
    const previewEmpty = document.getElementById('quiz-preview-empty');
    const previewContent = document.getElementById('quiz-preview-content');
    const previewQuestionsList = document.getElementById('preview-questions-list');

    // State
    let currentCourseData = null;
    let availableQuestions = [];
    let filteredQuestions = [];

    // Initialize
    populateCourseSelection();
    setupEventListeners();

    function populateCourseSelection() {
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
            courseSelect.appendChild(option);
        });
    }

    function setupEventListeners() {
        courseSelect.addEventListener('change', loadCourseData);
        
        questionCountSlider.addEventListener('input', () => {
            questionCountDisplay.textContent = questionCountSlider.value;
            updatePreview();
        });
        
        timeLimitSlider.addEventListener('input', () => {
            timeLimitDisplay.textContent = timeLimitSlider.value;
        });

        // Topic and difficulty change listeners
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && (e.target.closest('#topics-list') || e.target.closest('.checkbox-group'))) {
                updatePreview();
            }
        });

        previewBtn.addEventListener('click', updatePreview);
        startQuizBtn.addEventListener('click', startCustomQuiz);
    }

    async function loadCourseData() {
        const courseCode = courseSelect.value;
        if (!courseCode) return;

        try {
            // Load course data
            const script = document.createElement('script');
            script.src = `courses/${courseCode}.js`;
            
            script.onload = () => {
                if (window.quizData?.questions?.length > 0) {
                    currentCourseData = window.quizData;
                    availableQuestions = [...currentCourseData.questions];
                    
                    // Add default properties if missing
                    availableQuestions = availableQuestions.map((q, index) => ({
                        ...q,
                        id: q.id || `q_${index}`,
                        difficulty: q.difficulty || getRandomDifficulty(),
                        topic: q.topic || getRandomTopic(index),
                        explanation: q.explanation || "Explanation not available for this question.",
                        tags: q.tags || []
                    }));

                    populateTopics();
                    showSections();
                    updatePreview();
                } else {
                    showError('No questions available for this course.');
                }
            };
            
            script.onerror = () => {
                showError('Course data could not be loaded.');
            };
            
            document.head.appendChild(script);
        } catch (error) {
            showError('Error loading course data.');
        }
    }

    function getRandomDifficulty() {
        const difficulties = ['easy', 'medium', 'hard'];
        return difficulties[Math.floor(Math.random() * difficulties.length)];
    }

    function getRandomTopic(index) {
        const topics = ['Fundamentals', 'Advanced Concepts', 'Applications', 'Theory', 'Practice'];
        return topics[index % topics.length];
    }

    function populateTopics() {
        const topics = [...new Set(availableQuestions.map(q => q.topic))];
        topicsList.innerHTML = '';
        
        topics.forEach(topic => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';
            label.innerHTML = `
                <input type="checkbox" value="${topic}" checked> ${topic}
            `;
            topicsList.appendChild(label);
        });
    }

    function showSections() {
        topicsSection.style.display = 'block';
        difficultySection.style.display = 'block';
        quizSettings.style.display = 'block';
    }

    function updatePreview() {
        if (!availableQuestions.length) return;

        const selectedTopics = Array.from(document.querySelectorAll('#topics-list input:checked')).map(cb => cb.value);
        const selectedDifficulties = Array.from(document.querySelectorAll('#difficulty-section input:checked')).map(cb => cb.value);
        const questionCount = parseInt(questionCountSlider.value);
        const focusWeakAreas = document.getElementById('focus-weak-areas').checked;

        // Filter questions
        filteredQuestions = availableQuestions.filter(q => 
            selectedTopics.includes(q.topic) && 
            selectedDifficulties.includes(q.difficulty)
        );

        // Add weak area focus
        if (focusWeakAreas && currentUser.weakAreas) {
            const courseCode = courseSelect.value;
            const weakQuestions = [];
            
            if (currentUser.weakAreas[courseCode]) {
                Object.values(currentUser.weakAreas[courseCode]).forEach(weakQ => {
                    const matchingQuestion = filteredQuestions.find(q => 
                        q.question.includes(weakQ.question.substring(0, 50))
                    );
                    if (matchingQuestion) {
                        weakQuestions.push(matchingQuestion);
                    }
                });
            }

            // Prioritize weak questions (up to 40% of quiz)
            const weakCount = Math.min(weakQuestions.length, Math.floor(questionCount * 0.4));
            const regularQuestions = filteredQuestions.filter(q => !weakQuestions.includes(q));
            
            filteredQuestions = [
                ...weakQuestions.slice(0, weakCount),
                ...regularQuestions.slice(0, questionCount - weakCount)
            ];
        }

        // Shuffle if enabled
        if (document.getElementById('shuffle-questions').checked) {
            shuffleArray(filteredQuestions);
        }

        // Limit to requested count
        filteredQuestions = filteredQuestions.slice(0, questionCount);

        displayPreview();
        updateButtons();
    }

    function displayPreview() {
        if (filteredQuestions.length === 0) {
            previewEmpty.style.display = 'block';
            previewContent.style.display = 'none';
            return;
        }

        previewEmpty.style.display = 'none';
        previewContent.style.display = 'block';

        // Update stats
        const topics = [...new Set(filteredQuestions.map(q => q.topic))];
        const difficulties = [...new Set(filteredQuestions.map(q => q.difficulty))];
        
        document.getElementById('preview-question-count').textContent = `${filteredQuestions.length} questions`;
        document.getElementById('preview-topics').textContent = `${topics.length} topics`;
        document.getElementById('preview-difficulty').textContent = difficulties.join(', ');

        // Show sample questions
        previewQuestionsList.innerHTML = '';
        const sampleQuestions = filteredQuestions.slice(0, 5);
        
        sampleQuestions.forEach((q, index) => {
            const questionEl = document.createElement('div');
            questionEl.className = 'preview-question';
            questionEl.innerHTML = `
                <div class="preview-question-header">
                    <span class="question-number">Q${index + 1}</span>
                    <span class="question-topic">${q.topic}</span>
                    <span class="question-difficulty difficulty-${q.difficulty}">${q.difficulty}</span>
                </div>
                <div class="preview-question-text">${q.question}</div>
            `;
            previewQuestionsList.appendChild(questionEl);
        });

        if (filteredQuestions.length > 5) {
            const moreEl = document.createElement('div');
            moreEl.className = 'preview-more';
            moreEl.textContent = `... and ${filteredQuestions.length - 5} more questions`;
            previewQuestionsList.appendChild(moreEl);
        }
    }

    function updateButtons() {
        const hasQuestions = filteredQuestions.length > 0;
        previewBtn.disabled = !hasQuestions;
        startQuizBtn.disabled = !hasQuestions;
    }

    function startCustomQuiz() {
        if (filteredQuestions.length === 0) return;

        // Store custom quiz data
        const customQuizData = {
            title: `Custom Quiz - ${courseSelect.options[courseSelect.selectedIndex].text}`,
            questions: filteredQuestions,
            settings: {
                timeLimit: parseInt(timeLimitSlider.value) * 60, // Convert to seconds
                showExplanations: document.getElementById('show-explanations').checked,
                isCustomQuiz: true
            }
        };

        localStorage.setItem('customQuizData', JSON.stringify(customQuizData));

        // Navigate to quiz page with custom flag
        const encodedName = encodeURIComponent(currentUser.name);
        const encodedCourse = encodeURIComponent(courseSelect.value);
        const encodedDepartment = encodeURIComponent(currentUser.department);
        
        window.location.href = `quiz.html?name=${encodedName}&course=${encodedCourse}&department=${encodedDepartment}&custom=true`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showError(message) {
        previewEmpty.innerHTML = `
            <div class="error-icon">⚠️</div>
            <h3>Error</h3>
            <p>${message}</p>
        `;
        previewEmpty.style.display = 'block';
        previewContent.style.display = 'none';
    }
});