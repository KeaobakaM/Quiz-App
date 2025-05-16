// Initialize or load quiz data
let quizData = JSON.parse(localStorage.getItem("quizData")) || {
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

// Sample questions if empty
if (quizData.categories.javascript.length === 0) {
  quizData.categories = {
    javascript: [
      {
        id: 1,
        text: "What is the output of 'typeof null' in JavaScript?",
        options: ["object", "null", "undefined", "string"],
        correctAnswer: 0,
      },
    ],
    html: [
      {
        id: 2,
        text: "Which HTML5 element is used for drawing graphics?",
        options: ["<canvas>", "<svg>", "<graphics>", "<draw>"],
        correctAnswer: 0,
      },
    ],
    css: [
      {
        id: 3,
        text: "Which CSS property changes text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: 2,
      },
    ],
    general: [
      {
        id: 4,
        text: "What does API stand for?",
        options: [
          "Application Programming Interface",
          "Automated Programming Interface",
          "Application Process Integration",
          "Automated Process Integration",
        ],
        correctAnswer: 0,
      },
    ],
  };
  localStorage.setItem("quizData", JSON.stringify(quizData));
}
