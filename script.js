//all the getelementbyid's 
const greeting = document.getElementById('greeting');
const homeScreen = document.getElementById('homeScreen');
const ministryReading = document.getElementById('ministryReading');
const ministryForm = document.getElementById('ministryForm');
const ministryFormPopup = document.getElementById('ministryFormPopup');
const newBookInput = document.getElementById('newBook');
const bookList = document.getElementById('bookList');
const addBook = document.getElementById('addBook');
const fitnessFocusElement = document.getElementById('currentFocus');
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
            }, 250);
        } else {
            updateBookInLocalStorage(name, date, false);
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
        !ministryForm.contains(e.target) &&
        !ministryReading.contains(e.target)
    ) {
        ministryForm.classList.add('hidden');
    }
});


// Show the ministry form when clicking on the container

ministryReading.addEventListener('click', () => {
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

// --- Morning Tasks Logic ---

const morningTasks = [
    "Get out of bed at 6am",
    "Drink water",
    "Exercise",
    "Read ministry"
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
            li.textContent = task;
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
                    }, 250);
                } else {
                    checked = checked.filter(i => i !== idx);
                    localStorage.setItem('morningTasksChecked', JSON.stringify(checked));
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
        localStorage.removeItem('morningTasksChecked');
        loadMorningTasks();
        scheduleMidnightReset();
    }, msUntilMidnight);
}

document.addEventListener('DOMContentLoaded', () => {
    loadMorningTasks();
    scheduleMidnightReset();
});
