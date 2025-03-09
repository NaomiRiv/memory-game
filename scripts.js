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
const animalSoundsElement = document.querySelector("#animal-sounds");
const numberOfTriesElement = document.querySelector("#number-of-tries");

const TotalPairs = animals.length;

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let cards;
let numberOfTries = 0;

init();

function init() {
  addAnimalAudioElements();
  cards = addCards();
  shuffle();
  addClickEventToCards();
  playAgainButton.addEventListener("click", playAgain);
}

function createAnimalAudioElement(animalName) {
  const audioElement = document.createElement("audio");
  audioElement.setAttribute("src", `${audioPath}${animalName}.mp3`);
  audioElement.setAttribute("preload", "auto");
  audioElement.setAttribute("id", `${animalName}Sound`);
  return audioElement;
}

function addAnimalAudioElements() {
  animals.forEach((animalName) => {
    const audioElement = createAnimalAudioElement(animalName);
    animalSoundsElement.appendChild(audioElement);
  });
}

function createCardElement(animalName) {
  const cardEl = document.createElement("div");
  cardEl.classList.add("card");
  cardEl.setAttribute("data-framework", animalName);

  const frontImgEl = createImageElement(
    `${imgsPath}${animalName}.jpg`,
    animalName,
    "front"
  );
  const backImgEl = createImageElement(`${imgsPath}back.jpg`, "back", "back");

  cardEl.appendChild(frontImgEl);
  cardEl.appendChild(backImgEl);

  return cardEl;
}

function createImageElement(src, alt, className) {
  const imgEl = document.createElement("img");
  imgEl.classList.add(className);
  imgEl.setAttribute("src", src);
  imgEl.setAttribute("alt", alt);

  return imgEl;
}

function addCards() {
  animals.forEach((animalName) => {
    for (let i = 0; i < 2; i++) {
      const cardEl = createCardElement(animalName);
      memoryGame.appendChild(cardEl);
    }
  });
  return document.querySelectorAll(".card");
}

function updateNumberOfTries(numberOfTries) {
  numberOfTriesElement.innerText = numberOfTries;
}

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
    updateNumberOfTries(++numberOfTries);
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
  const soundEl = document.getElementById(`${animalName}Sound`);
  if (soundEl) soundEl.play();
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
  updateNumberOfTries(0);
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
