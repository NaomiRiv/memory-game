const animals = [
  "dolphin",
  "elephant",
  "giraffe",
  "horse",
  "parrot",
  "squirrel",
];
const imgsPath = "img/";
const audioPath = "audio/";

const memoryGame = document.querySelector(".memory-game");
const final = document.querySelector(".final-container");
const playAgainButton = document.querySelector("#play-again-button");
const animalSoundsElement = document.getElementById("animal-sounds");

const TotalPairs = animals.length;

(function addAnimalAudioElements() {
  animals.forEach((animalName) => {
    const el = document.createElement("audio");
    el.setAttribute("src", `${audioPath}${animalName}.mp3`);
    el.setAttribute("preload", "auto");
    el.setAttribute("id", animalName + "Sound");
    animalSoundsElement.appendChild(el);
  });
})();

(function addCards() {
  animals.forEach((animalName) => {
    for (let i = 0; i < 2; i++) {
      const cardEl = document.createElement("div");
      const frontImgEl = document.createElement("img");
      const backImgEl = document.createElement("img");
      cardEl.classList.add("card");
      cardEl.setAttribute("data-framework", animalName);
      frontImgEl.classList.add("front");
      frontImgEl.setAttribute("src", `${imgsPath}${animalName}.jpg`);
      frontImgEl.setAttribute("alt", animalName);
      backImgEl.classList.add("back");
      backImgEl.setAttribute("src", `${imgsPath}back.jpg`);
      cardEl.appendChild(frontImgEl);
      cardEl.appendChild(backImgEl);
      memoryGame.appendChild(cardEl);
    }
  });
})();

const cards = document.querySelectorAll(".card");

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
