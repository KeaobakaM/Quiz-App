// DOM elements
const categorySelect = document.getElementById("admin-category");
const questionInput = document.getElementById("question-text");
const optionsInput = document.getElementById("options-text");
const correctAnswerInput = document.getElementById("correct-answer");
const addQuestionBtn = document.getElementById("add-question");
const questionList = document.getElementById("question-list");

// Load questions for selected category
function loadQuestionsForCategory() {
  const category = categorySelect.value;
  const allQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || {};
  const categoryQuestions = allQuestions[category] || [];

  questionList.innerHTML = "";
  categoryQuestions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-item";
    questionDiv.innerHTML = `
            <p><strong>${q.text}</strong></p>
            <p>Options: ${q.options.join(", ")}</p>
            <p>Correct: ${q.answer}</p>
            <button onclick="deleteQuestion(${index})">Delete</button>
        `;
    questionList.appendChild(questionDiv);
  });
}

// Add new question
addQuestionBtn.addEventListener("click", () => {
  const category = categorySelect.value;
  const questionText = questionInput.value.trim();
  const optionsText = optionsInput.value.trim();
  const correctIndex = parseInt(correctAnswerInput.value);

  if (!questionText || !optionsText) {
    alert("Please fill in all fields");
    return;
  }

  const options = optionsText.split(",").map((opt) => opt.trim());
  if (correctIndex < 0 || correctIndex >= options.length) {
    alert("Invalid correct answer index");
    return;
  }

  const newQuestion = {
    text: questionText,
    options: options,
    answer: options[correctIndex],
  };

  // Save to localStorage
  const allQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || {};
  if (!allQuestions[category]) {
    allQuestions[category] = [];
  }

  allQuestions[category].push(newQuestion);
  localStorage.setItem("quizQuestions", JSON.stringify(allQuestions));

  // Clear inputs and reload
  questionInput.value = "";
  optionsInput.value = "";
  correctAnswerInput.value = "0";
  loadQuestionsForCategory();
});

// Delete question
window.deleteQuestion = function (index) {
  const category = categorySelect.value;
  const allQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || {};

  if (allQuestions[category] && allQuestions[category][index]) {
    allQuestions[category].splice(index, 1);
    localStorage.setItem("quizQuestions", JSON.stringify(allQuestions));
    loadQuestionsForCategory();
  }
};
// Save question limit per category
function saveQuestionLimit(category, limit) {
  const limits = JSON.parse(localStorage.getItem("questionLimits")) || {};
  limits[category] = limit;
  localStorage.setItem("questionLimits", JSON.stringify(limits));
}

// Load question limit
function loadQuestionLimit(category) {
  const limits = JSON.parse(localStorage.getItem("questionLimits")) || {};
  return limits[category] || 10; // Default to 10
}

// Update when limit changes
document.getElementById("question-limit").addEventListener("change", (e) => {
  const category = document.getElementById("admin-category").value;
  saveQuestionLimit(category, parseInt(e.target.value));
});

categorySelect.addEventListener("change", () => {
  const limit = loadQuestionLimit(categorySelect.value);
  document.getElementById("question-limit").value = limit;
});

// Initialize
categorySelect.addEventListener("change", loadQuestionsForCategory);
loadQuestionsForCategory();
