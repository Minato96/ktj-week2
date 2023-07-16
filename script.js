// Game variables
let boardSize = 4;
let board = [];
let emptyRow = 0;
let emptyCol = 0;
let moveCount = 0;
let timerInterval;

// Initialize the game
function initGame() {
  board = createBoard();
  renderBoard();
  resetMoveCount();
  resetTimer();
  updateMoveCountDisplay();
  updateTimerDisplay();
  clearLeaderboard();
}

function createBoard() {
    const tiles = Array.from({ length: boardSize * boardSize }, (_, index) => index + 1);
    const board = [];
    let row = [];
  
    for (let i = 0; i < tiles.length; i++) {
      row.push(tiles[i]);
      if (row.length === boardSize) {
        board.push(row);
        row = [];
      }
    }
  
    emptyRow = boardSize - 1;
    emptyCol = boardSize - 1;
    board[emptyRow][emptyCol] = null;
  
    return board;
  }
  
  function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.setProperty('--board-size', boardSize);
    gameBoard.innerHTML = '';
  
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = board[row][col] ? board[row][col] : '';
        tile.addEventListener('click', () => moveTile(row, col));
        gameBoard.appendChild(tile);
      }
    }
  }
  

// Move a tile
function moveTile(row, col) {
  if ((row === emptyRow && Math.abs(col - emptyCol) === 1) || 
      (col === emptyCol && Math.abs(row - emptyRow) === 1)) {
    board[emptyRow][emptyCol] = board[row][col];
    board[row][col] = null;
    emptyRow = row;
    emptyCol = col;
    moveCount++;
    updateMoveCountDisplay();
    renderBoard();
    if (checkWinCondition()) {
      handleGameWin();
    }
  }
}

// Check the win condition
function checkWinCondition() {
  const flattenedBoard = board.flat();
  return flattenedBoard.every((tile, index) => tile === index + 1);
}

// Handle game win
function handleGameWin() {
  stopTimer();
  const time = getFormattedTime();
  const leaderboard = getLeaderboard();
  leaderboard.push(time);
  leaderboard.sort((a, b) => a - b);
  if (leaderboard.length > 5) {
    leaderboard.pop();
  }
  saveLeaderboard(leaderboard);
  renderLeaderboard(leaderboard);
  alert(`Congratulations! You solved the puzzle in ${time} with ${moveCount} moves.`);
}

// Reset the move count
function resetMoveCount() {
  moveCount = 0;
}

// Update the move count display
function updateMoveCountDisplay() {
    const movesDisplay = document.getElementById('moves');
    movesDisplay.textContent = `Moves: ${moveCount}`;
  }

// Reset the timer
function resetTimer() {
  clearInterval(timerInterval);
}

// Start the timer
function startTimer() {
  let seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    updateTimerDisplay(seconds);
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Update the timer display
function updateTimerDisplay(seconds = 0) {
  const timerDisplay = document.getElementById('timer');
  timerDisplay.textContent = `Timer: ${getFormattedTime(seconds)}`;
}

// Get the formatted time in MM:SS format
function getFormattedTime(seconds) {
  const mins = Math.floor((seconds || 0) / 60);
  const secs = (seconds || 0) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Get the leaderboard from local storage
function getLeaderboard() {
  const leaderboardData = localStorage.getItem('leaderboard');
  return leaderboardData ? JSON.parse(leaderboardData) : [];
}

// Save the leaderboard to local storage
function saveLeaderboard(leaderboard) {
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Clear the leaderboard display
function clearLeaderboard() {
  const leaderboardDisplay = document.getElementById('leaderboard');
  leaderboardDisplay.innerHTML = '';
}

// Render the leaderboard
function renderLeaderboard(leaderboard) {
  const leaderboardDisplay = document.getElementById('leaderboard');
  leaderboardDisplay.innerHTML = '<h3>Leaderboard</h3>';
  
  if (leaderboard.length === 0) {
    leaderboardDisplay.innerHTML += '<p>No records yet.</p>';
    return;
  }
  
  const ol = document.createElement('ol');
  leaderboard.forEach((time, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${time}`;
    ol.appendChild(li);
  });
  
  leaderboardDisplay.appendChild(ol);
}

// Event listener for the new game button
const newGameButton = document.getElementById('new-game-button');
newGameButton.addEventListener('click', initGame);

// Event listener for the size select
const sizeSelect = document.getElementById('size-select');
sizeSelect.addEventListener('change', () => {
  boardSize = parseInt(sizeSelect.value);
  initGame();
});

// Event listeners for keyboard input
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveTile(emptyRow + 1, emptyCol);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveTile(emptyRow - 1, emptyCol);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveTile(emptyRow, emptyCol + 1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveTile(emptyRow, emptyCol - 1);
  }
});
// Event listener for the shuffle button inside game-options
const shuffleButton = document.getElementById('shuffle-button');
shuffleButton.addEventListener('click', shuffleTiles);

// Event listener for the shuffle button at the bottom of size-options
const shuffleButtonBottom = document.getElementById('shuffle-button-bottom');
shuffleButtonBottom.addEventListener('click', shuffleTiles);
//shuffle tiles function
function shuffleTiles() {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const randomIndices = Array.from({ length: tiles.length }, (_, index) => index);
  
    for (let i = randomIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomIndices[i], randomIndices[j]] = [randomIndices[j], randomIndices[i]];
    }
  
    tiles.forEach((tile, index) => {
      const rowIndex = Math.floor(index / boardSize);
      const colIndex = index % boardSize;
      const randomTileIndex = randomIndices[index];
      const randomRowIndex = Math.floor(randomTileIndex / boardSize);
      const randomColIndex = randomTileIndex % boardSize;
  
      [board[rowIndex][colIndex], board[randomRowIndex][randomColIndex]] = [
        board[randomRowIndex][randomColIndex],
        board[rowIndex][colIndex],
      ];
  
      if (board[rowIndex][colIndex] === null) {
        emptyRow = rowIndex;
        emptyCol = colIndex;
      }
    });
  
    resetMoveCount();
    updateMoveCountDisplay();
    renderBoard();
  }
  

// Initialize the game
initGame();
