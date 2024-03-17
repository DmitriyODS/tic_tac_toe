const btnContinueGame = document.getElementById('btn-continue-game');
const btnNewGame = document.getElementById('btn-new-game');
const btnPauseGame = document.getElementById('btn-pause-game');
const field = document.getElementById('field');
const curPlayer = document.getElementById('cur-player-text');
const dialogTitle = document.getElementById('dialog-title');

class DialogMainMenu {
    constructor() {
        this.dialog = document.getElementById('main-menu');
    }

    open() {
        this.dialog.dataset.open = "true";
    }

    close() {
        this.dialog.dataset.open = "false";
    }
}

const dialogMainMenu = new DialogMainMenu();

class Game {
    constructor() {
        this.isRunning = false;
        this.field = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.winLines = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
        this.curPlayer = 0;
    }

    start() {
        this.isRunning = true;
        this.field = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.curPlayer = 0;
        this.render();
    }

    continue() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    stop() {
        this.isRunning = false;
        this.field = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.curPlayer = 0;
    }

    render() {
        field.innerHTML = '';
        this.field.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellEl = document.createElement('div');
                cellEl.classList.add('cell');
                cellEl.dataset.row = i.toString();
                cellEl.dataset.col = j.toString();
                cellEl.addEventListener('click', () => {
                    if (this.isRunning) {
                        this.makeMove(i, j);
                    }
                });
                cellEl.textContent = cell === 0 ? '*' : cell === 1 ? 'X' : 'O';
                field.appendChild(cellEl);
            });
        });

        if (this.curPlayer === 0) {
            curPlayer.textContent = 'Ход - крестик';
        } else {
            curPlayer.textContent = 'Ход - нолик';
        }
    }

    makeMove(row, col) {
        if (this.field[row][col] === 0) {
            this.field[row][col] = this.curPlayer + 1;
            this.curPlayer = this.curPlayer === 0 ? 1 : 0;
        }

        this.render();
        const winner = this.checkWinner();
        if (winner !== 0) {
            this.stop();
            dialogTitle.textContent = winner === 1 ? 'Победил крестик' : 'Победил нолик';
            btnContinueGame.disabled = true;
            dialogMainMenu.open();
            return;
        }

        if (this.field.every(row => row.every(cell => cell !== 0))) {
            this.stop();
            dialogTitle.textContent = 'Ничья';
            btnContinueGame.disabled = true;
            dialogMainMenu.open();
        }
    }

    checkWinner() {
        for (let i = 0; i < this.winLines.length; i++) {
            const line = this.winLines[i];
            const a = this.field[line[0][0]][line[0][1]];
            const b = this.field[line[1][0]][line[1][1]];
            const c = this.field[line[2][0]][line[2][1]];
            if (a === b && b === c && a !== 0) {
                return a;
            }
        }
        return 0;
    }
}

const game = new Game();

dialogMainMenu.open();
btnContinueGame.disabled = true;
game.render();

btnContinueGame.addEventListener('click', () => {
    game.continue();
    dialogMainMenu.close();
});

btnNewGame.addEventListener('click', () => {
    game.start();
    dialogMainMenu.close();
});

btnPauseGame.addEventListener('click', () => {
    btnContinueGame.disabled = false;
    dialogTitle.textContent = 'Игра на паузе';
    game.pause();
    dialogMainMenu.open();
});
