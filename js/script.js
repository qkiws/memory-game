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


/* Перемешивание */

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        const temp = array[i];

        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
}


/* Создание карточек */

function createCards() {
    game.textContent = '';

    for (let i = 0; i < cards.length; i++) {
        const card = document.createElement('div');

        card.classList.add('card');

        card.textContent = '?';

        card.dataset.symbol = cards[i];

        card.addEventListener('click', function () {
            openCard(card);
        });

        game.append(card);
    }
}


/* Открытие карточки */

function openCard(card) {

    if (gameFinished) {
        return;
    }

    if (card.classList.contains('open')) {
        return;
    }

    if (card.classList.contains('matched')) {
        return;
    }

    if (secondCard !== null) {
        return;
    }

    card.classList.add('open');

    card.textContent = card.dataset.symbol;


    if (firstCard === null) {
        firstCard = card;

        return;
    }


    secondCard = card;

    moves++;

    movesText.textContent = 'Ходы: ' + moves;

    checkCards();
}


/* Проверка пары */

function checkCards() {

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {

        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        pairs++;

        pairsText.textContent = 'Пары: ' + pairs + ' из 8';

        firstCard = null;
        secondCard = null;


        if (pairs === 8) {
            finishGame();
        }

        return;
    }


    closeTimer = setTimeout(function () {

        firstCard.classList.remove('open');
        secondCard.classList.remove('open');

        firstCard.textContent = '?';
        secondCard.textContent = '?';

        firstCard = null;
        secondCard = null;

        closeTimer = null;

    }, 1000);
}


/* Новая игра */

function newGame() {

    if (closeTimer !== null) {
        clearTimeout(closeTimer);

        closeTimer = null;
    }


    firstCard = null;
    secondCard = null;

    moves = 0;
    pairs = 0;

    gameFinished = false;


    movesText.textContent = 'Ходы: 0';
    pairsText.textContent = 'Пары: 0 из 8';


    cards = symbols.concat(symbols);

    shuffle(cards);

    createCards();
}


/* Победа */

function finishGame() {

    gameFinished = true;

    saveResult(moves);

    setTimeout(function () {

        const title = document.createElement('h2');
        title.textContent = 'Победа!';

        const text = document.createElement('p');
        text.textContent = 'Вы нашли все пары за ' + moves + ' ходов.';

        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'Новая игра';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Закрыть';


        const buttons = document.createElement('div');
        buttons.classList.add('modal-buttons');

        buttons.append(newGameButton, closeButton);


        newGameButton.addEventListener('click', function () {
            closeModal();
            newGame();
        });

        closeButton.addEventListener('click', function () {
            closeModal();
        });


        showModal(title, text, buttons);

    }, 300);
}


/* Работа с модальным окном */

function showModal(title, text, buttons) {

    const background = document.createElement('div');
    background.classList.add('modal-background');

    const modal = document.createElement('div');
    modal.classList.add('modal');


    modal.append(title);
    modal.append(text);

    if (buttons !== null) {
        modal.append(buttons);
    }


    background.append(modal);

    document.body.append(background);

    document.body.classList.add('modal-open');


    background.addEventListener('click', function (event) {

        if (event.target === background) {
            closeModal();
        }

    });


    document.addEventListener('keydown', escapeHandler);
}


function closeModal() {

    const background = document.querySelector('.modal-background');

    if (background !== null) {
        background.remove();
    }

    document.body.classList.remove('modal-open');

    document.removeEventListener('keydown', escapeHandler);
}


function escapeHandler(event) {

    if (event.key === 'Escape') {
        closeModal();
    }
}


/* Таблица лидеров */

function getResults() {

    const data = localStorage.getItem('memoryGameResults');

    if (data === null) {
        return [];
    }

    return JSON.parse(data);
}


function saveResult(moves) {

    const results = getResults();

    const result = {
        moves: moves,
        date: new Date()
    };

    results.push(result);


    results.sort(function (a, b) {

        if (a.moves !== b.moves) {
            return a.moves - b.moves;
        }

        return new Date(a.date) - new Date(b.date);

    });


    const topResults = results.slice(0, 10);

    localStorage.setItem(
        'memoryGameResults',
        JSON.stringify(topResults)
    );
}


/* Открытие таблицы */

function showLeaderboard() {

    const title = document.createElement('h2');
    title.textContent = 'Таблица лидеров';


    const content = document.createElement('div');
    content.classList.add('leaderboard');


    const results = getResults();


    if (results.length === 0) {

        const text = document.createElement('p');

        text.textContent = 'Пока нет результатов.';

        content.append(text);

    } else {

        const header = document.createElement('div');

        header.classList.add('leaderboard-row');

        const place = document.createElement('strong');
        place.textContent = 'Место';

        const moves = document.createElement('strong');
        moves.textContent = 'Ходы';

        const date = document.createElement('strong');
        date.textContent = 'Дата';

        header.append(place, moves, date);

        content.append(header);


        for (let i = 0; i < results.length; i++) {

            const row = document.createElement('div');

            row.classList.add('leaderboard-row');


            const place = document.createElement('span');

            place.textContent = i + 1;


            const moves = document.createElement('span');

            moves.textContent = results[i].moves;


            const date = document.createElement('span');

            date.textContent = formatDate(results[i].date);


            row.append(place, moves, date);

            content.append(row);
        }
    }


    const closeButton = document.createElement('button');

    closeButton.textContent = 'Закрыть';

    closeButton.addEventListener('click', function () {
        closeModal();
    });


    showModal(title, content, closeButton);
}


/* Форматирование даты */

function formatDate(dateString) {

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const year = date.getFullYear();


    return day + '.' + month + '.' + year;
}


/* Кнопки */

newGameButton.addEventListener('click', function () {

    closeModal();

    newGame();

});


leaderboardButton.addEventListener('click', function () {

    showLeaderboard();

});


/* Запуск */

newGame();