// Initialize the app
function init() {
  // Set up category buttons
  const categoriesEl = document.getElementById("categories");
  for (const category in quizData.categories) {
    const btn = document.createElement("button");
    btn.className = "category";
    btn.textContent = category;
    btn.onclick = () => {
      document
        .querySelectorAll(".category")
        .forEach((c) => (c.style.background = "#4CAF50"));
      btn.style.background = "#2E7D32";
      quizState.category = category;
    };
    categoriesEl.appendChild(btn);
  }

  // Set up event listeners
  document.getElementById("start-btn").addEventListener("click", startQuiz);
  document.getElementById("next-btn").addEventListener("click", nextQuestion);
  document.getElementById("restart-btn").addEventListener("click", restartQuiz);
  document
    .getElementById("admin-link")
    .addEventListener("click", showAdminScreen);
  document
    .getElementById("back-btn")
    .addEventListener("click", () => showScreen("welcome-screen"));
  document.getElementById("save-btn").addEventListener("click", saveQuestion);

  optionsEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("option") && !quizState.selectedOption) {
      const index = parseInt(e.target.dataset.index);
      checkAnswer(index);
    }
  });

  document.getElementById("answer-inputs").addEventListener("click", (e) => {
    if (e.target.tagName === "INPUT") {
      document.querySelectorAll("#answer-inputs input").forEach((input) => {
        input.dataset.correct = "false";
      });
      e.target.dataset.correct = "true";
    }
  });
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
