const cards = document.querySelectorAll(".card");

const dolphinSound = document.getElementById("dolphinSound");
const elephantSound = document.getElementById("elephantSound");
const giraffeSound = document.getElementById("giraffeSound");
const horseSound = document.getElementById("horseSound");
const parrotSound = document.getElementById("parrotSound");
const squirrelSound = document.getElementById("squirrelSound");

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return; // in case of double click

  this.classList.toggle("flip");

  if (!hasFlippedCard) {
    // chose one card
    hasFlippedCard = true;
    firstCard = this;
  } else {
    // chose two cards
    secondCard = this;

    let isMatched = checkIfMatched();
    isMatched ? (playSound(), disableCardsAfterMatched()) : unflipCards();
  }
}

function playSound() {
  switch (firstCard.dataset.framework) {
    case "dolphin":
      dolphinSound.play();
      break;
    case "elephant":
      elephantSound.play();
      break;
    case "giraffe":
      giraffeSound.play();
      break;
    case "horse":
      horseSound.play();
      break;
    case "parrot":
      parrotSound.play();
      break;
    case "squirrel":
      squirrelSound.play();
      break;
  }
}

function checkIfMatched() {
  return (isMatched =
    firstCard.dataset.framework == secondCard.dataset.framework);
}

function disableCardsAfterMatched() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));
