function gameBoard() {
  let board = [];
  // loop that creates an array of 9 strings
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board.push("");
    }
  }

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

  //function that calls for simple returns
  const getBoard = () => board;

  return {
    getBoard,
    updateBoard,
  };
}
