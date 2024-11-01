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

        const readBoard = () => {
            const renderedBoard = board.map((row) => 
            row.map((cell) => cell.getValue()));
            console.log(renderedBoard);
        };

        const makeMove = (x, y, token) => {
            const thisCell = board[x][y];
            if (!thisCell.getValue()) {
                thisCell.addToken(token);
            };
        };

        return { getBoard, readBoard, makeMove };
    }

    const DisplayController = (function () {

        const board = Gameboard();

        const players = [
            {
                name: 'Player 1',
                token: 'X'
            },
            {
                name: 'Player 2',
                token: 'O'
            }
        ];

        let currentPlayer = players[0];

        const alternatePlayer = () => {
            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        };

        const getCurrentPlayer = () => currentPlayer;

        const displayNewRound = () => {
            board.readBoard();
            console.log(
                `${getCurrentPlayer().name}'s turn`
            );
        }



    })();
    
    let thisBoard = Gameboard();
    thisBoard.makeMove(1, 2, "X");
    thisBoard.readBoard();

});