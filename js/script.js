const symbols = [
    '🍎',
    '🍌',
    '🍇',
    '🍉',
    '🍓',
    '🍒',
    '🥝',
    '🍍'
];

let cards = [];
let firstCard = null;
let secondCard = null;

let moves = 0;
let pairs = 0;

let closeTimer = null;
let gameFinished = false;


/* Создание страницы */

const container = document.createElement('div');
container.classList.add('container');

const header = document.createElement('div');
header.classList.add('header');

const title = document.createElement('h1');
title.textContent = 'Memory Game';

const newGameButton = document.createElement('button');
newGameButton.textContent = 'Новая игра';

const leaderboardButton = document.createElement('button');
leaderboardButton.textContent = 'Таблица лидеров';

const buttons = document.createElement('div');

buttons.append(newGameButton, leaderboardButton);

header.append(title, buttons);


const info = document.createElement('div');
info.classList.add('info');

const movesText = document.createElement('div');
movesText.textContent = 'Ходы: 0';

const pairsText = document.createElement('div');
pairsText.textContent = 'Пары: 0 из 8';

info.append(movesText, pairsText);


const game = document.createElement('div');
game.classList.add('game');


container.append(header, info, game);

document.body.append(container);


