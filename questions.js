// Default questions if none in localStorage
if (!localStorage.getItem("quizQuestions")) {
  const defaultQuestions = {
    javascript: [
      {
        text: "What is JavaScript?",
        options: [
          "A programming language",
          "A type of coffee",
          "A text editor",
          "An operating system",
        ],
        answer: "A programming language",
      },
      {
        text: "Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "let", "const", "All of the above"],
        answer: "All of the above",
      },
    ],
    html: [
      {
        text: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyperlinks and Text Markup Language",
          "Home Tool Markup Language",
        ],
        answer: "Hyper Text Markup Language",
      },
    ],
    css: [
      {
        text: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Colorful Style Sheets",
        ],
        answer: "Cascading Style Sheets",
      },
    ],
  };

  localStorage.setItem("quizQuestions", JSON.stringify(defaultQuestions));
}
