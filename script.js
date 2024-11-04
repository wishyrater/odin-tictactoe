document.addEventListener("DOMContentLoaded", function() {

    function Cell() {
        let value;

        const addToken = (token) => {
            value = token;
        }

        const getValue = () => value;

        return { addToken, getValue };
    };

    function Gameboard() {
        const rows = 3;
        const columns = 3;
        const board = [];

        // fill the board with cells
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            };
        };

        const getBoard = () => board;

        const makeMove = (x, y, token) => {
            const thisCell = board[x][y];
            if (!thisCell.getValue()) {
                thisCell.addToken(token);
            };
        };

        const readBoard = () => {
            const gridContainer = document.querySelector(".game-container");
            gridContainer.innerHTML = '';

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    const gridItem = document.createElement("div");
                    gridItem.setAttribute("class", "game-item");
                    gridItem.setAttribute("data-row", i);
                    gridItem.setAttribute("data-col", j);
                    gridItem.textContent = board[i][j].getValue();
                    gridContainer.appendChild(gridItem);
                }
            }
        };

        let winner = false;

        const checkWinner = () => {
            // check rows
            for (let i = 0; i < 3; i++) {
                const row = board[i];
                let sum = 0;
                const tokenToCheck = board[i][0].getValue();
                if (tokenToCheck) {
                    for (let j in row) {
                        row[j].getValue() === tokenToCheck ? sum++ : 0;
                    }
                    sum === 3 ? winner = true : 0;
                }
            }

            // check columns
            for (let i = 0; i < 3; i++) {
                const tokenToCheck = board[0][i].getValue();
                if (tokenToCheck) {
                    let sum = 0;
                    for (let j = 0; j < 3; j++) {
                        board[j][i].getValue() === tokenToCheck ? sum++ : 0;
                    }
                    sum === 3 ? winner = true : 0;
                }
            }

            // check diagonals
            for (let i = 0; i < 2; i++) {
                const tokenToCheck = i === 0 ? board[0][0].getValue() : board[2][0].getValue();
                if (tokenToCheck && i === 0) {
                    let sum = 0;
                    for (let j = 0; j < 3; j++) {
                        board[j][j].getValue() === tokenToCheck ? sum++ : 0;
                    }
                    sum === 3 ? winner = true : 0;
                } else if (tokenToCheck && i === 1) {
                    let sum = 0
                    for (let j = 2; j >= 0; j--) {
                        board[j][2 - j].getValue() === tokenToCheck ? sum++ : 0;
                    }
                    sum === 3 ? winner = true : 0;
                };
            };
        };

        const getWinnerStatus = () => winner;

        let tie = false;

        const checkTie = () => {
            let availableCells = 0;
            for (let i in board) {
                for (let j in board[i]) {
                    if (!board[i][j].getValue()) { 
                        availableCells++;
                     };
                }
            }
            availableCells === 0 ? tie = true : 0;
        }

        const getTieStatus = () => tie;

        function getCellFreeStatus(x, y) {
            if (!board[x][y].getValue()) {
                return true;
            } else {
                return false;
            }
        }

        return { getBoard, readBoard, makeMove, checkWinner, checkTie, getWinnerStatus, getTieStatus, getCellFreeStatus };
    };

    const DisplayController = (function () {

        let board = Gameboard();

        let players = [
            {
                name: 'Player 1',
                token: 'X',
                score: 0,
            },
            {
                name: 'Player 2',
                token: 'O',
                score: 0,
            }
        ];

        const setPlayerNames = (playerOne, playerTwo) => {
            players[0].name = playerOne;
            players[1].name = playerTwo;
        }

        let currentPlayer = players[0];

        const alternatePlayer = () => {
            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        };

        const displayScores = () => {
            const scoreContainer = document.querySelector(".score-container");
            scoreContainer.innerHTML = '';
            players.map((player) => {
                const playerScore = document.createElement("p");
                playerScore.textContent = `${player.name}'s score: ${player.score}`;
                scoreContainer.appendChild(playerScore);
            });
        };

        const getCurrentPlayer = () => currentPlayer;
        const addPlayerScore = (player) => {
            player.score++;
        };

        const displayNewRound = () => {
            board.readBoard();
            const headingContainer = document.querySelector("h2");
            headingContainer.textContent = `${getCurrentPlayer().name}'s turn`;
        };

        const playRound = (x, y) => {
            if (board.getCellFreeStatus(x, y)) {
                board.makeMove(x, y, getCurrentPlayer().token);

                // check for a winner
                board.checkWinner();
                if (board.getWinnerStatus()) {
                    currentPlayer.score++;
                    displayScores();
                    board = Gameboard();
                }
    
                // check for a tie
                board.checkTie();
                if (board.getTieStatus()) {
                    board = Gameboard();
                }
    
                alternatePlayer();
                displayNewRound();
            }
        }
        return { alternatePlayer, getCurrentPlayer, displayNewRound, playRound, addPlayerScore, displayScores, setPlayerNames }
    })();

    const startButton = document.querySelector("button[type='submit']");
    const playerOneInput = document.querySelector("#player-one-name");
    const playerTwoInput = document.querySelector("#player-two-name");
    const main = document.querySelector("main");
    startButton.addEventListener("click", (e) => {
        e.preventDefault();
        DisplayController.setPlayerNames(playerOneInput.value, playerTwoInput.value);
        main.style.visibility = "visible";
        DisplayController.displayNewRound();
        DisplayController.displayScores();
    });

    const gameContainer = document.querySelector(".game-container");
    gameContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("game-item")) {
            const item = e.target;
            const row = item.getAttribute("data-row");
            const col = item.getAttribute("data-col");

            DisplayController.playRound(row, col, DisplayController.getCurrentPlayer().token);
        }
    });
});