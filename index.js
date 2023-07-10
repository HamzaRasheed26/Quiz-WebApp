const quizContainer = document.getElementById("quiz");
const submitButton = document.getElementById("submit");
const resultsContainer = document.getElementById("results");

// Fetch quiz questions from the API
async function fetchQuizQuestions() {
  try {
    const response = await fetch(
      "https://quizapi.io/api/v1/questions?apiKey=M3JGhR3ZmcosdTPNPZsgzMpkWefJCR1TGqSEnsUe&category=code&difficulty=Medium&limit=10&tags=HTML,JavaScript"
    );
    const data = await response.json();

    const quizData = data.map((questionData) => ({
      question: questionData.question,
      answers: [
        questionData.answers.answer_a,
        questionData.answers.answer_b,
        questionData.answers.answer_c,
        questionData.answers.answer_d,
      ],
      correctAnswer: questionData.correct_answer,
    }));

    return quizData;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return [];
  }
}

async function buildQuiz() {
  const quizData = await fetchQuizQuestions();

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
      `<div class="question">${questionData.question}</div>
      <div class="answers">${answers.join("")}</div>`
    );
  });

  // output.push(
  //   `<div class="question">questionData.question</div>
  //   <div class="answers">answers.join("")</div>`
  // );

  quizContainer.innerHTML = output.join("");
}

function showResults() {
  const answerContainers = quizContainer.getElementsByClassName("answers");
  let numCorrect = 0;

  const quizData = fetchQuizQuestions(); // Fetch quiz questions to match user answers

  quizData.forEach((questionData, index) => {
    const answerContainer = answerContainers[index];
    const selector = `input[name=question${index}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    if (userAnswer === questionData.correctAnswer) {
      numCorrect++;
      answerContainers[index].style.color = "green";
    } else {
      answerContainers[index].style.color = "red";
    }
  });

  resultsContainer.innerHTML = `You got ${numCorrect} out of ${quizData.length} correct!`;
}

// submitButton.addEventListener("click", showResults);

// buildQuiz();
