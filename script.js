const startBtn = document.getElementById("start-btn");
const usernameInput = document.getElementById("username");
const categorySelect = document.getElementById("category");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const scoreDisplay = document.getElementById("score-display");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let currentScore = 0;
let timer;
let selectedQuestions = [];

const questions = {
  javascript: [
    {
      question: "What is the output of 2 + '2'?",
      options: ["4", "22", "NaN", "undefined"],
      answer: "22"
    },
    {
      question: "Which keyword declares a constant?",
      options: ["let", "var", "const", "define"],
      answer: "const"
    }
  ],
  html: [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Trainer Marking Language",
        "Hyper Text Markup Language",
        "Hyper Text Marketing Language",
        "High Text Markdown Language"
      ],
      answer: "Hyper Text Markup Language"
    },
    {
      question: "Which tag creates a hyperlink?",
      options: ["<a>", "<link>", "<href>", "<url>"],
      answer: "<a>"
    }
  ],
  css: [
    {
      question: "Which property changes the text color?",
      options: ["color", "font-color", "text-color", "style"],
      answer: "color"
    },
    {
      question: "What is the correct syntax to center a div?",
      options: [
        "margin: center;",
        "align: center;",
        "text-align: center;",
        "margin: 0 auto;"
      ],
      answer: "margin: 0 auto;"
    }
  ]
};

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", () => location.reload());

function startQuiz() {
  const username = usernameInput.value.trim();
  const category = categorySelect.value;

  if (!username || !category) {
    alert("Enter your name and select a category first!");
    return;
  }

  selectedQuestions = questions[category];
  if (!selectedQuestions || selectedQuestions.length === 0) {
    alert("No questions available for this category.");
    return;
  }

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  currentQuestionIndex = 0;
  currentScore = 0;

  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  const currentQ = selectedQuestions[currentQuestionIndex];
  let timeLeft = 10;

  questionText.textContent = currentQ.question;
  answerOptions.innerHTML = "";

  currentQ.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.addEventListener("click", () => selectAnswer(li, currentQ.answer));
    answerOptions.appendChild(li);
  });

  timerDisplay.textContent = `Time: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout(currentQ.answer);
    }
  }, 1000);

  updateProgress();
}

function selectAnswer(selectedEl, correctAnswer) {
  clearInterval(timer);

  const allOptions = answerOptions.querySelectorAll("li");
  allOptions.forEach(li => {
    li.classList.add(
      li.textContent === correctAnswer ? "correct" : "incorrect"
    );
    li.style.pointerEvents = "none";
  });

  if (selectedEl.textContent === correctAnswer) {
    currentScore++;
  }

  setTimeout(nextQuestion, 1000);
}

function handleTimeout(correctAnswer) {
  const allOptions = answerOptions.querySelectorAll("li");
  allOptions.forEach(li => {
    li.classList.add(
      li.textContent === correctAnswer ? "correct" : "incorrect"
    );
    li.style.pointerEvents = "none";
  });

  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < selectedQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function updateProgress() {
  const progress =
    ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function endQuiz() {
  clearInterval(timer);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  scoreDisplay.textContent = `You scored ${currentScore} out of ${selectedQuestions.length}`;
  const username = usernameInput.value.trim();
  localStorage.setItem("quizScore_" + username, currentScore);
}
