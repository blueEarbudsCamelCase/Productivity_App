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
        ministryForm.classList.add('hidden');
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

// Hide the ministry form when clicking outside of it and its container
document.addEventListener('click', (e) => {
    if (
        !ministryForm.contains(e.target) &&
        !ministryReading.contains(e.target)
    ) {
        ministryForm.classList.add('hidden');
    }
});

// Prevent click inside the form from bubbling up and closing it
ministryForm.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Show the ministry form when clicking on the container

ministryReading.addEventListener('click', () => {
    ministryForm.classList.remove('hidden');
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

/* Fitness Focus Notification WORK ON THIS SOON WITH NOTIFICATION API
const today = new Date();
if (today.getDate() === 16) {
    alert('Don’t forget to set your fitness focus for the month!');
}
    */


