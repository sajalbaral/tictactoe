const domCells = document.querySelectorAll(".cell");
const playerTurn = document.getElementById("message");
const resetButton = document.getElementById("reset-button");
const controller = gameController();

function gameBoard() {
  let board = Array(9).fill("");

  //updates the board based on player move
  const updateBoard = (index, marker) => {
    if (index >= 0 && index < board.length) {
      if (board[index] === "") {
        board[index] = marker;
        return "move accepted";
      } else {
        return "space is already taken";
      }
    } else {
      return "invalid move";
    }
  };

  //resets the board with empty strings
  const resetBoard = () => {
    board = Array(9).fill("");
  };

  //function that calls for simple returns
  const getBoard = () => board;
  const reset = () => resetBoard();

  return {
    getBoard,
    updateBoard,
    reset,
  };
}

//used to create the two players
function createPlayer(name, marker) {
  return {
    getName: () => name,
    getMarker: () => marker,
  };
}

//controls the logic of how the game is played
function gameController(playerOne = "Player One", playerTwo = "Player Two") {
  const player1 = createPlayer(playerOne, "X");
  const player2 = createPlayer(playerTwo, "O");
  let currentPlayer = player1;
  let gameOver = false;

  const board = gameBoard();
  const resetGame = () => {
    board.reset();
    gameOver = false;
    currentPlayer = player1;
  };

  //places, updates, and switches players based on the move made
  const playRound = (index) => {
    const marker = currentPlayer.getMarker();
    const result = board.updateBoard(index, marker);

    if (gameOver) return "Game over. Please reset.";

    if (result === "move accepted") {
      const winner = checkWinner(board.getBoard());

      if (winner !== null) {
        gameOver = true;
        return `Player ${winner} wins!`;
      } else if (board.getBoard().every((cell) => cell !== "")) {
        gameOver = true;
        return "It's a tie!";
      }

      switchPlayer();
      return `Player ${currentPlayer.getMarker()}'s turn`;
    }

    return result;
  };

  //logic for switching players
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrPlayer = () => currentPlayer;
  const getBoard = () => board.getBoard;

  return {
    getCurrPlayer,
    playRound,
    getBoard,
    resetGame,
  };
}

function checkWinner(board) {
  const winCombos = [
    [0, 1, 2], //row
    [3, 4, 5], //row
    [6, 7, 8], //row
    [0, 3, 6], //col
    [1, 4, 7], //col
    [2, 5, 8], //col
    [0, 4, 8], //diag
    [2, 4, 6], //diag
  ];

  //loops through the array to check for any winCombos
  for (const [a, b, c] of winCombos) {
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

domCells.forEach((element) => {
  element.addEventListener("click", () => {
    const cellIndex = parseInt(element.getAttribute("data-index"));

    const currentMarker = controller.getCurrPlayer().getMarker();

    const result = controller.playRound(cellIndex);

    if (
      result === "space is already taken" ||
      result === "invalid move" ||
      result === "Game over. Please reset."
    ) {
      alert(result);
      return;
    }

    if (element.innerText === "") {
      element.innerText = currentMarker;
    }

    playerTurn.innerText = result;
  });
});

resetButton.addEventListener("click", () => {
  domCells.forEach((cell) => {
    cell.innerText = "";
  });

  controller.resetGame();
  playerTurn.innerText = `Player ${controller
    .getCurrPlayer()
    .getMarker()}'s turn`;
});
