function gameBoard() {
  let board = [];
  // loop that creates an array of 9 strings
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board.push("");
    }
  }

  //function that calls for simple returns
  const getBoard = () => board;

  return {
    getBoard,
  };
}
