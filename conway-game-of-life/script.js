const COLS = 50;
const ROWS = 50;
const LOOP_TIME = 500;

let arr = generateArr();

const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let interval = null;

canvas.width = COLS * 10;
canvas.height = ROWS * 10;

drawCanvas();
playButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);


canvas.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / 10);
    const y = Math.floor(e.offsetY / 10);
    arr[y][x] = arr[y][x] ? 0 : 1;
    drawCanvas();
});

function generateArr() {
    return Array.from({ length: ROWS }, () => new Array(COLS).fill(0))
}

function drawCanvas() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            ctx.strokeStyle = 'orange';
            ctx.lineWidth = 1;
            ctx.fillStyle = arr[i][j] ? 'black' : 'white';
            ctx.fillRect(j * 10, i * 10, 10, 10);
            ctx.strokeRect(j * 10, i * 10, 10, 10);
        }
    }
}

function startGame() {
    if (!interval) {
        interval = setInterval(() => {
            updateGameGrid();
            drawCanvas();
        }, LOOP_TIME);
    }
}

function stopGame() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

function updateGameGrid() {
    const updatedGrid = generateArr();

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const neighbors = countNeighbors(i, j);

            if (arr[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                updatedGrid[i][j] = 0;
                continue;
            }

            if (arr[i][j] === 0 && neighbors === 3) {
                updatedGrid[i][j] = 1;
                continue
            }

            updatedGrid[i][j] = arr[i][j];
        }
    }

    arr = updatedGrid;
}

function countNeighbors(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    let count = 0;

    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
            count += arr[newRow][newCol];
        }
    }

    return count;
}