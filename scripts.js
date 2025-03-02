const cards = document.querySelectorAll(".card");

let isFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;

function flipCard() {
  if (lockBoard) return;
  this.classList.toggle("flip");
  if (!isFlippedCard) {
    isFlippedCard = true;
    firstCard = this;
  } else {
    isFlippedCard = false;
    secondCard = this;

    if (firstCard.dataset.framework == secondCard.dataset.framework) {
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        lockBoard = false;
      }, 1500);
    }
  }
}

cards.forEach((card) => card.addEventListener("click", flipCard));
