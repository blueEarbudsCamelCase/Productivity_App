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
const timerScreen = document.getElementById('timerScreen');
const openTimerScreenButton = document.getElementById('openTimerScreen');
const backToHomeButton = document.getElementById('backToHome');
const timerForm = document.getElementById('timerForm');

startTimerButton.addEventListener('click', () => {
    const prepTime = parseInt(prepTimeInput.value, 10);
    const sets = parseInt(setsInput.value, 10) || 0;
    const activeTime = parseInt(activeTimeInput.value, 10);
    const restTime = parseInt(restTimeInput.value, 10);
    const manualMode = activeTime === 0;

    timerForm.style.display = 'none';
    timerDisplay.style.display = 'block';  

    startIntervalTimer(prepTime, sets, activeTime, restTime, manualMode);
});

// Show the timer screen and hide the home screen
openTimerScreenButton.addEventListener('click', () => {
    homeScreen.style.display = 'none';
    timerScreen.style.display = 'block';
});

// Show the home screen and hide the timer screen
backToHomeButton.addEventListener('click', () => {
    timerScreen.style.display = 'none';
    homeScreen.style.display = 'block';
    if (wakeLock) wakeLock.release().then(() => (wakeLock = null));

     
    // Clear the timer and reset the display
    clearInterval(timerInterval);
    timerInterval = null;
    timerPhase.textContent = '';
    timerCountdown.textContent = '';
    timerDisplay.style.display = 'none';
    timerForm.style.display = 'block';
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
    
    // Reset the markDoneButton visibility for all timers
    markDoneButton.style.display = 'none';

    const oldHandler = markDoneButton.getAttribute('data-handler');
    if (oldHandler) {
        markDoneButton.removeEventListener('click', window[oldHandler]);
        markDoneButton.removeAttribute('data-handler');
    }
    // Show the button only if manualMode is true for this timer
    if (manualMode) {
        markDoneButton.style.display = 'block';
    }


    function playSound() {
        const audio = new Audio('beep-329314.mp3'); // Add a beep sound file in your project
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
        markDoneButton.style.display = 'block'; // Show the button at the end of prep
    } else if (phase === 'active') {
        if (currentSet < sets) {
            phase = 'rest';
            timeLeft = restTime;
        } else {
            endTimer();
        }
    } else if (phase === 'rest') {
        if (currentSet < sets) {
            phase = 'active';
            timeLeft = manualMode ? 0 : activeTime;
            currentSet++;
            markDoneButton.style.display = 'block'; // Show the button at the end of rest
        } else {
            endTimer();
        }
    }

    playSound();
    updateTimerDisplay();
}

if (manualMode) {
    // Manual mode: Use the markDoneButton to transition phases
    const markDoneHandler = () => {
        if (phase === 'prep' || phase === 'rest') {
            markDoneButton.style.display = 'none'; // Hide the button when clicked
            nextPhase();
        }
    };

    // Add the event listener for the current timer instance
    const handlerName = `markDoneHandler_${Date.now()}`; // Unique handler name
    window[handlerName] = markDoneHandler; // Store the handler globally
    markDoneButton.setAttribute('data-handler', handlerName);
    markDoneButton.addEventListener('click', () => {
        markDoneButton.style.display = 'none'; // Hide the button when clicked
        markDoneHandler();
    });

    // Attach cleanup to the endTimer function
    const originalEndTimer = endTimer;
    endTimer = () => {
        originalEndTimer();
        cleanupHandler();
    };
} 
}