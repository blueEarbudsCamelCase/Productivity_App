

//all the getelementbyid's
const greeting = document.getElementById('greeting');
const homeScreen = document.getElementById('homeScreen');
const ministryReading = document.getElementById('ministryReading');
const ministryForm = document.getElementById('ministryForm');
const ministryFormPopup = document.getElementById('ministryFormPopup');
const ministryHeader = document.getElementById('ministryHeader');
const newBookInput = document.getElementById('newBook');
const bookList = document.getElementById('bookList');
const addBook = document.getElementById('addBook');
const fitnessForm = document.getElementById('fitnessForm');
const newFocusInput = document.getElementById('newFocus');
const setFocusButton = document.getElementById('setFocus');
const currentFocus = document.getElementById("currentFocus");
const fitnessFormPopup = document.getElementById("fitnessFormPopup");
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

// Add a new book
addBook.addEventListener('click', () => {
    const bookName = newBookInput.value.trim();
    if (bookName) {
        const dateAdded = (new Date().toLocaleDateString());
        addBookToList(bookName, dateAdded, false);
        saveBookToLocalStorage(bookName, dateAdded, false);
        newBookInput.value = '';
        ministryFormPopup.classList.add('hidden');
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

        // --- Highlight overdue books ---
    const today = new Date();
    // Remove time for accurate date-only comparison
    today.setHours(0,0,0,0);
    finishByDate.setHours(0,0,0,0);
    if (finishByDate <= today && !checked) {
        listItem.classList.add('overdue');
    }
    // --- End highlight ---

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
           // Show "All Done!" if no books left
                if (bookList.querySelectorAll('li').length === 0) {
                    bookList.innerHTML = '<li class="all-done">All Done!</li>';
                }
                updateStreak();
            }, 250);
        } else {
            updateBookInLocalStorage(name, date, false);
            updateStreak();
        }    
    });

// Remove "All Done!" if present
    if (bookList.querySelector('.all-done')) {
        bookList.innerHTML = '';
    }
    bookList.appendChild(listItem);
}

// Also, after loading books on page load:
document.addEventListener('DOMContentLoaded', () => {
    const savedBooks = JSON.parse(localStorage.getItem('ministryBooks')) || [];
    if (savedBooks.length === 0) {
        bookList.innerHTML = '<li class="all-done">All Done!</li>';
    } else {
        savedBooks.forEach(book => addBookToList(book.name, book.date, book.checked));
    }
});

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

// Hide the ministry form when clicking outside of it and its container
document.addEventListener('click', (e) => {
    if (
        !ministryFormPopup.contains(e.target) &&
        !ministryReading.contains(e.target)
    ) {
        ministryFormPopup.classList.add('hidden');
    }
});


// Show the ministry form when clicking on the container

ministryHeader.addEventListener('click', () => {
    ministryFormPopup.classList.remove('hidden');
    newBookInput.focus();
});

// Load saved focus
  const savedFocus = localStorage.getItem("fitnessFocus");
  if (savedFocus) {
    currentFocus.textContent = savedFocus;
  }

  // Show form when clicking on the focus text
  currentFocus.parentElement.addEventListener("click", () => {
    fitnessFormPopup.classList.remove("hidden");
    newFocusInput.value = currentFocus.textContent !== "None" ? currentFocus.textContent : "";
    newFocusInput.focus();
  });

  // Set new focus and hide form
  setFocusButton.addEventListener("click", () => {
    const newFocus = newFocusInput.value.trim() || "None";
    currentFocus.textContent = newFocus;
    localStorage.setItem("fitnessFocus", newFocus);
    fitnessFormPopup.classList.add("hidden");
  });

  // Optional: Hide form when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !fitnessFormPopup.contains(e.target) &&
      !currentFocus.parentElement.contains(e.target)
    ) {
      fitnessFormPopup.classList.add("hidden");
    }
  });

// --- Streak Logic ---

function getTodayKey() {
    const today = new Date();
    return today.toISOString().slice(0, 10); // YYYY-MM-DD
}
// Modified: Store the date when morning tasks were last checked
function resetMorningTasksIfNewDay() {
    const todayKey = getTodayKey();
    const lastTasksDate = localStorage.getItem('morningTasksDate');
    if (lastTasksDate !== todayKey) {
        localStorage.removeItem('morningTasksChecked');
        localStorage.setItem('morningTasksDate', todayKey);
    }
}

function checkAndResetStreakOnLoad() {
    const todayKey = getTodayKey();
    const lastChecked = localStorage.getItem('lastStreakChecked');
    const lastTasksDate = localStorage.getItem('morningTasksDate');
    // If the last streak check or morning tasks date is not today, and yesterday wasn't completed, reset streak
    if (lastChecked !== todayKey && lastTasksDate !== todayKey) {
        if (!areAllMorningTasksCompleted() || areBooksOverdue()) {
            localStorage.setItem('streak', 0);
        }
        resetMorningTasksIfNewDay();
    }
}

function areAllMorningTasksCompleted() {
    const checkedTasks = JSON.parse(localStorage.getItem('morningTasksChecked')) || [];
    return checkedTasks.length === morningTasks.length;
}

function areBooksOverdue() {
    const books = JSON.parse(localStorage.getItem('ministryBooks')) || [];
    const today = new Date();
    today.setHours(0,0,0,0);
    return books.some(book => {
        const addedDate = new Date(book.date);
        const finishByDate = new Date(addedDate);
        finishByDate.setDate(addedDate.getDate() + 5);
        finishByDate.setHours(0,0,0,0);
        return !book.checked && finishByDate <= today;
    });
}

function updateStreak() {
    const todayKey = getTodayKey();
    const lastChecked = localStorage.getItem('lastStreakChecked');
    let streak = Number(localStorage.getItem('streak')) || 0;
    const streakNumberElem = document.getElementById('streakNumber');
    let prevStreak = Number(streakNumberElem.textContent);


    if (lastChecked !== todayKey && areAllMorningTasksCompleted() && !areBooksOverdue()) {
        streak += 1;
        localStorage.setItem('lastStreakChecked', todayKey);
        localStorage.setItem('streak', streak);
    }
    streakNumberElem.textContent = streak;

    // Animate if streak increased
    if (streak > prevStreak) {
        streakNumberElem.classList.remove('streak-pop');
        void streakNumberElem.offsetWidth; // trigger reflow
        streakNumberElem.classList.add('streak-pop');
    }

    // Toggle streak container style
    const streakContainer = document.getElementById('streak');
    if (streak > 0) {
        streakContainer.classList.add('active-streak');
    } else {
        streakContainer.classList.remove('active-streak');
    }
}

// --- End Streak Logic ---

// --- Morning Tasks Logic ---

const morningTasks = [
  { id: 'wakeUp', label: 'Get out of bed at 6am' },
  { id: 'drinkWater', label: 'Drink water' },
  { id: 'exercise', label: 'Exercise' },
  { id: 'readMinistry', label: 'Read ministry' },
  { id: 'bibleReading', label: 'Read the Bible' }
];

// Load checked state from localStorage
function loadMorningTasks() {
    const checkedTasks = JSON.parse(localStorage.getItem('morningTasksChecked')) || [];
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    let hasTasks = false;
    morningTasks.forEach((task, idx) => {
        if (!checkedTasks.includes(idx)) {
            hasTasks = true;
            const li = document.createElement('li');
            li.textContent = task.label;
            li.addEventListener('click', () => {
                li.classList.toggle('checked');
                let checked = JSON.parse(localStorage.getItem('morningTasksChecked')) || [];
                if (li.classList.contains('checked')) {
                    li.classList.add('fade-out');
                    checked.push(idx);
                    localStorage.setItem('morningTasksChecked', JSON.stringify([...new Set(checked)]));
                    setTimeout(() => {
                        li.remove();
                        // Show "All Done!" if no tasks left
                        if (tasksList.querySelectorAll('li').length === 0) {
                            tasksList.innerHTML = '<li class="all-done">All Done!</li>';
                        }
                        updateStreak();
                    }, 250);
                } else {
                    checked = checked.filter(i => i !== idx);
                    localStorage.setItem('morningTasksChecked', JSON.stringify(checked));
                    updateStreak();
                }
            });
            tasksList.appendChild(li);
        }
    });
    if (!hasTasks) {
        tasksList.innerHTML = '<li class="all-done">All Done!</li>';
    }
}

// Reset tasks at midnight
function scheduleMidnightReset() {
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
    setTimeout(() => {
        // If yesterday wasn't completed, reset streak
        const todayKey = getTodayKey();
        const lastChecked = localStorage.getItem('lastStreakChecked');
        // Only reset streak if yesterday wasn't completed
        if (lastChecked !== todayKey && (!areAllMorningTasksCompleted() || areBooksOverdue())) {
            localStorage.setItem('streak', 0);
        }
        resetMorningTasksIfNewDay();
        loadMorningTasks();
        const streak = Number(localStorage.getItem('streak')) || 0;
        document.getElementById('streakNumber').textContent = streak;
        const streakContainer = document.getElementById('streak');
        if (streak > 0) {
            streakContainer.classList.add('active-streak');
        } else {
            streakContainer.classList.remove('active-streak');
        }
        scheduleMidnightReset();
    }, msUntilMidnight);
}

document.addEventListener('DOMContentLoaded', () => {
    checkAndResetStreakOnLoad();
    resetMorningTasksIfNewDay();
    loadMorningTasks();
    scheduleMidnightReset();
    document.getElementById('streakNumber').textContent = localStorage.getItem('streak') || 0;
        // Toggle streak container style on load
    const streak = Number(localStorage.getItem('streak')) || 0;
    const streakContainer = document.getElementById('streak');
    if (streak > 0) {
        streakContainer.classList.add('active-streak');
    } else {
        streakContainer.classList.remove('active-streak');
    }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => {
      console.log('Service Worker registered!', reg);
    })
    .catch(err => {
      console.error('Service Worker registration failed:', err);
    });
}

// Request notification permission and subscribe to push
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.ready.then(async function(registration) {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return;
    }

    // Subscribe to push
    const subscribeOptions = {
      userVisibleOnly: true,
      // Replace with your own VAPID public key (Base64 URL-encoded)
      applicationServerKey: urlBase64ToUint8Array('BBH5938c6QK4fyh3hLgv49I_bcHuVwF0_Ktkg_Z2A1jCjmp0Z94t3JkJp2xx-SrwIRJ4s6cvGLRs6nrvBqWQkNg')
    };

    try {
      const subscription = await registration.pushManager.subscribe(subscribeOptions);
      console.log('Push subscription:', JSON.stringify(subscription));
      // After successful subscription
        await fetch('/save-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(subscription)
});
    } catch (err) {
      console.error('Push subscription failed:', err);
    }
  });
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}