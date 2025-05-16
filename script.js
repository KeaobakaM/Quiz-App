// Quiz Data Structure
let quizData = {
  categories: {
    javascript: [],
    html: [],
    css: [],
    general: [],
  },
  settings: {
    questionsPerQuiz: 5,
    timePerQuestion: 30,
  },
  highScores: [],
};

// DOM Elements
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const adminScreen = document.getElementById("admin-screen");
const usernameInput = document.getElementById("username");
const categoriesContainer = document.getElementById("categories");
const startQuizBtn = document.getElementById("start-quiz");
const adminLoginBtn = document.getElementById("admin-login");
const currentUserSpan = document.getElementById("current-user");
const currentCategorySpan = document.getElementById("current-category");
const questionCountSpan = document.getElementById("question-count");
const timerSpan = document.getElementById("timer");
const scoreSpan = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const nextQuestionBtn = document.getElementById("next-question");
const finalScoreSpan = document.getElementById("final-score");
const highScoresList = document.getElementById("high-scores-list");
const restartQuizBtn = document.getElementById("restart-quiz");
const addQuestionBtn = document.getElementById("add-question");
const viewQuestionsBtn = document.getElementById("view-questions");
const logoutBtn = document.getElementById("logout");
const questionForm = document.getElementById("question-form");
const questionsList = document.getElementById("questions-list");
const formCategorySelect = document.getElementById("form-category");
const questionTextInput = document.getElementById("question-text-input");
const answerInputs = document.getElementById("answer-inputs");
const saveQuestionBtn = document.getElementById("save-question");
const cancelEditBtn = document.getElementById("cancel-edit");
const questionsContainer = document.getElementById("questions-container");

// Quiz State
let currentState = {
  username: "",
  category: "",
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  timer: null,
  timeLeft: 0,
  selectedOption: null,
  editingQuestionId: null,
};

// Initialize the App
function init() {
  loadData();
  renderCategories();
  setupEventListeners();
  checkAdminStatus();
}

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem("techQuizAppData");
  if (savedData) {
    quizData = JSON.parse(savedData);
  } else {
    // Load sample questions if no data exists
    loadSampleQuestions();
    saveData();
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("techQuizAppData", JSON.stringify(quizData));
}

// Load sample questions
function loadSampleQuestions() {
  quizData.categories.javascript = [
    {
      id: Date.now(),
      text: "What is the output of 'typeof null' in JavaScript?",
      options: ["object", "null", "undefined", "string"],
      correctAnswer: 0,
    },
    {
      id: Date.now() + 1,
      text: "Which keyword is used to declare a variable in JavaScript that can't be reassigned?",
      options: ["var", "let", "const", "static"],
      correctAnswer: 2,
    },
  ];

  quizData.categories.html = [
    {
      id: Date.now() + 2,
      text: "Which HTML5 element is used for drawing graphics via scripting?",
      options: ["<canvas>", "<svg>", "<graphics>", "<draw>"],
      correctAnswer: 0,
    },
  ];

  quizData.categories.css = [
    {
      id: Date.now() + 3,
      text: "Which CSS property is used to change the text color of an element?",
      options: ["text-color", "font-color", "color", "text-style"],
      correctAnswer: 2,
    },
  ];

  quizData.categories.general = [
    {
      id: Date.now() + 4,
      text: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Automated Programming Interface",
        "Application Process Integration",
        "Automated Process Integration",
      ],
      correctAnswer: 0,
    },
  ];
}

// Render categories
function renderCategories() {
  categoriesContainer.innerHTML = "";
  Object.keys(quizData.categories).forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "category";
    categoryElement.textContent =
      category.charAt(0).toUpperCase() + category.slice(1);
    categoryElement.dataset.category = category;
    categoriesContainer.appendChild(categoryElement);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Category selection
  categoriesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("category")) {
      document.querySelectorAll(".category").forEach((cat) => {
        cat.classList.remove("selected");
      });
      e.target.classList.add("selected");
      currentState.category = e.target.dataset.category;
    }
  });

  // Start quiz
  startQuizBtn.addEventListener("click", startQuiz);

  // Admin login
  adminLoginBtn.addEventListener("click", () => {
    const password = prompt("Enter admin password:");
    if (password === "admin123") {
      // Simple password check for demo
      localStorage.setItem("techQuizAdmin", "true");
      showAdminScreen();
    } else {
      alert("Incorrect password");
    }
  });

  // Option selection
  optionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("option") && !currentState.selectedOption) {
      const selectedIndex = parseInt(e.target.dataset.index);
      selectOption(selectedIndex);
    }
  });

  // Next question
  nextQuestionBtn.addEventListener("click", nextQuestion);

  // Restart quiz
  restartQuizBtn.addEventListener("click", () => {
    resultsScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
  });

  // Admin buttons
  addQuestionBtn.addEventListener("click", showAddQuestionForm);
  viewQuestionsBtn.addEventListener("click", showQuestionsList);
  logoutBtn.addEventListener("click", logoutAdmin);
  saveQuestionBtn.addEventListener("click", saveQuestion);
  cancelEditBtn.addEventListener("click", cancelEdit);

  // Mark correct answer
  answerInputs.addEventListener("click", (e) => {
    if (e.target.classList.contains("answer-input")) {
      document.querySelectorAll(".answer-input").forEach((input) => {
        input.dataset.correct = "false";
      });
      e.target.dataset.correct = "true";
    }
  });
}

// Check if admin is logged in
function checkAdminStatus() {
  if (localStorage.getItem("techQuizAdmin") === "true") {
    showAdminScreen();
  }
}

// Show admin screen
function showAdminScreen() {
  welcomeScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");
  adminScreen.classList.remove("hidden");
  questionForm.classList.add("hidden");
  questionsList.classList.add("hidden");
}

// Show add question form
function showAddQuestionForm() {
  questionForm.classList.remove("hidden");
  questionsList.classList.add("hidden");
  resetQuestionForm();
}

// Show questions list
function showQuestionsList() {
  questionsList.classList.remove("hidden");
  questionForm.classList.add("hidden");
  renderQuestionsList();
}

// Render questions list
function renderQuestionsList() {
  questionsContainer.innerHTML = "";

  Object.keys(quizData.categories).forEach((category) => {
    if (quizData.categories[category].length > 0) {
      const categoryHeader = document.createElement("h4");
      categoryHeader.textContent =
        category.charAt(0).toUpperCase() + category.slice(1) + " Questions";
      questionsContainer.appendChild(categoryHeader);

      quizData.categories[category].forEach((question) => {
        const questionItem = document.createElement("div");
        questionItem.className = "question-item";
        questionItem.innerHTML = `
                    <h4>${question.text}</h4>
                    <ol>
                        ${question.options
                          .map(
                            (opt, i) =>
                              `<li${
                                i === question.correctAnswer
                                  ? ' class="correct-answer"'
                                  : ""
                              }>${opt}</li>`
                          )
                          .join("")}
                    </ol>
                    <div class="question-actions">
                        <button class="edit-btn" data-id="${
                          question.id
                        }">Edit</button>
                        <button class="delete-btn" data-id="${
                          question.id
                        }">Delete</button>
                    </div>
                `;
        questionsContainer.appendChild(questionItem);
      });
    }
  });

  // Add event listeners to edit/delete buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      editQuestion(e.target.dataset.id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      deleteQuestion(e.target.dataset.id);
    });
  });
}

// Reset question form
function resetQuestionForm() {
  questionTextInput.value = "";
  const inputs = document.querySelectorAll(".answer-input");
  inputs.forEach((input, index) => {
    input.value = "";
    input.dataset.correct = index === 0 ? "true" : "false";
  });
  currentState.editingQuestionId = null;
}

// Edit question
function editQuestion(questionId) {
  let questionToEdit = null;
  let categoryToEdit = null;

  // Find the question in categories
  Object.keys(quizData.categories).forEach((category) => {
    const foundQuestion = quizData.categories[category].find(
      (q) => q.id.toString() === questionId
    );
    if (foundQuestion) {
      questionToEdit = foundQuestion;
      categoryToEdit = category;
    }
  });

  if (questionToEdit) {
    currentState.editingQuestionId = questionToEdit.id;
    formCategorySelect.value = categoryToEdit;
    questionTextInput.value = questionToEdit.text;

    const inputs = document.querySelectorAll(".answer-input");
    inputs.forEach((input, index) => {
      input.value = questionToEdit.options[index] || "";
      input.dataset.correct =
        index === questionToEdit.correctAnswer ? "true" : "false";
    });

    questionForm.classList.remove("hidden");
    questionsList.classList.add("hidden");
  }
}

// Delete question
function deleteQuestion(questionId) {
  if (confirm("Are you sure you want to delete this question?")) {
    Object.keys(quizData.categories).forEach((category) => {
      quizData.categories[category] = quizData.categories[category].filter(
        (q) => q.id.toString() !== questionId
      );
    });
    saveData();
    renderQuestionsList();
  }
}

// Save question
function saveQuestion() {
  const category = formCategorySelect.value;
  const text = questionTextInput.value.trim();
  const options = [];
  let correctAnswer = 0;

  // Get options and correct answer
  document.querySelectorAll(".answer-input").forEach((input, index) => {
    const optionText = input.value.trim();
    if (optionText) {
      options.push(optionText);
      if (input.dataset.correct === "true") {
        correctAnswer = index;
      }
    }
  });

  // Validation
  if (!text || options.length < 2) {
    alert("Please provide a question text and at least 2 options");
    return;
  }

  if (currentState.editingQuestionId) {
    // Update existing question
    const questionIndex = quizData.categories[category].findIndex(
      (q) => q.id === currentState.editingQuestionId
    );
    if (questionIndex !== -1) {
      quizData.categories[category][questionIndex] = {
        id: currentState.editingQuestionId,
        text,
        options,
        correctAnswer,
      };
    }
  } else {
    // Add new question
    quizData.categories[category].push({
      id: Date.now(),
      text,
      options,
      correctAnswer,
    });
  }

  saveData();
  resetQuestionForm();
  questionForm.classList.add("hidden");
  showQuestionsList();
}

// Cancel edit
function cancelEdit() {
  resetQuestionForm();
  questionForm.classList.add("hidden");
}

// Logout admin
function logoutAdmin() {
  localStorage.removeItem("techQuizAdmin");
  welcomeScreen.classList.remove("hidden");
  adminScreen.classList.add("hidden");
}

// Start quiz
function startQuiz() {
  const username = usernameInput.value.trim();

  if (!username) {
    alert("Please enter your name");
    return;
  }

  if (!currentState.category) {
    alert("Please select a category");
    return;
  }

  currentState.username = username;
  currentUserSpan.textContent = username;
  currentCategorySpan.textContent =
    currentState.category.charAt(0).toUpperCase() +
    currentState.category.slice(1);

  // Get questions for the selected category
  const categoryQuestions = [...quizData.categories[currentState.category]];

  // Shuffle questions and select the first N
  shuffleArray(categoryQuestions);
  currentState.questions = categoryQuestions.slice(
    0,
    quizData.settings.questionsPerQuiz
  );

  // Shuffle options for each question
  currentState.questions.forEach((question) => {
    shuffleOptions(question);
  });

  currentState.currentQuestionIndex = 0;
  currentState.score = 0;

  welcomeScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  showQuestion();
}

// Show current question
function showQuestion() {
  const question = currentState.questions[currentState.currentQuestionIndex];

  // Update progress
  questionCountSpan.textContent = `Question ${
    currentState.currentQuestionIndex + 1
  } of ${currentState.questions.length}`;
  progressBar.style.width = `${
    (currentState.currentQuestionIndex / currentState.questions.length) * 100
  }%`;

  // Update score
  scoreSpan.textContent = `Score: ${currentState.score}`;

  // Display question
  questionText.textContent = question.text;
  optionsContainer.innerHTML = "";

  // Display options
  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.dataset.index = index;
    optionsContainer.appendChild(optionElement);
  });

  // Reset selected option
  currentState.selectedOption = null;
  nextQuestionBtn.classList.add("hidden");

  // Start timer
  startTimer();
}

// Start timer for current question
function startTimer() {
  clearInterval(currentState.timer);
  currentState.timeLeft = quizData.settings.timePerQuestion;
  updateTimerDisplay();

  currentState.timer = setInterval(() => {
    currentState.timeLeft--;
    updateTimerDisplay();

    if (currentState.timeLeft <= 0) {
      clearInterval(currentState.timer);
      timeUp();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  timerSpan.textContent = `${currentState.timeLeft}s`;

  // Change color when time is running out
  if (currentState.timeLeft <= 10) {
    timerSpan.style.color = "#e74c3c";
  } else {
    timerSpan.style.color = "#2c3e50";
  }
}

// Time's up
function timeUp() {
  if (!currentState.selectedOption) {
    // Mark all options as disabled
    document.querySelectorAll(".option").forEach((option) => {
      option.style.opacity = "0.6";
      option.style.cursor = "not-allowed";
    });

    // Show correct answer
    const correctIndex =
      currentState.questions[currentState.currentQuestionIndex].correctAnswer;
    document
      .querySelector(`.option[data-index="${correctIndex}"]`)
      .classList.add("correct");

    nextQuestionBtn.classList.remove("hidden");
  }
}

// Select an option
function selectOption(index) {
  if (currentState.selectedOption !== null) return;

  currentState.selectedOption = index;
  const question = currentState.questions[currentState.currentQuestionIndex];

  // Highlight selected option
  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("selected");
  });
  document
    .querySelector(`.option[data-index="${index}"]`)
    .classList.add("selected");

  // Check if correct
  if (index === question.correctAnswer) {
    document
      .querySelector(`.option[data-index="${index}"]`)
      .classList.add("correct");
    currentState.score += 10;
    scoreSpan.textContent = `Score: ${currentState.score}`;
  } else {
    document
      .querySelector(`.option[data-index="${index}"]`)
      .classList.add("incorrect");
    // Show correct answer
    document
      .querySelector(`.option[data-index="${question.correctAnswer}"]`)
      .classList.add("correct");
  }

  // Stop timer
  clearInterval(currentState.timer);

  // Show next button
  nextQuestionBtn.classList.remove("hidden");
}

// Move to next question
function nextQuestion() {
  currentState.currentQuestionIndex++;

  if (currentState.currentQuestionIndex < currentState.questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// End quiz
function endQuiz() {
  clearInterval(currentState.timer);

  // Save score
  saveScore();

  // Show results
  quizScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");

  finalScoreSpan.textContent = `Congratulations ${currentState.username}! Your score: ${currentState.score}`;

  // Show high scores
  displayHighScores();
}

// Save score to high scores
function saveScore() {
  quizData.highScores.push({
    username: currentState.username,
    category: currentState.category,
    score: currentState.score,
    date: new Date().toLocaleDateString(),
  });

  // Sort high scores by score (descending)
  quizData.highScores.sort((a, b) => b.score - a.score);

  // Keep only top 10 scores
  if (quizData.highScores.length > 10) {
    quizData.highScores = quizData.highScores.slice(0, 10);
  }

  saveData();
}

// Display high scores
function displayHighScores() {
  highScoresList.innerHTML = "";

  quizData.highScores.forEach((score, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span class="score-rank">${index + 1}.</span>
            <span class="score-username">${score.username}</span>
            <span class="score-category">${score.category}</span>
            <span class="score-value">${score.score}</span>
            <span class="score-date">${score.date}</span>
        `;
    highScoresList.appendChild(li);
  });
}

// Utility function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Utility function to shuffle question options (keeping track of correct answer)
function shuffleOptions(question) {
  const correctAnswer = question.options[question.correctAnswer];
  shuffleArray(question.options);
  question.correctAnswer = question.options.indexOf(correctAnswer);
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
