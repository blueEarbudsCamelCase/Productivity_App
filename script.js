document.addEventListener('DOMContentLoaded', () => {
    const goalSetup = document.getElementById("goalSetup");
    const homeScreen = document.getElementById('homeScreen');
    // Check if goals exist in local storage
    const goals = JSON.parse(localStorage.getItem("goals")) || [];

    if (goals.length === 0) {
        // Show goal setup screen
        goalSetup.classList.remove("hidden");
        homeScreen.classList.add("hidden");
    } else {
        // Show home screen
        goalSetup.classList.add("hidden");
        homeScreen.classList.remove("hidden");
    }

    // Handle goal form submission
    const goalForm = document.getElementById("goalForm");
    goalForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Collect goal inputs
        const goalInputs = [
            document.getElementById("goal1").value.trim(),
            document.getElementById("goal2").value.trim(),
            document.getElementById("goal3").value.trim(),
            document.getElementById("goal4").value.trim(),
            document.getElementById("goal5").value.trim(),
        ].filter((goal) => goal !== ""); // Remove empty inputs

        if (goalInputs.length < 3 || goalInputs.length > 5) {
            alert("Please enter between 3 and 5 goals.");
            return;
        }

        // Save goals to local storage
        localStorage.setItem("goals", JSON.stringify(goalInputs));

        // Switch to time tracker screen
        goalSetup.classList.add('hidden');
        homeScreen.classList.remove('hidden');
    });
});