const cards = document.querySelectorAll(".card");
const memoryGame = document.querySelector(".memory-game");
const final = document.querySelector(".final-container");
const playAgainButton = document.querySelector("#play-again-button");
const TotalPairs = cards.length / 2;

const animalSoundsElement = document.getElementById("animal-sounds");

const animals = [
  "dolphin",
  "elephant",
  "giraffe",
  "horse",
  "parrot",
  "squirrel",
];

animals.forEach((animalName) => {
  const el = document.createElement("audio");
  el.setAttribute("src", "audio/" + animalName + ".mp3");
  el.setAttribute("preload", "auto");
  el.setAttribute("id", animalName + "Sound");
  animalSoundsElement.appendChild(el);
});

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;

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

    if (checkIfMatched()) {
      playSound();
      disableCardsAfterMatched();
      matchedPairs++;
      if (matchedPairs == TotalPairs) toggleFinished();
    } else {
      unflipCards();
    }
  }
}

function toggleFinished() {
  memoryGame.classList.toggle("faded");
  final.classList.toggle("show");
}

function playSound() {
  const animalName = firstCard.dataset.framework;
  document.getElementById(animalName + "Sound").play();
}

function checkIfMatched() {
  return firstCard.dataset.framework == secondCard.dataset.framework;
}

function disableCardsAfterMatched() {
  firstCard.removeEventListener("click", flipCard);
  firstCard.classList.add("disabled");
  secondCard.removeEventListener("click", flipCard);
  secondCard.classList.add("disabled");

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

function playAgain() {
  flipAllCards();
  enableAllCards();
  toggleFinished();
  resetBoard();
  shuffle();
  addClickEventToCards();
  matchedPairs = 0;
}

function flipAllCards() {
  cards.forEach((card) => {
    card.classList.toggle("flip");
  });
}

function enableAllCards() {
  cards.forEach((card) => {
    card.classList.toggle("disabled");
  });
}
function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}

function addClickEventToCards() {
  cards.forEach((card) => card.addEventListener("click", flipCard));
}

//shuffle();
addClickEventToCards();
playAgainButton.addEventListener("click", playAgain);
