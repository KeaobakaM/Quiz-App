// Quiz state
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let questions = [];
let username = "";

// DOM elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const progressElement = document.getElementById("progress");
const usernameInput = document.getElementById("username");
const categorySelect = document.getElementById("category");
const finalScoreElement = document.getElementById("final-score");
const highScoresElement = document.getElementById("high-scores");

// Load questions from localStorage or default
function loadQuestions(category) {
  const savedQuestions =
    JSON.parse(localStorage.getItem("quizQuestions")) || {};
  return savedQuestions[category] || [];
}

// Start quiz
startBtn.addEventListener("click", () => {
  username = usernameInput.value.trim() || "Anonymous";
  const category = categorySelect.value;
  questions = loadQuestions(category);

  if (questions.length === 0) {
    alert("No questions available for this category. Please try another one.");
    return;
  }

  // Shuffle questions and limit to 10
  questions = shuffleArray(questions).slice(0, 10);

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
});

// Show question
function showQuestion() {
  resetState();
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }

  const question = questions[currentQuestion];
  questionElement.textContent = question.text;

  // Shuffle options
  const shuffledOptions = shuffleArray([...question.options]);

  shuffledOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");
    button.addEventListener("click", () =>
      selectAnswer(option, question.answer)
    );
    optionsElement.appendChild(button);
  });

  // Update progress
  progressElement.style.width = `${
    (currentQuestion / questions.length) * 100
  }%`;

  // Start timer
  timeLeft = 30;
  updateTimer();
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// Update timer display
function updateTimer() {
  timerElement.textContent = `Time: ${timeLeft}s`;
}

// Reset question state
function resetState() {
  clearInterval(timer);
  nextBtn.classList.add("hidden");
  while (optionsElement.firstChild) {
    optionsElement.removeChild(optionsElement.firstChild);
  }
}

// Handle answer selection
function selectAnswer(selectedOption, correctAnswer) {
  clearInterval(timer);
  const options = document.querySelectorAll(".option-btn");
  let isCorrect = false;

  options.forEach((option) => {
    if (option.textContent === correctAnswer) {
      option.classList.add("correct");
    }
    if (
      option.textContent === selectedOption &&
      selectedOption !== correctAnswer
    ) {
      option.classList.add("wrong");
    }
    option.disabled = true;
  });

  if (selectedOption === correctAnswer) {
    score++;
    isCorrect = true;
  }

  scoreElement.textContent = `Score: ${score}`;
  nextBtn.classList.remove("hidden");
}

// Move to next question
nextBtn.addEventListener("click", nextQuestion);

function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

// Show final result
function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScoreElement.textContent = `${username}, your score is ${score} out of ${questions.length}`;

  // Save high score
  saveHighScore(username, score, questions.length);
  displayHighScores();
}

// Save high score to localStorage
// Save high score to localStorage (without date)
function saveHighScore(name, score, total) {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push({
    name,
    score,
    total, // Removed the date property
  });
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Display high scores
// Display high scores (without dates)
function displayHighScores() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.sort((a, b) => b.score - a.score);

  if (highScores.length > 0) {
    highScoresElement.innerHTML = "<h2>High Scores</h2>";
    highScores.slice(0, 5).forEach((score, index) => {
      highScoresElement.innerHTML += `
              <p>${index + 1}. ${score.name}: ${score.score}/${score.total}</p>
          `;
    });
  }
}

// Restart quiz
restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

// Utility function to shuffle array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
