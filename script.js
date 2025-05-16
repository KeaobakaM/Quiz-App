// Elements
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-to-start");
const goToAdmin = document.getElementById("go-to-admin");
const closeAdmin = document.getElementById("close-admin");
const saveQuestionBtn = document.getElementById("save-question");
const adminLoginBtn = document.getElementById("admin-login-btn");
const cancelLogin = document.getElementById("cancel-login");

// Screens
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");
const adminLoginScreen = document.getElementById("admin-login-screen");
const adminScreen = document.getElementById("admin-screen");

// Inputs
const usernameInput = document.getElementById("username");
const categorySelect = document.getElementById("category");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score-display");
const progressBar = document.getElementById("progress-bar");
const leaderboardList = document.getElementById("leaderboard-list");

// Admin Inputs
const adminInputs = {
  question: document.getElementById("admin-question"),
  option1: document.getElementById("admin-option1"),
  option2: document.getElementById("admin-option2"),
  option3: document.getElementById("admin-option3"),
  option4: document.getElementById("admin-option4"),
  correct: document.getElementById("admin-correct"),
  category: document.getElementById("admin-category"),
  number: document.getElementById("num-questions")
};

const adminUsernameInput = document.getElementById("admin-username");
const adminPasswordInput = document.getElementById("admin-password");

let questions = JSON.parse(localStorage.getItem("questions")) || [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;

const adminCredentials = {
  username: "admin",
  password: "1234"
};

// Dummy Questions Seeder
if (questions.length === 0) {
  questions = [
    { question: "What does JS stand for?", option1: "Java Style", option2: "JavaScript", option3: "Just Script", option4: "Jumpy Syntax", correct: "JavaScript", category: "javascript" },
    { question: "Which tag is used to link CSS?", option1: "<css>", option2: "<style>", option3: "<link>", option4: "<script>", correct: "<link>", category: "html" },
    { question: "Which property is used for background color?", option1: "bg-color", option2: "color-bg", option3: "backgroundColor", option4: "background-color", correct: "background-color", category: "css" },
    { question: "What is the command to select all rows in SQL?", option1: "SELECT ALL", option2: "GET *", option3: "SELECT *", option4: "FETCH ALL", correct: "SELECT *", category: "sql" },
    { question: "What is React mainly used for?", option1: "Database", option2: "UI Building", option3: "Routing", option4: "Storage", correct: "UI Building", category: "react" }
  ];
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Start Quiz
startBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const category = categorySelect.value;
  if (!username || !category) return alert("Please enter your name and select a category.");
  quizQuestions = questions.filter(q => q.category === category);
  if (quizQuestions.length === 0) return alert("No questions for this category.");
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 10;
  showQuestion();
  startTimer();
});

// Show Question
function showQuestion() {
  const currentQ = quizQuestions[currentQuestionIndex];
  questionText.textContent = currentQ.question;
  answerOptions.innerHTML = "";
  [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].forEach(opt => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.addEventListener("click", () => checkAnswer(opt));
    answerOptions.appendChild(li);
  });
  progressBar.style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
}

function checkAnswer(selected) {
  const currentQ = quizQuestions[currentQuestionIndex];
  if (selected === currentQ.correct) score++;
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    timeLeft = 10;
    showQuestion();
  } else {
    clearInterval(timer);
    showResult();
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}

function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  scoreDisplay.textContent = `You scored ${score} / ${quizQuestions.length}`;
  const username = usernameInput.value.trim();
  const entry = { name: username, score };
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  showLeaderboard();
}

function showLeaderboard() {
  leaderboardList.innerHTML = "";
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.slice(0, 10).forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

// Admin Panel

goToAdmin.addEventListener("click", () => {
  adminLoginScreen.classList.remove("hidden");
  startScreen.classList.add("hidden");
});

adminLoginBtn.addEventListener("click", () => {
  const user = adminUsernameInput.value.trim();
  const pass = adminPasswordInput.value.trim();
  if (user === adminCredentials.username && pass === adminCredentials.password) {
    adminLoginScreen.classList.add("hidden");
    adminScreen.classList.remove("hidden");
  } else {
    alert("Wrong credentials!");
  }
});

cancelLogin.addEventListener("click", () => {
  adminLoginScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

closeAdmin.addEventListener("click", () => {
  adminScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

saveQuestionBtn.addEventListener("click", () => {
  const newQ = {
    question: adminInputs.question.value.trim(),
    option1: adminInputs.option1.value.trim(),
    option2: adminInputs.option2.value.trim(),
    option3: adminInputs.option3.value.trim(),
    option4: adminInputs.option4.value.trim(),
    correct: adminInputs.correct.value.trim(),
    category: adminInputs.category.value
  };
  if (!Object.values(newQ).every(Boolean)) return alert("Fill all fields.");
  questions.push(newQ);
  localStorage.setItem("questions", JSON.stringify(questions));
  alert("Question saved!");
  Object.values(adminInputs).forEach(input => input.value = "");
});

restartBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  leaderboardScreen.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  leaderboardScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
