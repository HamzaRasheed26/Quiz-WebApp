const category = localStorage.getItem("category");
const quizContainer = document.getElementById("quiz-block");
let quizData = [];

document.getElementById("topic").innerHTML = "Topic: " + category;
document.getElementById("topic-st").innerHTML =
  "Just started learning " +
  category +
  "? <br /> Test your " +
  category +
  " knowledge by answering these 10 common interview questions!";

console.log(category);

function getApi() {
  let api = "";
  // if (category == "Html") {
  api =
    "https://quizapi.io/api/v1/questions?apiKey=M3JGhR3ZmcosdTPNPZsgzMpkWefJCR1TGqSEnsUe&category=code&difficulty=Medium&limit=10&tags=HTML";
  // }
  return api;
}

// Fetch quiz questions from the API
async function fetchQuizQuestions() {
  let api = getApi();
  try {
    const response = await fetch(api);
    const data = await response.json();

    const quizData = data.map((questionData) => ({
      question: questionData.question,
      answers: [
        questionData.answers.answer_a,
        questionData.answers.answer_b,
        questionData.answers.answer_c,
        questionData.answers.answer_d,
      ],
      correctAnswer: Object.keys(questionData.correct_answers).find((key) => questionData.correct_answers[key] === "true"),
    }));
    return quizData;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return [];
  }
}

async function buildQuiz() {
  quizData = await fetchQuizQuestions();
  const output = [];

  quizData.forEach((questionData, index) => {
    const answers = [];
    for (let i = 0; i < questionData.answers.length; i++) {
      answers.push(
        `<label>
            <input type="radio" name="question${index}" value="${questionData.answers[i]}">
            ${questionData.answers[i]}
          </label><br>`
      );
    }

    output.push(
      `<div class="question">${index+1}: ${questionData.question}</div>
        <div class="answers">${answers.join("")}</div>`
    );
  });

  quizContainer.innerHTML = output.join("");
}

buildQuiz();

const submitButton = document.querySelector(".submit-quiz button");
const resultContainer = document.querySelector(".result");

// Function to check the answers and display the result
function checkAnswers() {
  const answerContainers = quizContainer.getElementsByClassName("answers");
  let score = 0;

  // Loop through each question
  for (let i = 0; i < answerContainers.length; i++) {
    const answerContainer = answerContainers[i];
    const selector = `input[name=question${i}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    console.log(userAnswer + " " + quizData[i].correctAnswer);
    // Check if the user's answer is correct
    if (userAnswer === quizData[i].correctAnswer) {
      score++;
      answerContainer.style.color = "green";
    } else {
      answerContainer.style.color = "red";
    }
  }

  // Display the quiz result
  const totalQuestions = quizData.length;
  const percentage = (score / totalQuestions) * 100;
  const resultMessage = `You scored ${score}/${totalQuestions}. Percentage: ${percentage.toFixed(2)}%`;
  resultContainer.textContent = resultMessage;
}

submitButton.addEventListener("click", checkAnswers);
