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
     {
       text: "What symbol is used for single-line comments?",
       options: ["//", "#", "<!--", "/*"],
       answer: "//",
     },
     {
       text: "Which method is used to parse a JSON string?",
       options: ["JSON.parse()", "JSON.stringify()", "parse.JSON()", "parse()"],
       answer: "JSON.parse()",
     },
     {
       text: "What does '===' mean in JavaScript?",
       options: [
         "Assignment operator",
         "Equal value and type",
         "Comparison only by value",
         "Error operator",
       ],
       answer: "Equal value and type",
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
     {
       text: "Which tag is used to create a hyperlink?",
       options: ["<a>", "<link>", "<href>", "<url>"],
       answer: "<a>",
     },
     {
       text: "Which tag is used to insert an image?",
       options: ["<pic>", "<image>", "<img>", "<src>"],
       answer: "<img>",
     },
     {
       text: "Which tag defines the largest heading?",
       options: ["<h6>", "<head>", "<heading>", "<h1>"],
       answer: "<h1>",
     },
     {
       text: "Which HTML element is used for inserting a line break?",
       options: ["<break>", "<br>", "<lb>", "<hr>"],
       answer: "<br>",
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
     {
       text: "Which property is used to change text color?",
       options: ["font-color", "text-color", "color", "text-style"],
       answer: "color",
     },
     {
       text: "How do you select an element by its ID in CSS?",
       options: [".idname", "#idname", "*idname", "idname"],
       answer: "#idname",
     },
     {
       text: "Which CSS property controls the text size?",
       options: ["font-style", "text-size", "font-size", "text-style"],
       answer: "font-size",
     },
     {
       text: "Which value of `position` makes an element stay fixed while scrolling?",
       options: ["absolute", "relative", "fixed", "sticky"],
       answer: "fixed",
     },
   ],
   sql: [
     {
       text: "What does SQL stand for?",
       options: [
         "Structured Question Language",
         "Structured Query Language",
         "Simple Query Language",
         "Sequential Query Language",
       ],
       answer: "Structured Query Language",
     },
     {
       text: "Which command is used to retrieve data?",
       options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
       answer: "SELECT",
     },
     {
       text: "Which SQL clause is used to filter results?",
       options: ["WHERE", "ORDER BY", "GROUP BY", "HAVING"],
       answer: "WHERE",
     },
     {
       text: "Which keyword is used to remove a table?",
       options: ["REMOVE", "DELETE", "DROP", "ERASE"],
       answer: "DROP",
     },
     {
       text: "How do you sort results alphabetically?",
       options: ["SORT BY ASC", "ORDER BY ASC", "GROUP BY ASC", "FILTER BY ASC"],
       answer: "ORDER BY ASC",
     },
   ],
   react: [
     {
       text: "What is React mainly used for?",
       options: ["Database", "UI Building", "Routing", "Storage"],
       answer: "UI Building",
     },
     {
       text: "What is JSX?",
       options: [
         "A database language",
         "A browser extension",
         "A syntax extension for JavaScript",
         "A server-side language",
       ],
       answer: "A syntax extension for JavaScript",
     },
     {
       text: "Which hook is used to manage state in a functional component?",
       options: ["useFetch", "useState", "useEffect", "useClass"],
       answer: "useState",
     },
     {
       text: "What is the name of the tool used to create a new React app?",
       options: ["create-react", "react-create", "npx create-react-app", "npm react-init"],
       answer: "npx create-react-app",
     },
     {
       text: "What does the `useEffect` hook do?",
       options: [
         "Manages state",
         "Performs side effects in components",
         "Creates components",
         "Handles props",
       ],
       answer: "Performs side effects in components",
     },
   ],
 };

 localStorage.setItem("quizQuestions", JSON.stringify(defaultQuestions));
}
