const symbols = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🥝', '🍍'];

let cards = symbols.concat(symbols);

let firstCard = null;
let secondCard = null;

let moves = 0;
let pairs = 0;

const container = document.createElement('div');
container.classList.add('container');

const header = document.createElement('div');
header.classList.add('header');

const newGameButton = document.createElement('button');
newGameButton.textContent = 'Новая игра';

const movesText = document.createElement('div');
movesText.textContent = 'Ходы: 0';

const pairsText = document.createElement('div');
pairsText.textContent = 'Пары: 0 из 8';

const info = document.createElement('div');
info.classList.add('info');

const game = document.createElement('div');
game.classList.add('game');

header.append(newGameButton);

info.append(movesText, pairsText);

container.append(header, info, game);

document.body.append(container);


function shuffle() {
    cards.sort(() => Math.random() - 0.5);
}


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


function openCard(card) {
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


function checkCards() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        pairs++;
        pairsText.textContent = 'Пары: ' + pairs + ' из 8';

        firstCard = null;
        secondCard = null;

        return;
    }

    setTimeout(function () {
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');

        firstCard.textContent = '?';
        secondCard.textContent = '?';

        firstCard = null;
        secondCard = null;
    }, 1000);
}


function newGame() {
    cards = symbols.concat(symbols);

    shuffle();

    firstCard = null;
    secondCard = null;

    moves = 0;
    pairs = 0;

    movesText.textContent = 'Ходы: 0';
    pairsText.textContent = 'Пары: 0 из 8';

    createCards();
}


newGameButton.addEventListener('click', newGame);

newGame();