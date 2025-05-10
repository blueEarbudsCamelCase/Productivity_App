document.addEventListener('DOMContentLoaded', () => {
    const categorySetup = document.getElementById("categorySetup");
    const timeTracker = document.getElementById("timeTracker");

    // Check if categories exist in local storage
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    if (categories.length === 0) {
        // Show category setup screen
        categorySetup.style.display = "block";
        timeTracker.style.display = "none";
    } else {
        // Show time tracker screen
        categorySetup.style.display = "none";
        timeTracker.style.display = "block";
    }

    // Handle category form submission
    const categoryForm = document.getElementById("categoryForm");
    categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Collect category inputs
        const categoryInputs = [
            document.getElementById("category1").value.trim(),
            document.getElementById("category2").value.trim(),
            document.getElementById("category3").value.trim(),
            document.getElementById("category4").value.trim(),
            document.getElementById("category5").value.trim(),
        ].filter((category) => category !== ""); // Remove empty inputs

        if (categoryInputs.length < 3 || categoryInputs.length > 5) {
            alert("Please enter between 3 and 5 categories.");
            return;
        }

        // Save categories to local storage
        localStorage.setItem("categories", JSON.stringify(categoryInputs));

        // Switch to time tracker screen
        categorySetup.style.display = "none";
        timeTracker.style.display = "block";
    });
});
    
    const form = document.getElementById('timeTrackerForm');
    const activityList = document.getElementById('activityList');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const activity = document.getElementById('activity').value;
        const timeSpent = document.getElementById('timeSpent').value;

        const listItem = document.createElement('li');
        listItem.textContent = `${activity} - ${timeSpent} minutes`;

        activityList.appendChild(listItem);

        form.reset();
    });