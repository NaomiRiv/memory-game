const animals = [
  "dolphin",
  "elephant",
  "giraffe",
  "horse",
  "parrot",
  "squirrel",
];

const leaderBoard = [];

const imgsPath = "img/";
const audioPath = "audio/";

const toShuffle = false; // for debug
const leaderBoardMaxSize = 3;
const memoryGame = document.querySelector(".memory-game");
const final = document.querySelector(".final-container");
const finalContentEl = document.querySelector(".final-content");
const playAgainButton = document.querySelector("#play-again-button");
const playAgainButtonTable = document.querySelector("#play-again-button-table");
const animalSoundsElement = document.querySelector("#animal-sounds");
const numberOfTriesElements = document.querySelectorAll(".number-of-tries");
const leaderBoardBodyElement = document.querySelector(
  "#leader-board-table-body"
);
const leaderBoardEls = document.querySelectorAll(".leadboard-qualified");
const leaderBoardContainerElement = document.querySelector(
  ".leaderboard-container"
);
const textInput = document.querySelector("#name");
const submitButton = document.querySelector("#submit-button");

const TotalPairs = animals.length;

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let cards;
let numberOfTries = 0;

init();

function init() {
  renderNumberOfTries();
  addAnimalAudioElements();
  cards = addCards();
  shuffle();
  addClickEventToCards();
  playAgainButton.addEventListener("click", playAgain);
  playAgainButtonTable.addEventListener("click", playAgainTable);
  textInput.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
      handleNewResult();
      event.preventDefault();
    }
  });
  submitButton.addEventListener("click", handleNewResult);
}

function handleNewResult() {
  addScoreToLeaderBoard(textInput.value, numberOfTries);
  renderLeaderBoard();
  toggleFinalContent();
}

function renderNumberOfTries() {
  numberOfTriesElements.forEach((tries) => {
    tries.innerText = numberOfTries;
  });
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

function updateNumberOfTries(triesNum) {
  numberOfTries = triesNum;
  renderNumberOfTries();
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
      if (matchedPairs == TotalPairs) handleFinished();
    } else {
      unflipCards();
    }
  }
}

function toggleLeaderBoardSubmission() {
  leaderBoardEls.forEach((el) => {
    el.classList.toggle("hidden");
  });
}

function handleFinished() {
  if (checkIfMadeItToLeadBoard()) toggleLeaderBoardSubmission();
  toggleFinished();
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

function toggleFinalContent() {
  finalContentEl.classList.toggle("hidden");
  leaderBoardContainerElement.classList.toggle("hidden");
}

function addHidden(className) {
  els = document.querySelectorAll(`.${className}`);
  els.forEach((el) => {
    el.classList.add("hidden");
  });
}

function playAgain() {
  toggleLeaderBoardSubmission();
  flipAllCards();
  enableAllCards();
  toggleFinished();
  resetBoard();
  shuffle();
  addClickEventToCards();
  addHidden("leadboard-qualified");
  matchedPairs = 0;
  updateNumberOfTries(0);
}

function playAgainTable() {
  toggleFinalContent();
  playAgain();
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
  if (!toShuffle) return;
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}

function addClickEventToCards() {
  cards.forEach((card) => card.addEventListener("click", flipCard));
}

function addToLeaderBoardByIndex(newPlayer, index) {
  index == -1
    ? leaderBoard.push(newPlayer)
    : leaderBoard.splice(index, 0, newPlayer);
}

function addScoreToLeaderBoard(name, score) {
  const newPlayer = { name: name, score: score };
  let leaderBoardLen = leaderBoard.length;
  let index = leaderBoard.findIndex((player) => player.score > newPlayer.score);

  if (leaderBoardLen < leaderBoardMaxSize) {
    addToLeaderBoardByIndex(newPlayer, index);
  } else {
    let minScore = leaderBoard[leaderBoardLen - 1].score;
    if (newPlayer.score > minScore) {
      leaderBoard.pop();
      index = leaderBoard.findIndex((player) => player.score < newPlayer.score);
      addToLeaderBoardByIndex(newPlayer, index);
    }
  }
}

function renderLeaderBoard() {
  leaderBoardBodyElement.innerHTML = "";
  for (i = 0; i < leaderBoard.length; i++) {
    const rowEl = document.createElement("tr");
    const placeEl = document.createElement("td");
    const nameEl = document.createElement("td");
    const scoreEl = document.createElement("td");

    placeEl.innerText = i + 1;
    nameEl.innerText = leaderBoard[i].name;
    scoreEl.innerText = leaderBoard[i].score;

    rowEl.appendChild(placeEl);
    rowEl.appendChild(nameEl);
    rowEl.appendChild(scoreEl);

    leaderBoardBodyElement.appendChild(rowEl);
  }
}

function checkIfMadeItToLeadBoard() {
  let leaderBoardLen = leaderBoard.length;
  if (leaderBoardLen == 0 || leaderBoardLen < leaderBoardMaxSize) return true;
  let maxLeadboardScore = leaderBoard[leaderBoardLen - 1];
  let minLeadboardScore = leaderBoard[0];
  if (
    minLeadboardScore == maxLeadboardScore &&
    numberOfTries == minLeadboardScore
  )
    return false;
  return numberOfTries <= maxLeadboardScore;
}
