const squares = document.querySelectorAll('.square');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

function checkWinner() {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winCombinations) {
    const [a, b, c] = combo;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      gameOver = true;
      message.innerHTML = `${gameBoard[a]} has won!`;
      return;
    }
  }

  if (!gameBoard.includes('')) {
    gameOver = true;
    message.innerHTML = 'It is a tie!';
  }
}

function makeMove(index) {
  if (!gameBoard[index] && !gameOver) {
    gameBoard[index] = currentPlayer;
    squares[index].textContent = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function findBestMove() {
  // 1. Check if AI can win
  for (let i = 0; i < gameBoard.length; i++) {
    if (!gameBoard[i]) {
      gameBoard[i] = 'O';
      if (isWinning('O')) {
        gameBoard[i] = '';
        return i;
      }
      gameBoard[i] = '';
    }
  }

  // 2. Check if AI needs to block player
  for (let i = 0; i < gameBoard.length; i++) {
    if (!gameBoard[i]) {
      gameBoard[i] = 'X';
      if (isWinning('X')) {
        gameBoard[i] = '';
        return i;
      }
      gameBoard[i] = '';
    }
  }

  // 3. Take center if available
  if (!gameBoard[4]) return 4;

  // 4. Take any corner if available
  const corners = [0, 2, 6, 8];
  for (const corner of corners) {
    if (!gameBoard[corner]) return corner;
  }

  // 5. Take any empty square
  for (let i = 0; i < gameBoard.length; i++) {
    if (!gameBoard[i]) return i;
  }

  return null; // No moves left
}

function isWinning(player) {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winCombinations.some(combo => {
    const [a, b, c] = combo;
    return gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === player;
  });
}

// Loop to attach click event listeners to each square
for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener('click', () => {
    makeMove(i);  // Correct function call

    if (!gameOver && currentPlayer === 'O') {  // AI move for 'O'
      const bestMove = findBestMove();
      if (bestMove !== null) makeMove(bestMove);
    }
  });
}

// Reset button functionality
resetButton.addEventListener('click', () => {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  currentPlayer = 'X';
  message.innerText = '';
  squares.forEach(square => square.textContent = '');  // Clear the squares' content
});
