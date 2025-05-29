function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  //this 2d array shows the state of the board
  //row 0 = top of the board and column 0 = left-most of the board
  const initializeBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cells());
      }
    }
  };

  initializeBoard();

  const reset = () => {
    board.length = 0; //clears old references
    initializeBoard();
  };

  //gets the current state of the board
  const getBoard = () => board;

  const markSpot = (row, col, marker) => {
    const cell = board[row][col];

    if (cell.getValue() !== " ") return false;

    cell.addMarker(marker);
    return true;
  };

  return { getBoard, markSpot, reset };
}

function Cells() {
  let value = " ";

  const addMarker = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMarker,
    getValue,
  };
}

function checkWinner(board) {
  const currentBoard = board.getBoard();

  //check rows
  for (let row = 0; row < 3; row++) {
    if (
      currentBoard[row][0].getValue() === currentBoard[row][1].getValue() &&
      currentBoard[row][0].getValue() === currentBoard[row][2].getValue() &&
      currentBoard[row][0].getValue() !== " "
    ) {
      return currentBoard[row][0].getValue();
    }
  }

  //check columns
  for (let col = 0; col < 3; col++) {
    if (
      currentBoard[0][col].getValue() === currentBoard[1][col].getValue() &&
      currentBoard[0][col].getValue() === currentBoard[2][col].getValue() &&
      currentBoard[0][col].getValue() !== " "
    ) {
      return currentBoard[0][col].getValue();
    }
  }

  //check diagonals
  if (
    currentBoard[0][0].getValue() === currentBoard[1][1].getValue() &&
    currentBoard[0][0].getValue() === currentBoard[2][2].getValue() &&
    currentBoard[0][0].getValue() !== " "
  ) {
    return currentBoard[0][0].getValue();
  }

  if (
    currentBoard[0][2].getValue() === currentBoard[1][1].getValue() &&
    currentBoard[0][2].getValue() === currentBoard[2][0].getValue() &&
    currentBoard[0][2].getValue() !== " "
  ) {
    return currentBoard[0][2].getValue();
  }

  const fullBoard = currentBoard.every(
    (row) => row.every((cell) => cell.getValue() !== " ") //goes through each element and sees if it passes the condition set
  );

  if (fullBoard) return "tie";

  return null;
}

function GameController(playerOne = "Player One", playerTwo = "Player Two") {
  const board = gameBoard();
  const players = [
    {
      name: playerOne,
      token: "X",
    },
    {
      name: playerTwo,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    console.log(`It's ${getActivePlayer().name}'s turn.`);

    const wasMarked = board.markSpot(row, column, getActivePlayer().token);
    if (!wasMarked) {
      console.log("Invalid move! Try again.");
      return;
    }

    const isWinner = checkWinner(board);
    const winningPlayer = players.find((p) => p.token === isWinner);
    if (isWinner === "tie") {
      console.log("It's a tie! Game Over!");
      board.reset();
      return;
    } else if (isWinner !== null) {
      console.log(`The winner is ${winningPlayer}! Game Over!`);
      board.reset();
      return;
    }
    switchTurns();
    console.log(board.getBoard());
  };
  return { playRound, getActivePlayer };
}

const game = GameController("Alice", "Bob");
game.playRound(0, 0);
game.playRound(1, 1);
game.playRound(0, 1);
