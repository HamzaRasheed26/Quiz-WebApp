// on link click

const quizLinks = document.querySelectorAll(".quiz-link");

quizLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const category = event.target.dataset.category;

    //window.alert(`You clicked on ${category}`);

    localStorage.setItem("category", category);
  });
});
