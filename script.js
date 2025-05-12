//all the getelementbyid's 
const greeting = document.getElementById('greeting');
const homeScreen = document.getElementById('homeScreen');
const ministryForm = document.getElementById('ministryForm');
const newBookInput = document.getElementById('newBook');
const bookList = document.getElementById('bookList');
const addBook = document.getElementById('addBook');
const fitnessFocusElement = document.getElementById('currentFocus');
const fitnessForm = document.getElementById('fitnessForm');
const newFocusInput = document.getElementById('newFocus');
const setFocusButton = document.getElementById('setFocus');

//functions

// Dynamic Greeting
const currentHour = new Date().getHours();
if (currentHour < 12) {
    greeting.textContent = 'Good Morning!';
} else if (currentHour < 18) {
    greeting.textContent = 'Good Afternoon!';
} else {
    greeting.textContent = 'Were you productive today?';
}

// Load books from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedBooks = JSON.parse(localStorage.getItem('ministryBooks')) || [];
    savedBooks.forEach(book => addBookToList(book.name, book.date, book.checked));
});

// Add a new book
addBook.addEventListener('click', () => {
    const bookName = newBookInput.value.trim();
    if (bookName) {
        const dateAdded = (new Date().toLocaleDateString());
        addBookToList(bookName, dateAdded, false);
        saveBookToLocalStorage(bookName, dateAdded, false);
        newBookInput.value = '';
    }
});

// Add a book to the list and set up its behavior
function addBookToList(name, date, checked) {
    const addedDate = new Date(date);
    const finishByDate = new Date(addedDate);
    finishByDate.setDate(addedDate.getDate() + 5);
    const finishByDateString = finishByDate.toLocaleDateString();

    const listItem = document.createElement('li');
    listItem.textContent = `${name} (Finish by ${finishByDateString})`;
    if (checked) listItem.classList.add('checked');

    // Toggle "checked" state and update localStorage
    listItem.addEventListener('click', () => {
        listItem.classList.toggle('checked');
        if (listItem.classList.contains('checked')) {
            // Add fade-out class
            listItem.classList.add('fade-out');
            // Remove the book from the DOM after the animation
            setTimeout(() => {
                listItem.remove();
                removeBookFromLocalStorage(name, date);
            }, 500); // Match the duration of the fade-out animation
        } else {
            updateBookInLocalStorage(name, date, false);
        }    
    });

    bookList.appendChild(listItem);
}

// Remove a book from localStorage
function removeBookFromLocalStorage(name, date) {
    let books = JSON.parse(localStorage.getItem('ministryBooks')) || [];
    books = books.filter(book => !(book.name === name && book.date === date));
    localStorage.setItem('ministryBooks', JSON.stringify(books));
}

// Save a book to localStorage
function saveBookToLocalStorage(name, date, checked) {
    const books = JSON.parse(localStorage.getItem('ministryBooks')) || [];
    books.push({ name, date, checked });
    localStorage.setItem('ministryBooks', JSON.stringify(books));
}


// Update a book's "checked" state in localStorage
function updateBookInLocalStorage(name, date, checked) {
    let books = JSON.parse(localStorage.getItem('ministryBooks')) || [];
    const bookIndex = books.findIndex(book => book.name === name && book.date === date);
    if (bookIndex !== -1) {
        if (checked) {
            books.splice(bookIndex, 1);
        } else {
            books[bookIndex].checked = checked;
        }
        localStorage.setItem('ministryBooks', JSON.stringify(books));
    }
}

// Load the current fitness focus from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedFocus = localStorage.getItem('fitnessFocus') || 'None';
    fitnessFocusElement.textContent = savedFocus;
});

// Set a new fitness focus
setFocusButton.addEventListener('click', () => {
    const newFocus = newFocusInput.value.trim();
    console.log('New Focus:', newFocus); // Debugging: Log the input value
    if (newFocus) {
        fitnessFocusElement.textContent = newFocus;
        localStorage.setItem('fitnessFocus', newFocus);
        newFocusInput.value = '';
    } else {
        console.log('Error: No focus set');
    }
});

// Fitness Focus Notification 
const today = new Date();
if (today.getDate() === 1) {
    alert('Don’t forget to set your fitness focus for the month!');
}


//TIMER CODE

let wakeLock = null;
let timerInterval = null;

const prepTimeInput = document.getElementById('prepTime');
const setsInput = document.getElementById('sets');
const activeTimeInput = document.getElementById('activeTime');
const restTimeInput = document.getElementById('restTime');
const manualModeCheckbox = document.getElementById('manualMode');
const startTimerButton = document.getElementById('startTimer');
const timerDisplay = document.getElementById('timerDisplay');
const timerPhase = document.getElementById('timerPhase');
const timerCountdown = document.getElementById('timerCountdown');
const markDoneButton = document.getElementById('markDone');

startTimerButton.addEventListener('click', () => {
    const prepTime = parseInt(prepTimeInput.value, 10);
    const sets = parseInt(setsInput.value, 10);
    const activeTime = parseInt(activeTimeInput.value, 10);
    const restTime = parseInt(restTimeInput.value, 10);
    const manualMode = manualModeCheckbox.checked;

    startIntervalTimer(prepTime, sets, activeTime, restTime, manualMode);
});

async function startIntervalTimer(prepTime, sets, activeTime, restTime, manualMode) {
    // Request Wake Lock to keep the screen on
    try {
        wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
        console.error('Wake Lock failed:', err);
    }

    let currentSet = 0;
    let phase = 'prep'; // 'prep', 'active', 'rest'
    let timeLeft = prepTime;

    timerDisplay.style.display = 'block';
    markDoneButton.style.display = manualMode ? 'block' : 'none';

    function playSound() {
        const audio = new Audio('beep.mp3'); // Add a beep sound file in your project
        audio.play();
    }

    function updateTimerDisplay() {
        timerPhase.textContent = phase === 'prep' ? 'Preparation' :
                                 phase === 'active' ? `Set ${currentSet} - Active` :
                                 phase === 'rest' ? `Set ${currentSet} - Rest` : '';
        timerCountdown.textContent = timeLeft;
    }

    function nextPhase() {
        if (phase === 'prep') {
            phase = 'active';
            timeLeft = manualMode ? 0 : activeTime;
            currentSet++;
        } else if (phase === 'active') {
            if (manualMode) {
                if (currentSet < sets) {
                    phase = 'rest';
                    timeLeft = restTime;
                } else {
                    endTimer();
                }
            } else {
                if (currentSet < sets) {
                    phase = 'rest';
                    timeLeft = restTime;
                } else {
                    endTimer();
                }
            }
        } else if (phase === 'rest') {
            phase = 'active';
            timeLeft = manualMode ? 0 : activeTime;
            currentSet++;
        }
        playSound();
        updateTimerDisplay();
    }

    function endTimer() {
        clearInterval(timerInterval);
        timerPhase.textContent = 'Done!';
        timerCountdown.textContent = '';
        if (wakeLock) wakeLock.release().then(() => (wakeLock = null));
    }

    updateTimerDisplay();
    playSound();

    if (!manualMode) {
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                nextPhase();
            }
            updateTimerDisplay();
        }, 1000);
    }

    markDoneButton.addEventListener('click', () => {
        if (phase === 'active') {
            nextPhase();
        }
    });
}