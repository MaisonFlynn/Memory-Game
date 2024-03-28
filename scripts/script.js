// ©2024 Maison Flynn | All Rights Reserved
// Theme Toggle & Save Preference
let body = document.querySelector('body');
let button = document.querySelector('.button');

button.onclick = function () {
  body.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    body.classList.contains('dark') ? 'dark' : 'light'
  );
};

// Apply Saved Theme ON Load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.add(savedTheme);
}

// Initialize Variables
let matched = 0,
  cardOne,
  cardTwo,
  disableDeck = false,
  time = 0,
  moves = 0,
  wins = localStorage.getItem('wins') || 0,
  bestTime = parseInt(localStorage.getItem('bestTime'), 10) || 0,
  timerOn = false,
  timerId;

// DOM Elements
const cards = document.querySelectorAll('.card'),
  timeEl = document.getElementById('time'),
  movesEl = document.getElementById('moves'),
  winsEl = document.getElementById('wins'),
  bestTimeEl = document.getElementById('bestTime');

// Load Wins & Best Time FROM Local Storage
winsEl.textContent = wins;
bestTimeEl.textContent = bestTime > 0 ? formatTime(bestTime) : '00:00';

// Update Timer Function
function updateTimer() {
  time++;
  timeEl.textContent = formatTime(time);
}

// Function TO Start Timer
function startTimer() {
  if (!timerOn) {
    timerId = setInterval(updateTimer, 1000);
    timerOn = true;
  }
}

// Update Moves Function, Increment PER Card Flip
function updateMoves() {
  moves++;
  movesEl.textContent = moves;
}

// Reset Card Function
function resetCards() {
  cardOne = cardTwo = '';
  disableDeck = false;
}

// Flip Card Function
function flipCard({ target: clickedCard }) {
  if (clickedCard !== cardOne && !disableDeck) {
    if (!timerOn) startTimer();
    clickedCard.classList.add('flip');
    if (!cardOne) {
      cardOne = clickedCard;
      updateMoves();
      return;
    }
    cardTwo = clickedCard;
    disableDeck = true;
    updateMoves();
    matchCards(
      cardOne.querySelector('.back img').src,
      cardTwo.querySelector('.back img').src
    );
  }
}

// Match Cards Function
function matchCards(img1, img2) {
  if (img1 === img2) {
    matched++;
    cardOne.classList.add('matched');
    cardTwo.classList.add('matched');

    if (matched === 8) {
      updateWins();
      clearInterval(timerId);
      setTimeout(shuffleCard, 1000);
    }
    cardOne.removeEventListener('click', flipCard);
    cardTwo.removeEventListener('click', flipCard);
    resetCards();
  } else {
    setTimeout(() => {
      cardOne.classList.add('shake');
      cardTwo.classList.add('shake');
    }, 400);

    setTimeout(() => {
      cardOne.classList.remove('shake', 'flip');
      cardTwo.classList.remove('shake', 'flip');
      resetCards();
    }, 1200);
  }
}

// Update Wins & Best Time Function
function updateWins() {
  wins++;
  winsEl.textContent = wins;
  localStorage.setItem('wins', wins);

  if (bestTime === 0 || time < bestTime) {
    bestTime = time;
    bestTimeEl.textContent = formatTime(bestTime);
    localStorage.setItem('bestTime', bestTime);
  }
}

// Shuffle Cards Function
function shuffleCard() {
  matched = 0;
  disableDeck = false;
  cardOne = cardTwo = '';
  time = 0;
  moves = 0;
  timerOn = false;
  clearInterval(timerId);
  timeEl.textContent = '00:00';
  movesEl.textContent = moves;

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => Math.random() - 0.5);

  cards.forEach((card, i) => {
    card.classList.remove('flip', 'matched');
    let imgTag = card.querySelector('.back img');
    imgTag.src = `images/img${arr[i]}.png`;
    card.addEventListener('click', flipCard);
  });
}

// Function TO Format Time MM:SS
function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60),
    remainingSeconds = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${
    remainingSeconds < 10 ? '0' : ''
  }${remainingSeconds}`;
}

// Initial Shuffle & Setup
shuffleCard();
