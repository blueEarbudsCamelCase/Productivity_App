document.addEventListener('DOMContentLoaded', () => {
    const categorySetup = document.getElementById("categorySetup");
    const homeScreen = document.getElementById('homeScreen');
    // Check if categories exist in local storage
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    if (categories.length === 0) {
        // Show category setup screen
        categorySetup.style.display = "block";
        homeScreen.style.display = "none";
    } else {
        // Show home screen
        categorySetup.style.display = "none";
        homeScreen.style.display = "block";
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
        categorySetup.style.add('hidden');
        homeScreen.style.remove('hidden');
    });
});