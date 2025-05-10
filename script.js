document.addEventListener('DOMContentLoaded', () => {
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
});