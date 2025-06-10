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
    resetBoard,
  };
}

//controls the logic of how the game is played
function gameController(playerOne = "Player One", playerTwo = "Player Two") {
  const player1 = createPlayer(playerOne, "X");
  const player2 = createPlayer(playerTwo, "O");
  let currentPlayer = player1;

  const board = gameBoard();

  //places, updates, and switches players based on the move made
  const playRound = (index) => {
    const marker = currentPlayer.getMarker();
    const result = board.updateBoard(index, marker);

    if (result === "move accepted") {
      switchPlayer();
    }
  };

  //logic for switching players
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrPlayer = () => currentPlayer;

  return {
    getCurrPlayer,
    playRound,
    getBoard: board.getBoard,
  };
}
