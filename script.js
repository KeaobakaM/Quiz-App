// Data Structure
let quizData = {
  categories: {
    javascript: [],
    html: [],
    css: [],
    sql: [],
    react: [],
    general: [],
  },
  settings: {
    questionsPerQuiz: 5,
    timePerQuestion: 10,
  },
  highScores: [],
};

let currentState = {
  username: "",
  category: "",
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  timer: null,
  timeLeft: 10,
  selectedOption: null,
  editingQuestionId: null,
};

// DOM Elements (combined)
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-to-start");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const adminScreen = document.getElementById("admin-screen");
const startScreen = document.getElementById("start-screen");

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
};

const saveQuestionBtn = document.getElementById("save-question");

// Admin login credentials
const adminCredentials = {
  username: "admin",
  password: "1234",
};

// Load Sample Questions if Empty
function loadSampleQuestions() {
  if (Object.values(quizData.categories).every(cat => cat.length === 0)) {
    quizData.categories.javascript.push({
      id: Date.now(),
      text: "What does JS stand for?",
      options: ["Java Style", "JavaScript", "Just Script", "Jumpy Syntax"],
      correctAnswer: 1,
    });
    quizData.categories.html.push({
      id: Date.now() + 1,
      text: "Which tag is used to link CSS?",
      options: ["<css>", "<style>", "<link>", "<script>"],
      correctAnswer: 2,
    });
    quizData.categories.css.push({
      id: Date.now() + 2,
      text: "Which property is used for background color?",
      options: ["bg-color", "color-bg", "backgroundColor", "background-color"],
      correctAnswer: 3,
    });
    quizData.categories.sql.push({
      id: Date.now() + 3,
      text: "What is the command to select all rows in SQL?",
      options: ["SELECT ALL", "GET *", "SELECT *", "FETCH ALL"],
      correctAnswer: 2,
    });
    quizData.categories.react.push({
      id: Date.now() + 4,
      text: "What is React mainly used for?",
      options: ["Database", "UI Building", "Routing", "Storage"],
      correctAnswer: 1,
    });

    localStorage.setItem("techQuizAppData", JSON.stringify(quizData));
  }
}

// Initialize App
function init() {
  const savedData = localStorage.getItem("techQuizAppData");
  if (savedData) {
    quizData = JSON.parse(savedData);
  } else {
    loadSampleQuestions();
  }
  setupEventListeners();
}

function setupEventListeners() {
  startBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const category = categorySelect.value;
    if (!username || !category) return alert("Enter your name & select a category.");
    currentState.username = username;
    currentState.category = category;
    currentState.questions = quizData.categories[category] || [];
    if (currentState.questions.length === 0) return alert("No questions in this category.");
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    currentState.currentQuestionIndex = 0;
    currentState.score = 0;
    currentState.timeLeft = quizData.settings.timePerQuestion;
    showQuestion();
    startTimer();
  });

  restartBtn.addEventListener("click", () => {
    location.reload(); // You can make this smoother if you want
  });

  saveQuestionBtn.addEventListener("click", () => {
    const question = adminInputs.question.value.trim();
    const options = [
      adminInputs.option1.value,
      adminInputs.option2.value,
      adminInputs.option3.value,
      adminInputs.option4.value,
    ];
    const correct = parseInt(adminInputs.correct.value);
    const category = adminInputs.category.value;

    if (!question || options.some(o => !o) || isNaN(correct)) {
      return alert("Please fill all fields correctly.");
    }

    const newQ = {
      id: Date.now(),
      text: question,
      options: options,
      correctAnswer: correct,
    };

    quizData.categories[category] = quizData.categories[category] || [];
    quizData.categories[category].push(newQ);
    localStorage.setItem("techQuizAppData", JSON.stringify(quizData));
    alert("Question added successfully!");
  });
}

// Show question
function showQuestion() {
  const currentQ = currentState.questions[currentState.currentQuestionIndex];
  questionText.textContent = currentQ.text;
  answerOptions.innerHTML = "";

  currentQ.options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.addEventListener("click", () => checkAnswer(index));
    answerOptions.appendChild(li);
  });

  progressBar.style.width = `${((currentState.currentQuestionIndex + 1) / currentState.questions.length) * 100}%`;
}

// Timer logic
function startTimer() {
  timerDisplay.textContent = `Time: ${currentState.timeLeft}`;
  currentState.timer = setInterval(() => {
    currentState.timeLeft--;
    timerDisplay.textContent = `Time: ${currentState.timeLeft}`;
    if (currentState.timeLeft <= 0) {
      clearInterval(currentState.timer);
      showResult();
    }
  }, 1000);
}

// Check Answer
function checkAnswer(index) {
  const correct = currentState.questions[currentState.currentQuestionIndex].correctAnswer;
  if (index === correct) currentState.score++;
  currentState.currentQuestionIndex++;
  if (currentState.currentQuestionIndex < currentState.questions.length) {
    currentState.timeLeft = quizData.settings.timePerQuestion;
    showQuestion();
  } else {
    clearInterval(currentState.timer);
    showResult();
  }
}

// Show Result
function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  scoreDisplay.textContent = `Score: ${currentState.score} / ${currentState.questions.length}`;
}

// Start it up
init();
