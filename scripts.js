const rows = 6;
const cols = 11;
const minesCount = 6; // Mengurangi jumlah tambang untuk membuat permainan lebih mudah
let minesweeper = document.getElementById('minesweeper');
let cells = [];
let mines = [];
let flags = 0;
let timerInterval;
let startTime;
let revealedCells = 0;
let gameEnded = false;

document.getElementById('restart').addEventListener('click', restartGame);
document.getElementById('instructions').addEventListener('click', () => {
    document.getElementById('instructionsModal').style.display = 'block';
});
document.getElementById('closeInstructions').addEventListener('click', () => {
    document.getElementById('instructionsModal').style.display = 'none';
});

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    let currentTime = new Date();
    let elapsedTime = Math.floor((currentTime - startTime) / 1000);
    document.getElementById('timer').innerText = `Time: ${elapsedTime}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function createBoard() {
    for (let i = 0; i < rows; i++) {
        cells[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', revealCell);
            cell.addEventListener('contextmenu', toggleFlag);
            cells[i][j] = cell;
            minesweeper.appendChild(cell);
        }
    }
    placeMines();
    calculateNumbers();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < minesCount) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        if (!cells[row][col].classList.contains('mine') && !isCenterArea(row, col)) {
            cells[row][col].classList.add('mine');
            mines.push([row, col]);
            placedMines++;
        }
    }
}

function isCenterArea(row, col) {
    return row >= 2 && row <= 3 && col >= 2 && col <= 3;
}

function calculateNumbers() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!cells[i][j].classList.contains('mine')) {
                let mineCount = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (i + x >= 0 && i + x < rows && j + y >= 0 && j + y < cols) {
                            if (cells[i + x][j + y].classList.contains('mine')) {
                                mineCount++;
                            }
                        }
                    }
                }
                if (mineCount > 0) {
                    cells[i][j].dataset.mineCount = mineCount;
                }
            }
        }
    }
}

function revealCell(e) {
    let cell = e.target;
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);

    if (!startTime) {
        startTimer();
    }

    if (cell.classList.contains('revealed') || cell.classList.contains('flagged') || gameEnded) return;

    cell.classList.add('revealed');
    revealedCells++;

    if (cell.classList.contains('mine')) {
        cell.innerHTML = '💣';
        revealAllMines();
        gameEnded = true;
        setTimeout(() => {
            alert('Game Over!');
            stopTimer();
        }, 100);
    } else {
        let mineCount = cell.dataset.mineCount;
        if (mineCount) {
            cell.innerHTML = mineCount;
        } else {
            revealAdjacentCells(row, col);
        }
        checkWin();
    }
}

function revealAdjacentCells(row, col) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            let newRow = row + x;
            let newCol = col + y;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                let adjacentCell = cells[newRow][newCol];
                if (!adjacentCell.classList.contains('revealed') && !adjacentCell.classList.contains('mine')) {
                    adjacentCell.classList.add('revealed');
                    revealedCells++;
                    if (adjacentCell.dataset.mineCount) {
                        adjacentCell.innerHTML = adjacentCell.dataset.mineCount;
                    } else {
                        revealAdjacentCells(newRow, newCol);
                    }
                }
            }
        }
    }
}

function revealAllMines() {
    for (let mine of mines) {
        let cell = cells[mine[0]][mine[1]];
        cell.classList.add('revealed');
        cell.innerHTML = '🤓';
    }
}

function toggleFlag(e) {
    e.preventDefault();
    let cell = e.target;
    if (cell.classList.contains('revealed') || gameEnded) return;

    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
        cell.innerHTML = '';
        flags--;
    } else {
        cell.classList.add('flagged');
        cell.innerHTML = '😎';
        flags++;
    }
    document.getElementById('flags').innerText = `Flags: ${flags} / ${minesCount}`;
}

function checkWin() {
    if (revealedCells + minesCount === rows * cols) {
        gameEnded = true;
        stopTimer();
        setTimeout(() => {
            alert('Selamat kamu telah menghindari para nerd!😎 progress mu 100%');
        }, 100);
    }
}

function restartGame() {
    stopTimer();
    gameEnded = false;
    minesweeper.innerHTML = '';
    cells = [];
    mines = [];
    flags = 0;
    revealedCells = 0;
    document.getElementById('timer').innerText = 'Waktu 🕐: 0';
    document.getElementById('flags').innerText = `Anti Nerd 😎: 0 / ${minesCount}`;
    createBoard();
}

createBoard();