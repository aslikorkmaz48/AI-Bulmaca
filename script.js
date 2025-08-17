const boardSize = 10;
const words = ["AI", "NEURAL", "DATA", "MODEL", "ALGORITHM", "CHATGPT", "ROBOT"];
let foundWords = [];

const boardElement = document.getElementById("game-board");
const foundList = document.getElementById("found-list");
const message = document.getElementById("message");

let board = [];
let selectedCells = [];

// Board oluştur
function generateBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(''));
    placeWords();
    fillEmptyCells();
    renderBoard();
}

// Kelimeleri yerleştir
function placeWords() {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const dir = Math.random() < 0.5 ? 'H' : 'V';
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);

            if (canPlace(word, row, col, dir)) {
                for (let i = 0; i < word.length; i++) {
                    if (dir === 'H') board[row][col + i] = word[i];
                    else board[row + i][col] = word[i];
                }
                placed = true;
            }
        }
    });
}

function canPlace(word, row, col, dir) {
    if (dir === 'H') {
        if (col + word.length > boardSize) return false;
        for (let i = 0; i < word.length; i++)
            if (board[row][col + i] !== '') return false;
    } else {
        if (row + word.length > boardSize) return false;
        for (let i = 0; i < word.length; i++)
            if (board[row + i][col] !== '') return false;
    }
    return true;
}

// Boş hücreleri doldur
function fillEmptyCells() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === '') board[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
    }
}

// Board'u DOM'a render et
function renderBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = board[r][c];
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', selectCell);
            boardElement.appendChild(cell);
        }
    }
}

// Hücre seçimi
function selectCell(e) {
    const cell = e.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        selectedCells = selectedCells.filter(sc => sc.row !== r || sc.col !== c);
    } else {
        cell.classList.add('selected');
        selectedCells.push({ row: r, col: c });
    }

    checkWords();
}

// Seçilen kelimeleri kontrol et
function checkWords() {
    const seqH = [];
    const seqV = [];

    selectedCells.forEach(cell => {
        seqH[cell.row] = seqH[cell.row] ? seqH[cell.row] + board[cell.row][cell.col] : board[cell.row][cell.col];
        seqV[cell.col] = seqV[cell.col] ? seqV[cell.col] + board[cell.row][cell.col] : board[cell.row][cell.col];
    });

    words.forEach(word => {
        if (!foundWords.includes(word)) {
            selectedCells.forEach(cell => {
                // yatay
                for (let i = 0; i <= boardSize - word.length; i++) {
                    let str = '';
                    for (let j = 0; j < word.length; j++) {
                        str += board[cell.row][i + j];
                    }
                    if (str === word) {
                        markWordH(cell.row, i, word.length);
                        foundWords.push(word);
                        updateFoundWords();
                    }
                }
                // dikey
                for (let i = 0; i <= boardSize - word.length; i++) {
                    let str = '';
                    for (let j = 0; j < word.length; j++) {
                        str += board[i + j][cell.col];
                    }
                    if (str === word) {
                        markWordV(i, cell.col, word.length);
                        foundWords.push(word);
                        updateFoundWords();
                    }
                }
            });
        }
    });

    if (foundWords.length === words.length) {
        message.textContent = "🎉 Tüm kelimeleri buldun! Harika!";
    }
}

function markWordH(row, start, length) {
    for (let i = 0; i < length; i++) {
        document.querySelector(`.cell[data-row="${row}"][data-col="${start+i}"]`).classList.add('selected');
    }
}

function markWordV(start, col, length) {
    for (let i = 0; i < length; i++) {
        document.querySelector(`.cell[data-row="${start+i}"][data-col="${col}"]`).classList.add('selected');
    }
}

function updateFoundWords() {
    foundList.textContent = foundWords.join(', ');
}

generateBoard();