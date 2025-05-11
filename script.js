//all the getelementbyid's 
const homeScreen = document.getElementById('homeScreen');
const ministryForm = document.getElementById('ministryForm');
const newBookInput = document.getElementById('newBook');
const bookList = document.getElementById('bookList');
const greeting = document.getElementById('greeting');
const addBook = document.getElementById('addBook');

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


// Fitness Focus Notification (Placeholder)
const today = new Date();
if (today.getDate() === 1) {
    alert('Don’t forget to set your fitness focus for the month!');
}