let timerElement = document.getElementById("timer");
let timeLeft = 60;
let timerInterval;
const startButton = document.getElementById("startButton");
const quizContainer = document.getElementById("quizContainer");
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById("submit-player");
const previousButton = document.getElementById("previous-question");
const nextButton = document.getElementById("next-question");
let slides = Array.from(document.querySelectorAll(".slide"));
let currentSlide = 0;
let answeredQuestions = 0;
const playerNameInput = document.getElementById("playerName");
const submitPlayerButton = document.getElementById("submit-player");
const highScoresList = document.getElementById("highScoresList");
const scoresList = document.getElementById("scoresList");
let highScores = [];

// QUIZ QUESTIONS
const quizQuestions = [
  {
    question: "How do you comment a single line in JavaScript?",
    answers: {
      a: "<!-- This is a comment -->",
      b: "# This is a comment",
      c: "// This is a comment",
      d: "/* This is a comment */"
    },
    correctAnswer: "c"
  },
  {
    question: "How do you access the length of an array called myArray in JavaScript?",
    answers: {
      a: "myArray.length()",
      b: "myArray.size",
      c: "myArray.length",
      d: "myArray.size()"
    },
    correctAnswer: "a"
  },
  {
    question: "Which method can be used to add elements to the end of an array in JavaScript",
    answers: {
      a: "array.insert()",
      b: "array.push()",
      c: "array.add()",
      d: "array.append()"
    },
    correctAnswer: "b"
  },
  {
    question: "What is the purpose of the return statement in a function?",
    answers: {
      a: "To define the function's parameters",
      b: "To stop the execution of the function",
      c: "To display a message in the console",
      d: "To specify the value the function will return"
    },
    correctAnswer: "b"
  },
  {
    question: "What does the typeof operator do in JavaScript?",
    answers: {
      a: "Checks if a variable is undefined",
      b: "Returns the data type of a variable",
      c: "Converts a string to a number",
      d: "Checks if a variable is null"
    },
    correctAnswer: "b"
  },
  {
    question: "What is the correct way to create an array in JavaScript?",
    answers: {
      a: "let myArray = [];",
      b: "var myArray = ();",
      c: "array myArray = [];",
      d: "[myArray]"
    },
    correctAnswer: "a"
  },
  {
    question: "Which method can be used to convert a string to lowercase letters?",
    answers: {
      a: "toLowerCase()",
      b: "toLower()",
      c: "changeCase(lower)",
      d: "lowercase()"
    },
    correctAnswer: "a"
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    answers: {
      a: "var",
      b: "const",
      c: "let",
      d: "int"
    },
    correctAnswer: "a"
  },
  {
    question: "What is the correct syntax to write a function named add that takes two parameters, a and b, and returns their sum?",
    answers: {
      a: "function add(a, b) { return a - b; }",
      b: "function add(a, b) { return a * b; }",
      c: "function add(a, b) { return a + b; }",
      d: "function add(a, b) { return a / b; }"
    },
    correctAnswer: "c"
  },
  {
    question: "What is the file abbreviation at the end of Javascript files?",
    answers: {
      a: ".jvs",
      b: ".script",
      c: ".js",
      d: ".java"
    },
    correctAnswer: "c"
  },
];

// TIMER FUNCTIONALITY
function startTimer() {
  timerInterval = setInterval(function () {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

// SLIDE FUNCTIONALITY
function showPreviousSlide() {
  slides[currentSlide].classList.remove("active-slide");
  currentSlide--;
  slides[currentSlide].classList.add("active-slide");
}

function showNextSlide() {
  slides[currentSlide].classList.remove("active-slide");
  currentSlide++;
  if (currentSlide < slides.length) {
    slides[currentSlide].classList.add("active-slide");
  } else {
    endQuiz();
  }
  
  timeLeft = parseInt(timerElement.textContent);
}

function endQuiz() {
  clearInterval(timerInterval);
  quizContainer.classList.add("hidden");
  resultsContainer.classList.remove("hidden");
  
  const score = timeLeft > 0 ? timeLeft : 0;
  resultsContainer.querySelector("#score").textContent = score;
}


function buildQuiz() {
  const output = [];

  quizQuestions.forEach((currentQuestion, questionNumber) => {
    const answers = [];

    for (letter in currentQuestion.answers) {
      answers.push(
        `<label>
          <input type="radio" name="answer" value="${letter}">
          <span>${currentQuestion.answers[letter]}</span>
        </label>`
      );
    }

    output.push(
      `<div class="slide">
        <div class="question">${currentQuestion.question}</div>
        <div class="answers">${answers.join("")}</div>
      </div>`
    );
  });

  quizContainer.innerHTML = output.join("");
  slides = Array.from(document.querySelectorAll(".slide"));
  slides[0].classList.add("active-slide");
}

function showQuiz() {
  const beginQuizSection = document.getElementById("quizIntro");
  beginQuizSection.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  startTimer();
  buildQuiz();
}

startButton.addEventListener("click", showQuiz);

quizContainer.addEventListener("change", () => {
  const answerContainers = quizContainer.querySelectorAll(".answers");

  quizQuestions.forEach((currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=answer]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    if (userAnswer) {
      if (userAnswer === currentQuestion.correctAnswer) {
        answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        answerContainers[questionNumber].style.color = "red";
        timeLeft -= 10;
      }
      answeredQuestions++;
      setTimeout(showNextSlide, 1000);
    }
  });

  if (answeredQuestions === quizQuestions.length) {
    endQuiz();
  }
});

// HIGH SCORES FUNCTIONALITY
submitButton.addEventListener("click", addHighScore);

function saveHighScores() {
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function loadHighScores() {
  const storedHighScores = localStorage.getItem("highScores");
  if (storedHighScores) {
    highScores = JSON.parse(storedHighScores);
  }
}

function addHighScore(playerName, score) {
  highScores.push({ name: playerName, score: score });
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5); 
  saveHighScores();
  displayHighScores();
  console.log(highScores);
}

function displayHighScores() {
  scoresList.innerHTML = highScores
    .map((highScore) => `<li>${highScore.name}: ${highScore.score}</li>`)
    .join("");
}

submitPlayerButton.addEventListener("click", () => {
  const playerName = playerNameInput.value.trim();
  if (playerName !== "") {
    const score = parseInt(resultsContainer.querySelector("#score").textContent);
    addHighScore(playerName, score);
    resultsContainer.classList.add("hidden");
    highScoresList.classList.remove("hidden");
    displayHighScores();
  }
});


loadHighScores();
displayHighScores();

