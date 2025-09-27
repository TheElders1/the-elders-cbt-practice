document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('study-notes-page')) return;

    // Get user data
    const userData = JSON.parse(localStorage.getItem('eldersUserData') || '{}');
    const currentUser = userData.currentUser ? userData.users[userData.currentUser] : null;

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize user study data if not exists
    if (!currentUser.studyNotes) currentUser.studyNotes = [];
    if (!currentUser.bookmarkedQuestions) currentUser.bookmarkedQuestions = [];
    if (!currentUser.flashcards) currentUser.flashcards = [];

    // DOM Elements
    const notesContainer = document.getElementById('notes-container');
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const flashcardsContainer = document.getElementById('flashcards-container');
    const notesFilter = document.getElementById('notes-filter');
    const bookmarksFilter = document.getElementById('bookmarks-filter');
    const addNoteBtn = document.getElementById('add-note-btn');
    const addNoteModal = document.getElementById('add-note-modal');
    const addNoteForm = document.getElementById('add-note-form');
    const noteCourseSelect = document.getElementById('note-course');

    // Initialize
    populateCourseFilters();
    displayNotes();
    displayBookmarks();
    displayFlashcards();
    setupEventListeners();

    function populateCourseFilters() {
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
        
        // Populate filters and note course select
        [notesFilter, bookmarksFilter, noteCourseSelect].forEach(select => {
            if (select === noteCourseSelect) {
                // Skip "All Courses" option for note course select
                courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.code;
                    option.textContent = `${course.code} - ${course.name}`;
                    select.appendChild(option);
                });
            } else {
                courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.code;
                    option.textContent = course.code;
                    select.appendChild(option);
                });
            }
        });
    }

    function setupEventListeners() {
        addNoteBtn.addEventListener('click', () => openModal('add-note-modal'));
        addNoteForm.addEventListener('submit', handleAddNote);
        notesFilter.addEventListener('change', displayNotes);
        bookmarksFilter.addEventListener('change', displayBookmarks);
        
        document.getElementById('create-flashcards-btn').addEventListener('click', createFlashcardsFromBookmarks);
        document.getElementById('study-flashcards-btn').addEventListener('click', startFlashcardStudy);
        document.getElementById('practice-bookmarks-btn').addEventListener('click', practiceBookmarkedQuestions);

        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                closeModal(modal.id);
            });
        });

        // Flashcard controls
        document.getElementById('flip-flashcard').addEventListener('click', flipCurrentFlashcard);
        document.getElementById('prev-flashcard').addEventListener('click', () => navigateFlashcard(-1));
        document.getElementById('next-flashcard').addEventListener('click', () => navigateFlashcard(1));
        document.getElementById('know-it').addEventListener('click', () => markFlashcard('known'));
        document.getElementById('study-more').addEventListener('click', () => markFlashcard('study'));
    }

    function handleAddNote(e) {
        e.preventDefault();
        
        const noteData = {
            id: Date.now(),
            course: document.getElementById('note-course').value,
            topic: document.getElementById('note-topic').value,
            title: document.getElementById('note-title').value,
            content: document.getElementById('note-content').value,
            tags: document.getElementById('note-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        currentUser.studyNotes.push(noteData);
        saveUserData();
        displayNotes();
        closeModal('add-note-modal');
        addNoteForm.reset();
        
        showNotification('📝 Study note added successfully!');
    }

    function displayNotes() {
        const filter = notesFilter.value;
        const filteredNotes = filter === 'all' ? 
            currentUser.studyNotes : 
            currentUser.studyNotes.filter(note => note.course === filter);

        if (filteredNotes.length === 0) {
            notesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No Study Notes</h3>
                    <p>Create your first study note to get started!</p>
                </div>
            `;
            return;
        }

        notesContainer.innerHTML = '';
        filteredNotes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.className = 'note-card';
            noteEl.innerHTML = `
                <div class="note-header">
                    <div class="note-course-badge">${note.course}</div>
                    <div class="note-actions">
                        <button onclick="editNote('${note.id}')" class="icon-btn">✏️</button>
                        <button onclick="deleteNote('${note.id}')" class="icon-btn danger">🗑️</button>
                    </div>
                </div>
                <div class="note-content">
                    <h4>${note.title}</h4>
                    <div class="note-topic">📚 ${note.topic}</div>
                    <div class="note-text">${note.content}</div>
                    ${note.tags.length > 0 ? `
                        <div class="note-tags">
                            ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="note-footer">
                    <small>Created: ${new Date(note.createdAt).toLocaleDateString()}</small>
                </div>
            `;
            notesContainer.appendChild(noteEl);
        });
    }

    function displayBookmarks() {
        const filter = bookmarksFilter.value;
        const filteredBookmarks = filter === 'all' ? 
            currentUser.bookmarkedQuestions : 
            currentUser.bookmarkedQuestions.filter(bookmark => bookmark.course === filter);

        if (filteredBookmarks.length === 0) {
            bookmarksContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔖</div>
                    <h3>No Bookmarked Questions</h3>
                    <p>Bookmark questions during quizzes to review them later!</p>
                </div>
            `;
            return;
        }

        bookmarksContainer.innerHTML = '';
        filteredBookmarks.forEach(bookmark => {
            const bookmarkEl = document.createElement('div');
            bookmarkEl.className = 'bookmark-card';
            bookmarkEl.innerHTML = `
                <div class="bookmark-header">
                    <div class="bookmark-course-badge">${bookmark.course}</div>
                    <button onclick="removeBookmark('${bookmark.id}')" class="icon-btn danger">🗑️</button>
                </div>
                <div class="bookmark-content">
                    <div class="bookmark-question">${bookmark.question}</div>
                    <div class="bookmark-answer">
                        <strong>Answer:</strong> ${bookmark.answer}
                    </div>
                    ${bookmark.explanation ? `
                        <div class="bookmark-explanation">
                            <strong>Explanation:</strong> ${bookmark.explanation}
                        </div>
                    ` : ''}
                </div>
                <div class="bookmark-footer">
                    <small>Bookmarked: ${new Date(bookmark.bookmarkedAt).toLocaleDateString()}</small>
                </div>
            `;
            bookmarksContainer.appendChild(bookmarkEl);
        });
    }

    function displayFlashcards() {
        if (currentUser.flashcards.length === 0) {
            flashcardsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🃏</div>
                    <h3>No Flashcards</h3>
                    <p>Create flashcards from your bookmarked questions!</p>
                </div>
            `;
            return;
        }

        flashcardsContainer.innerHTML = '';
        const flashcardSets = groupFlashcardsByCourse();
        
        Object.keys(flashcardSets).forEach(course => {
            const setEl = document.createElement('div');
            setEl.className = 'flashcard-set';
            setEl.innerHTML = `
                <div class="flashcard-set-header">
                    <h4>${course}</h4>
                    <span class="flashcard-count">${flashcardSets[course].length} cards</span>
                </div>
                <div class="flashcard-set-actions">
                    <button onclick="studyFlashcardSet('${course}')" class="segment-btn">Study Set</button>
                    <button onclick="deleteFlashcardSet('${course}')" class="nav-btn danger">Delete Set</button>
                </div>
            `;
            flashcardsContainer.appendChild(setEl);
        });
    }

    function createFlashcardsFromBookmarks() {
        if (currentUser.bookmarkedQuestions.length === 0) {
            showNotification('❌ No bookmarked questions to create flashcards from!');
            return;
        }

        const flashcards = currentUser.bookmarkedQuestions.map(bookmark => ({
            id: `flashcard_${bookmark.id}`,
            course: bookmark.course,
            question: bookmark.question,
            answer: bookmark.answer,
            explanation: bookmark.explanation,
            createdAt: new Date().toISOString(),
            studyCount: 0,
            lastStudied: null,
            difficulty: 'medium'
        }));

        currentUser.flashcards = [...currentUser.flashcards, ...flashcards];
        saveUserData();
        displayFlashcards();
        showNotification(`✨ Created ${flashcards.length} flashcards from bookmarks!`);
    }

    function groupFlashcardsByCourse() {
        const groups = {};
        currentUser.flashcards.forEach(card => {
            if (!groups[card.course]) groups[card.course] = [];
            groups[card.course].push(card);
        });
        return groups;
    }

    let currentFlashcardSet = [];
    let currentFlashcardIndex = 0;

    function startFlashcardStudy() {
        if (currentUser.flashcards.length === 0) {
            showNotification('❌ No flashcards available for study!');
            return;
        }

        currentFlashcardSet = [...currentUser.flashcards];
        currentFlashcardIndex = 0;
        shuffleArray(currentFlashcardSet);
        
        openModal('flashcard-study-modal');
        displayCurrentFlashcard();
    }

    function studyFlashcardSet(course) {
        currentFlashcardSet = currentUser.flashcards.filter(card => card.course === course);
        currentFlashcardIndex = 0;
        shuffleArray(currentFlashcardSet);
        
        openModal('flashcard-study-modal');
        displayCurrentFlashcard();
    }

    function displayCurrentFlashcard() {
        if (currentFlashcardSet.length === 0) return;

        const card = currentFlashcardSet[currentFlashcardIndex];
        document.getElementById('flashcard-current').textContent = currentFlashcardIndex + 1;
        document.getElementById('flashcard-total').textContent = currentFlashcardSet.length;
        document.getElementById('flashcard-question').textContent = card.question;
        document.getElementById('flashcard-answer').textContent = card.answer;
        
        // Reset card to front
        document.querySelector('.flashcard-front').style.display = 'block';
        document.querySelector('.flashcard-back').style.display = 'none';
        document.getElementById('flip-flashcard').textContent = 'Flip Card';
    }

    function flipCurrentFlashcard() {
        const front = document.querySelector('.flashcard-front');
        const back = document.querySelector('.flashcard-back');
        const flipBtn = document.getElementById('flip-flashcard');
        
        if (front.style.display !== 'none') {
            front.style.display = 'none';
            back.style.display = 'block';
            flipBtn.textContent = 'Show Question';
        } else {
            front.style.display = 'block';
            back.style.display = 'none';
            flipBtn.textContent = 'Flip Card';
        }
    }

    function navigateFlashcard(direction) {
        currentFlashcardIndex += direction;
        
        if (currentFlashcardIndex < 0) {
            currentFlashcardIndex = currentFlashcardSet.length - 1;
        } else if (currentFlashcardIndex >= currentFlashcardSet.length) {
            currentFlashcardIndex = 0;
        }
        
        displayCurrentFlashcard();
    }

    function markFlashcard(type) {
        const card = currentFlashcardSet[currentFlashcardIndex];
        card.lastStudied = new Date().toISOString();
        card.studyCount++;
        
        if (type === 'known') {
            card.difficulty = 'easy';
        } else {
            card.difficulty = 'hard';
        }
        
        saveUserData();
        navigateFlashcard(1);
    }

    function practiceBookmarkedQuestions() {
        if (currentUser.bookmarkedQuestions.length === 0) {
            showNotification('❌ No bookmarked questions to practice!');
            return;
        }

        // Create a custom quiz from bookmarked questions
        const customQuizData = {
            title: 'Bookmarked Questions Practice',
            questions: currentUser.bookmarkedQuestions.map(bookmark => ({
                question: bookmark.question,
                options: bookmark.options || ['True', 'False'], // Fallback options
                answer: bookmark.answer,
                explanation: bookmark.explanation,
                topic: 'Bookmarked',
                difficulty: 'medium'
            })),
            settings: {
                timeLimit: 30 * 60, // 30 minutes
                showExplanations: true,
                isCustomQuiz: true,
                isBookmarkPractice: true
            }
        };

        localStorage.setItem('customQuizData', JSON.stringify(customQuizData));
        
        const encodedName = encodeURIComponent(currentUser.name);
        const encodedDepartment = encodeURIComponent(currentUser.department);
        
        window.location.href = `quiz.html?name=${encodedName}&course=BOOKMARKS&department=${encodedDepartment}&custom=true`;
    }

    // Global functions for onclick handlers
    window.editNote = function(noteId) {
        const note = currentUser.studyNotes.find(n => n.id == noteId);
        if (!note) return;

        // Populate form with existing data
        document.getElementById('note-course').value = note.course;
        document.getElementById('note-topic').value = note.topic;
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-tags').value = note.tags.join(', ');

        // Change form to edit mode
        addNoteForm.dataset.editId = noteId;
        document.querySelector('#add-note-modal h3').textContent = '✏️ Edit Study Note';
        
        openModal('add-note-modal');
    };

    window.deleteNote = function(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            currentUser.studyNotes = currentUser.studyNotes.filter(n => n.id != noteId);
            saveUserData();
            displayNotes();
            showNotification('🗑️ Note deleted successfully!');
        }
    };

    window.removeBookmark = function(bookmarkId) {
        if (confirm('Remove this bookmarked question?')) {
            currentUser.bookmarkedQuestions = currentUser.bookmarkedQuestions.filter(b => b.id != bookmarkId);
            saveUserData();
            displayBookmarks();
            showNotification('🗑️ Bookmark removed!');
        }
    };

    window.deleteFlashcardSet = function(course) {
        if (confirm(`Delete all flashcards for ${course}?`)) {
            currentUser.flashcards = currentUser.flashcards.filter(card => card.course !== course);
            saveUserData();
            displayFlashcards();
            showNotification('🗑️ Flashcard set deleted!');
        }
    };

    window.studyFlashcardSet = studyFlashcardSet;

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
        
        // Reset edit mode
        if (modalId === 'add-note-modal') {
            addNoteForm.removeAttribute('data-edit-id');
            document.querySelector('#add-note-modal h3').textContent = '📝 Add Study Note';
            addNoteForm.reset();
        }
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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});