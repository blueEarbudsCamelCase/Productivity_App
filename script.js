//all the getelementbyid's 
const homeScreen = document.getElementById('homeScreen');
const ministryForm = document.getElementById('ministryForm');
const newBookInput = document.getElementById('newBook');
const bookList = document.getElementById('bookList');
const greeting = document.getElementById('greeting');
const addBook = document.getElementById('addBook');
//buttons variable definitions

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
        const dateAdded = new Date().toLocaleDateString();
        addBookToList(bookName, dateAdded, false);
        saveBookToLocalStorage(bookName, dateAdded, false);
        newBookInput.value = '';
    }
});

// Add a new book
addBook.addEventListener('click', () => {
    const bookName = newBookInput.value.trim();
    if (bookName) {
        const dateAdded = new Date().toLocaleDateString();
        addBookToList(bookName, dateAdded, false);
        saveBookToLocalStorage(bookName, dateAdded, false);
        newBookInput.value = '';
    }
});

// Fitness Focus Notification (Placeholder)
const today = new Date();
if (today.getDate() === 1) {
    alert('Don’t forget to set your fitness focus for the month!');
}