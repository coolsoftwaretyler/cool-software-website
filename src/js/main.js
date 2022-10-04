const hamburger = document.querySelector(".hamburger");
const closeButton = document.querySelector(".close");
const navMenu = document.querySelector("#navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

closeButton.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});
