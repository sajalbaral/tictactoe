const cells = document.querySelectorAll(".cells");
const controller = GameController();
const resetScore = document.getElementById("resetScore");

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

  initializeBoard(); //creates the board

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
  let scores = {
    X: 0,
    O: 0,
    tie: 0,
  };
  const scoreDisplay = {
    X: document.querySelector(".player .points"),
    O: document.querySelector(".computer .points"),
    tie: document.querySelector(".tie .points"),
  };
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
  let gameOver = false;

  const switchTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const resetGame = () => {
    board.reset();
    activePlayer = players[0];
    resetDisplay();
    gameOver = false;
  };
  const status = document.getElementById("status");

  const playRound = (row, column) => {
    if (gameOver) return null;

    const currentPlayer = getActivePlayer();
    const wasMarked = board.markSpot(row, column, getActivePlayer().token);
    if (!wasMarked) return null;

    const isWinner = checkWinner(board);

    const statusDiv = document.getElementById("status");

    if (isWinner === "tie") {
      gameOver = true;
      scores.tie++;
      scoreDisplay.tie.textContent = scores.tie;
      statusDiv.textContent = "It's a tie!";
      statusDiv.style.display = "block";
      setTimeout(() => {
        resetGame();
        statusDiv.style.display = "none";
        statusDiv.textContent = `Turn: ${players[0].token}`;
      }, 2000);
      return currentPlayer.token;
    }

    if (isWinner !== null) {
      gameOver = true;
      scores[isWinner]++;
      scoreDisplay[isWinner].textContent = scores[isWinner];
      statusDiv.textContent = `${currentPlayer.name} (${currentPlayer.token}) wins!`;
      statusDiv.style.display = "block";
      setTimeout(() => {
        resetGame();
        statusDiv.style.display = "none";
        statusDiv.textContent = `Turn: ${players[0].token}`;
      }, 2000);
      return currentPlayer.token;
    }
    switchTurns();
    statusDiv.textContent = `Turn: ${getActivePlayer().token}`;
    return currentPlayer.token;
  };
  return { playRound, getActivePlayer, scoreDisplay, scores };
}

cells.forEach((cell) => {
  cell.addEventListener("click", clickHandle);
});

function clickHandle(e) {
  const index = e.target.getAttribute("data-index");
  let row = Math.floor(index / 3);
  let column = index % 3;

  const placedToken = controller.playRound(row, column);
  if (!placedToken) return;

  e.target.textContent = placedToken;
  e.target.classList.add(placedToken);
}

function resetDisplay() {
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
  });
}

resetScore.addEventListener("click", () => {
  for (const key in controller.scores) {
    controller.scores[key] = 0;
  }

  for (const key in controller.scoreDisplay) {
    controller.scoreDisplay[key].textContent = 0;
  }
});
