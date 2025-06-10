
// Sample Sudoku puzzle: 0 = blank
// Get the board container element
const board = document.getElementById('sudoku-board');

// Sample Sudoku puzzle array (0 = empty cell)
 window.sudokuPuzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

 window.sudokuSolution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];




// Function to render the Sudoku board dynamically
function renderBoard(puzzle) {
  board.innerHTML = ''; // Clear the board first

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellValue = puzzle[row][col];
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');

      // Add bold borders for 3x3 boxes
      if ((col + 1) % 3 === 0 && col !== 8) {
        cellDiv.style.borderRight = '3px solid black';
      }
      if ((row + 1) % 3 === 0 && row !== 8) {
        cellDiv.style.borderBottom = '3px solid black';
      }

      // Prefilled cells
      if (cellValue !== 0) {
        cellDiv.classList.add('prefilled');
        cellDiv.textContent = cellValue;
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.pattern = '[1-9]';
        input.autocomplete = 'off';

        // Allow only digits 1-9
        input.addEventListener('input', () => {
          input.value = input.value.replace(/[^1-9]/g, '');
        });

        cellDiv.appendChild(input);
      }

      board.appendChild(cellDiv);
    }
  }
}


// Wait for the DOM to load before rendering the board
window.addEventListener('DOMContentLoaded', () => {
  renderBoard(sudokuPuzzle);
  updateScoreDisplay(); // show score on first load


});


// renderBoard(currentPuzzle);






// 🔁 Reset Button – clears only user-filled inputs
document.getElementById("reset").addEventListener("click", () => {
  const inputs = document.querySelectorAll(".cell input");
  inputs.forEach(input => {
    input.value = '';
  });
});


// ✅ Check Button – very basic version for now
document.getElementById("check").addEventListener("click", () => {
  const inputs = document.querySelectorAll(".cell input");
  let isCorrect = true;
  let inputIndex = 0;

  // Clear previous highlights
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("correct", "incorrect");
  });

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (sudokuPuzzle[row][col] === 0) {
        const userValue = inputs[inputIndex].value;
        const parentCell = inputs[inputIndex].parentElement;

        if (parseInt(userValue) === sudokuSolution[row][col]) {
          parentCell.classList.add("correct");
        } else {
          parentCell.classList.add("incorrect");
          isCorrect = false;
        }

        inputIndex++;
      }
    }
  }

  if (isCorrect) {
    alert("✅ Congratulations! Puzzle Solved Correctly!");
  }
  
  else {
    alert("❌ Some values are incorrect. Wrong cells are highlighted in red.");
  }
  saveScore();
});


// 🆕 New Game – placeholder (actual logic in Step 8)
document.getElementById("new-game").addEventListener("click", () => {
  const clues = parseInt(document.getElementById("difficulty").value);
  const solved = generateSolvedBoard();
  const puzzle = createPuzzle(solved, clues);
  renderBoard(puzzle);

  window.sudokuPuzzle = puzzle;
  window.sudokuSolution = solved;
});




// Restrict input to digits 1–9
document.addEventListener("input", function (event) {
  const target = event.target;
  if (target.classList.contains("sudoku-cell") && !target.disabled) {
    const val = target.value;
    // Allow only digits 1–9
    if (!/^[1-9]$/.test(val)) {
      target.value = ''; // Clear invalid input
    }
  }
});



function generateSolvedBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (
        board[row][x] === num || // Row check
        board[x][col] === num || // Column check
        board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + (x % 3)] === num // Box check
      ) {
        return false;
      }
    }
    return true;
  }

  function solve(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5); // shuffle
          for (let num of nums) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(board);
  return board;
}




function createPuzzle(solvedBoard, clues = 30) {
  const puzzle = solvedBoard.map(row => row.slice()); // deep copy

  let attempts = 81 - clues;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      attempts--;
    }
  }

  return puzzle;
}


document.getElementById("hint").addEventListener("click", () => {
  const inputs = document.querySelectorAll(".cell input");
  let inputIndex = 0;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (sudokuPuzzle[row][col] === 0) {
        const userValue = inputs[inputIndex].value;
        if (userValue === "") {
          inputs[inputIndex].value = sudokuSolution[row][col];
          inputs[inputIndex].parentElement.classList.add("hinted");
          return; // Stop after one hint
        }
        inputIndex++;
      }
    }
  }
});



let startTime;
let timerInterval;

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval); // Clear previous timer
  timerInterval = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    document.getElementById("time").textContent = `${minutes}:${seconds}`;
  }, 1000);
}

startTimer();


function saveScore() {
  const totalSolved = parseInt(localStorage.getItem('solved') || '0') + 1;
  localStorage.setItem('solved', totalSolved);
  updateScoreDisplay(); // update UI
  alert(`🎉 Puzzle solved! Total puzzles solved: ${totalSolved}`);
}

function updateScoreDisplay() {
  const count = parseInt(localStorage.getItem('solved') || '0');
  document.getElementById('score-count').textContent = count;
}


document.getElementById("reset-score").addEventListener("click", () => {
  localStorage.removeItem('solved');
  updateScoreDisplay();
  alert("🧹 Score reset!");
});



