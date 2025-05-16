// Quiz state
const quizState = {
  username: "",
  category: "",
  questions: [],
  currentIndex: 0,
  score: 0,
  timer: null,
  timeLeft: 0,
  selectedOption: null,
};

// DOM elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const questionCountEl = document.getElementById("question-count");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const highScoresEl = document.getElementById("high-scores");

// Quiz functions
function startQuiz() {
  quizState.username = document.getElementById("username").value.trim();
  if (!quizState.username) return alert("Please enter your name");
  if (!quizState.category) return alert("Please select a category");

  quizState.questions = [...quizData.categories[quizState.category]]
    .sort(() => Math.random() - 0.5)
    .slice(0, quizData.settings.questionsPerQuiz)
    .map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));

  quizState.currentIndex = 0;
  quizState.score = 0;
  showScreen("quiz-screen");
  showQuestion();
}

function showQuestion() {
  const question = quizState.questions[quizState.currentIndex];
  questionEl.textContent = question.text;
  optionsEl.innerHTML = "";

  question.options.forEach((option, i) => {
    const optionEl = document.createElement("div");
    optionEl.className = "option";
    optionEl.textContent = option;
    optionEl.dataset.index = i;
    optionsEl.appendChild(optionEl);
  });

  questionCountEl.textContent = `Question ${quizState.currentIndex + 1}/${
    quizState.questions.length
  }`;
  progressBar.style.width = `${
    (quizState.currentIndex / quizState.questions.length) * 100
  }%`;
  quizState.selectedOption = null;
  document.getElementById("next-btn").style.display = "none";
  startTimer();
}

function checkAnswer(index) {
  quizState.selectedOption = index;
  const question = quizState.questions[quizState.currentIndex];
  const options = document.querySelectorAll(".option");

  options.forEach((opt) => (opt.style.pointerEvents = "none"));
  options[index].style.background =
    index === question.correctAnswer ? "#4CAF50" : "#f44336";

  if (index === question.correctAnswer) {
    quizState.score += 10;
  } else {
    options[question.correctAnswer].style.background = "#4CAF50";
  }

  clearInterval(quizState.timer);
  document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
  quizState.currentIndex++;
  if (quizState.currentIndex < quizState.questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  quizData.highScores.push({
    username: quizState.username,
    category: quizState.category,
    score: quizState.score,
    date: new Date().toLocaleDateString(),
  });

  quizData.highScores.sort((a, b) => b.score - a.score).splice(10);
  saveQuizData();

  document.getElementById(
    "score"
  ).textContent = `${quizState.username}, your score: ${quizState.score}`;

  highScoresEl.innerHTML = quizData.highScores
    .map(
      (score, i) =>
        `<li>${i + 1}. ${score.username} - ${score.score} (${
          score.category
        })</li>`
    )
    .join("");

  showScreen("results-screen");
}

function startTimer() {
  quizState.timeLeft = quizData.settings.timePerQuestion;
  updateTimer();
  quizState.timer = setInterval(() => {
    quizState.timeLeft--;
    updateTimer();
    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timer);
      timeUp();
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = `${quizState.timeLeft}s`;
  timerEl.style.color = quizState.timeLeft <= 10 ? "#f44336" : "#000";
}

function timeUp() {
  if (quizState.selectedOption === null) {
    const question = quizState.questions[quizState.currentIndex];
    document.querySelectorAll(".option").forEach((opt) => {
      opt.style.pointerEvents = "none";
      if (parseInt(opt.dataset.index) === question.correctAnswer) {
        opt.style.background = "#4CAF50";
      }
    });
    document.getElementById("next-btn").style.display = "block";
  }
}

function restartQuiz() {
  showScreen("welcome-screen");
}
