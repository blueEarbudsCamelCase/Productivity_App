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

startTimerButton.addEventListener('click', () => {
    const prepTime = parseInt(prepTimeInput.value, 10);
    const sets = parseInt(setsInput.value, 10) || 0;
    const activeTime = parseInt(activeTimeInput.value, 10);
    const restTime = parseInt(restTimeInput.value, 10);
    const manualMode = activeTime === 0;

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
    markDoneButton.style.display = manualMode ? 'block' : 'none';

    function playSound() {
        const audio = new Audio('beep.mp3'); // Add a beep sound file in your project
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
        } else if (phase === 'active') {
            if (manualMode) {
                if (currentSet < sets) {
                    phase = 'rest';
                    timeLeft = restTime;
                } else {
                    endTimer();
                }
            } else {
                if (currentSet < sets) {
                    phase = 'rest';
                    timeLeft = restTime;
                } else {
                    endTimer();
                }
            }
        } else if (phase === 'rest') {
            phase = 'active';
            timeLeft = manualMode ? 0 : activeTime;
            currentSet++;
        }
        playSound();
        updateTimerDisplay();
    }

    function endTimer() {
        clearInterval(timerInterval);
        timerPhase.textContent = 'Done!';
        timerCountdown.textContent = '';
        if (wakeLock) wakeLock.release().then(() => (wakeLock = null));
    }

    updateTimerDisplay();
    playSound();

    if (!manualMode) {
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                nextPhase();
            }
            updateTimerDisplay();
        }, 1000);
    }

    markDoneButton.addEventListener('click', () => {
        if (phase === 'active') {
            nextPhase();
        }
    });
}