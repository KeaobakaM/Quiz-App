let questions = {
  JavaScript: [
    {
      question: "What does NaN stand for?",
      answers: ["Not a Number", "No any Number", "Null and Nothing", "Not at Name"],
      correct: "Not a Number"
    },
    {
      question: "Which company developed JavaScript?",
      answers: ["Mozilla", "Netscape", "Microsoft", "Sun Microsystems"],
      correct: "Netscape"
    }
  ],
  HTML: [
    {
      question: "What does HTML stand for?",
      answers: ["HyperText Markup Language", "HyperText Markdown Language", "Home Tool Markup Language", "None"],
      correct: "HyperText Markup Language"
    }
  ],
  CSS: [
    {
      question: "What property changes text color in CSS?",
      answers: ["font-color", "text-color", "color", "background-color"],
      correct: "color"
    }
  ]
};

let usernameInput = document.getElementById("username");
let categorySelect = document.getElementById("category");
let startBtn = document.getElementById("start-btn");
let questionEl = document.getElementById("question");
let answersEl = document.getElementById("answers");
let timerEl = document.getElementById("timer");
let progressEl = document.getElementById("progress");
let scoreDisplay = document.getElementById("score-display");
let viewScoresBtn = document.getElementById("view-scores-btn");
let highScoresScreen = document.getElementById("high-scores-screen");
let highScoresList = document.getElementById("high-scores-list");
let backBtn = document.getElementById("back-btn");

let quizScreen = document.getElementById("quiz-screen");
let startScreen = document.getElementById("start-screen");
let resultScreen = document.getElementById("result-screen");

let currentQuestionIndex = 0;
let quizQuestions = [];
let score = 0;
let timeLeft = 15;
let timer;

startBtn.addEventListener("click", () => {
  let username = usernameInput.value.trim();
  let category = categorySelect.value;

  if (!username) return alert("Please enter your name.");

  localStorage.setItem("quizUser", username);

  quizQuestions = shuffleArray(questions[category]);
  quizQuestions = quizQuestions.slice(0, 5); // limit to 5 questions

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
});

viewScoresBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  highScoresScreen.classList.remove("hidden");
  displayHighScores();
});

backBtn.addEventListener("click", () => {
  highScoresScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

function showQuestion() {
  clearInterval(timer);
  timeLeft = 45;
  updateTimer();

  let current = quizQuestions[currentQuestionIndex];
  questionEl.textContent = current.question;
  answersEl.innerHTML = "";

  let shuffledAnswers = shuffleArray([...current.answers]);
  shuffledAnswers.forEach(ans => {
    let li = document.createElement("li");
    li.textContent = ans;
    li.addEventListener("click", () => checkAnswer(ans));
    answersEl.appendChild(li);
  });

  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);

  updateProgress();
}

function checkAnswer(answer) {
  let correct = quizQuestions[currentQuestionIndex].correct;
  if (answer === correct) score++;
  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function updateTimer() {
  timerEl.textContent = timeLeft;
}

function updateProgress() {
  let percent = ((currentQuestionIndex) / quizQuestions.length) * 100;
  progressEl.style.width = percent + "%";
}

function endQuiz() {
  clearInterval(timer);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  let username = localStorage.getItem("quizUser") || "User";
  scoreDisplay.textContent = `${username}, you scored ${score}/${quizQuestions.length}`;

  saveHighScore(username, score);
}

function saveHighScore(name, score) {
  let highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
  highScores.push({ name, score });
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function displayHighScores() {
  let highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
  console.log(highScores)
  highScoresList.innerHTML = "";

  highScores.sort((a, b) => b.score - a.score);
  highScores.slice(0, 10).forEach(entry => {
    let li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    highScoresList.appendChild(li);
  });
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}