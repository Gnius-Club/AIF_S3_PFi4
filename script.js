// ========== THEME TOGGLE ==========
const themeToggleInput = document.getElementById("theme-toggle-input");
const body = document.body;

function setTheme() {
  if (localStorage.getItem("dark-mode-innovacion") === "true") {
    body.classList.add("dark-mode");
    themeToggleInput.checked = true;
  } else {
    body.classList.remove("dark-mode");
    themeToggleInput.checked = false;
  }
}

setTheme();

themeToggleInput.addEventListener("change", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode-innovacion", "true");
  } else {
    localStorage.setItem("dark-mode-innovacion", "false");
  }
});

// ========== COLLAPSIBLE SECTIONS ==========
const collapsibleButtons = document.querySelectorAll(".collapsible-button");

collapsibleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    content.classList.toggle("active");
  });
});

// ========== GLOBAL TIMER (Countdown) ==========
const globalTimer = document.getElementById("global-timer");
const globalStartStopButton = document.getElementById("global-start-stop");
const globalResetButton = document.getElementById("global-reset");

let globalInterval;
let globalTimeLeft = 44 * 60; // 44 minutos en segundos
let globalTimerRunning = false;

function updateGlobalTimerDisplay() {
  const minutes = Math.floor(globalTimeLeft / 60);
  const seconds = globalTimeLeft % 60;
  globalTimer.textContent = `⏱️ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
  if (globalTimeLeft <= 60) {
    globalTimer.style.color = "#ff6b35";
  } else if (globalTimeLeft <= 300) {
    globalTimer.style.color = "#fbc02d";
  } else {
    globalTimer.style.color = "white";
  }
}

function startStopGlobalTimer() {
  if (globalTimerRunning) {
    clearInterval(globalInterval);
    globalStartStopButton.textContent = "Start";
  } else {
    globalInterval = setInterval(() => {
      if (globalTimeLeft > 0) {
        globalTimeLeft--;
        updateGlobalTimerDisplay();
        
        if (globalTimeLeft === 0) {
          clearInterval(globalInterval);
          globalTimerRunning = false;
          globalStartStopButton.textContent = "Start";
          alert("⏰ ¡Tiempo de sesión terminado! (44 minutos)");
        }
      }
    }, 1000);
    globalStartStopButton.textContent = "Stop";
  }
  globalTimerRunning = !globalTimerRunning;
}

function resetGlobalTimer() {
  clearInterval(globalInterval);
  globalTimerRunning = false;
  globalTimeLeft = 44 * 60;
  updateGlobalTimerDisplay();
  globalStartStopButton.textContent = "Start";
}

globalStartStopButton.addEventListener("click", startStopGlobalTimer);
globalResetButton.addEventListener("click", resetGlobalTimer);

// ========== ACTIVITY TIMERS (Individual Countdown) ==========
let activityIntervals = {};

function updateActivityTimerDisplay(button, timeLeft) {
  const durationSpan = button.previousElementSibling;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  durationSpan.textContent = `⏱️ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
  if (timeLeft <= 30) {
    durationSpan.style.color = "#ff6b35";
  } else if (timeLeft <= 60) {
    durationSpan.style.color = "#fbc02d";
  } else {
    durationSpan.style.color = "#ffa600";
  }
}

function startActivityTimer(button) {
  const duration = parseInt(button.dataset.duration);
  const activityId = button.closest('.activity-card').id;
  
  if (activityIntervals[activityId]) {
    clearInterval(activityIntervals[activityId].interval);
    delete activityIntervals[activityId];
    button.textContent = "Iniciar";
    button.classList.remove("running");
    
    const originalMinutes = Math.floor(duration / 60);
    const originalSeconds = duration % 60;
    button.previousElementSibling.textContent = `⏱️ ${String(originalMinutes).padStart(2, "0")}:${String(originalSeconds).padStart(2, "0")}`;
    button.previousElementSibling.style.color = "#ffa600";
    return;
  }
  
  let timeLeft = duration;
  button.classList.add("running");
  button.textContent = "Detener";
  
  const interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateActivityTimerDisplay(button, timeLeft);
      
      if (timeLeft === 0) {
        clearInterval(interval);
        delete activityIntervals[activityId];
        button.textContent = "Iniciar";
        button.classList.remove("running");
        
        const activityTitle = button.closest('.activity-card').querySelector('h2').textContent;
        alert(`⏰ ¡Tiempo de actividad terminado!\n\n${activityTitle}`);
        
        const originalMinutes = Math.floor(duration / 60);
        const originalSeconds = duration % 60;
        button.previousElementSibling.textContent = `⏱️ ${String(originalMinutes).padStart(2, "0")}:${String(originalSeconds).padStart(2, "0")}`;
        button.previousElementSibling.style.color = "#ffa600";
      }
    }
  }, 1000);
  
  activityIntervals[activityId] = { interval, duration };
}

document.addEventListener('DOMContentLoaded', () => {
  const timerButtons = document.querySelectorAll('.timer-start-btn');
  timerButtons.forEach(button => {
    button.addEventListener('click', () => startActivityTimer(button));
  });
});

// ========== ACTIVITY NAVIGATION ==========
const activityLinks = document.querySelectorAll(".activity-list a");
const activityCards = document.querySelectorAll(".activity-card");
const progressBar = document.querySelector(".progress");
const numberOfActivities = activityCards.length;

activityCards.forEach((card) => {
  card.classList.remove("active");
  card.style.display = "none";
});

function showActivity(activityId) {
  const currentActive = document.querySelector(".activity-card.active");
  if (currentActive) {
    currentActive.classList.remove("active");
    setTimeout(() => {
      currentActive.style.display = "none";
    }, 333);
  }

  const selectedActivity = document.getElementById(activityId);
  if (selectedActivity) {
    selectedActivity.style.display = "block";
    setTimeout(() => {
      selectedActivity.classList.add("active");
    }, 50);

    activityLinks.forEach(link => link.classList.remove('active'));
    const correspondingLink = document.querySelector(`.activity-list a[href="#${activityId}"]`);
    if (correspondingLink) {
        correspondingLink.classList.add('active');
    }
    
    updateProgressBar(activityId);
  }
}

function updateProgressBar(activityId) {
  const activityIndex = parseInt(activityId.split("-")[1]);

  let progressPercentage;

  if (numberOfActivities <= 1) {
    progressPercentage = (activityIndex === 0 && numberOfActivities === 1) ? 100 : 0;
  } else {
    progressPercentage = (activityIndex / (numberOfActivities - 1)) * 100;
  }
  
  progressPercentage = Math.min(100, Math.max(0, progressPercentage));
  progressBar.style.width = `${progressPercentage}%`;
}

activityLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const activityId = link.getAttribute("href").substring(1);
    showActivity(activityId);
  });
});

if (activityCards.length > 0) {
  showActivity(activityCards[0].id);
}
