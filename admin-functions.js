// Admin functions
function showAdminScreen(e) {
  e.preventDefault();
  renderQuestionsList();
  showScreen("admin-screen");
}

function saveQuestion() {
  const category = document.getElementById("category-select").value;
  const text = document.getElementById("question-input").value.trim();
  const options = [];
  let correctAnswer = 0;

  document.querySelectorAll("#answer-inputs input").forEach((input, i) => {
    const option = input.value.trim();
    if (option) {
      options.push(option);
      if (input.dataset.correct === "true") correctAnswer = i;
    }
  });

  if (!text || options.length < 2) return alert("Please fill all fields");

  quizData.categories[category].push({
    id: Date.now(),
    text,
    options,
    correctAnswer,
  });

  saveQuizData();
  document.getElementById("question-input").value = "";
  document
    .querySelectorAll("#answer-inputs input")
    .forEach((input) => (input.value = ""));
  renderQuestionsList();
}

function renderQuestionsList() {
  const questionsListEl = document.getElementById("questions-list");
  questionsListEl.innerHTML = "";

  for (const [category, questions] of Object.entries(quizData.categories)) {
    if (questions.length) {
      const categoryEl = document.createElement("h3");
      categoryEl.textContent = category;
      questionsListEl.appendChild(categoryEl);

      questions.forEach((q, i) => {
        const questionEl = document.createElement("div");
        questionEl.innerHTML = `
                    <p>${i + 1}. ${q.text}</p>
                    <ol>
                        ${q.options
                          .map(
                            (opt, j) =>
                              `<li${
                                j === q.correctAnswer
                                  ? ' style="color:green"'
                                  : ""
                              }>${opt}</li>`
                          )
                          .join("")}
                    </ol>
                    <button onclick="deleteQuestion('${category}', ${i})">Delete</button>
                    <hr>
                `;
        questionsListEl.appendChild(questionEl);
      });
    }
  }
}

function deleteQuestion(category, index) {
  if (confirm("Delete this question?")) {
    quizData.categories[category].splice(index, 1);
    saveQuizData();
    renderQuestionsList();
  }
}

// Make deleteQuestion available globally
window.deleteQuestion = deleteQuestion;
