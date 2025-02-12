const headerMode = document.getElementById("header-mode");
const computerMode = document.getElementById("computer");
const pvpMode = document.getElementById("pvp");
const headerTitle = document.getElementById("header-title");
const sideX = document.getElementById("side-X-selection");
const sideO = document.getElementById("side-O-selection");
const gameTable = document.getElementById("game");
const reset = document.getElementById("reset");
const boxes = document.querySelectorAll(".game-box");
const resultWin = document.getElementById("result-win");
const resultDraw = document.getElementById("result-draw");
const winner = document.getElementById("winner");
const sideXScore = document.getElementById("side-X-score");
const sideOScore = document.getElementById("side-O-score");

let xScore = 0;
let oScore = 0;

const winPatterns = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Diagonal
];

// For Computer
let moveCount = 0;
// For PvP
let currentPlayer = "X";

let defaultMode = "computer";

function initialGameStart() {
  if (defaultMode === "computer") {
    if (sideO.classList.contains("selected")) {
      sideX.addEventListener("click", () => changeToX(vsComputer));
    } else if (sideX.classList.contains("selected")) {
      vsComputer();
      sideO.addEventListener("click", () => changeToX(vsComputerSideO));
    }
  } else {
    vsPlayer();
  }
}

function changeToX(action) {
  boxes.forEach((box) =>
    box.removeEventListener("click", checkedComputerBoxSideO)
  );
  sideX.classList.add("selected");
  sideO.classList.remove("selected");
  action();
}

function changeToO(action) {
  boxes.forEach((box) =>
    box.removeEventListener("click", checkedComputerBoxSideX)
  );
  sideO.classList.add("selected");
  sideX.classList.remove("selected");
  action();
}

function resetScore() {
  xScore = 0;
  oScore = 0;
  sideXScore.textContent = xScore;
  sideOScore.textContent = oScore;
}

headerMode.addEventListener("click", (e) => {
  if (e.target.value === "computer") {
    defaultMode = "computer";
    resetScore();
    enableBoxes();
    resultDraw.classList.add("hide");
    resultWin.classList.add("hide");

    boxes.forEach((box) => box.removeEventListener("click", checkedPvPBox));

    vsComputer();
  } else {
    defaultMode = "pvp";
    resetScore();
    enableBoxes();
    resultDraw.classList.add("hide");
    resultWin.classList.add("hide");

    boxes.forEach((box) =>
      box.removeEventListener("click", checkedComputerBoxSideX)
    );
    boxes.forEach((box) =>
      box.removeEventListener("click", checkedComputerBoxSideO)
    );

    vsPlayer();
  }
});

function checkedComputerBoxSideX(e) {
  let box = e.currentTarget;
  if (!box.classList.contains("checked")) {
    box.textContent = "X";
    box.classList.add("checked");
    moveCount++;
    if (!checkWin()) changeToO(vsComputer);
  }
}

function checkedComputerBoxSideO(e) {
  let box = e.currentTarget;
  if (!box.classList.contains("checked")) {
    box.textContent = "O";
    box.classList.add("checked");
    moveCount++;
    if (!checkWin()) changeToX(vsComputerSideO);
  }
}

function vsComputer() {
  if (defaultMode !== "computer") {
    return;
  }

  if (sideX.classList.contains("selected")) {
    if (moveCount === 0) {
      headerTitle.textContent = "Bắt đầu trò chơi hoặc chọn người chơi aaaa";
    } else {
      headerTitle.textContent = "Lượt của X";
    }

    boxes.forEach((box) => {
      box.addEventListener("click", checkedComputerBoxSideX);
    });
  } else if (sideO.classList.contains("selected")) {
    headerTitle.textContent = "Lượt của O";

    let emptyCells = [];
    let random;

    boxes.forEach((box) => {
      if (box.textContent === "") {
        emptyCells.push(box);
      }
    });

    random = Math.ceil(Math.random() * emptyCells.length) - 1;

    setTimeout(() => {
      if (emptyCells.length > 1) {
        emptyCells[random].textContent = "O";
        emptyCells[random].classList.add("checked");
      }
      checkWin();
      changeToX(vsComputer);
    }, 500);
  }
}

function vsComputerSideO() {
  if (defaultMode !== "computer") {
    return;
  }

  if (sideO.classList.contains("selected")) {
    headerTitle.textContent = "Lượt của O";

    boxes.forEach((box) => {
      box.addEventListener("click", checkedComputerBoxSideO);
    });
  } else if (sideX.classList.contains("selected")) {
    headerTitle.textContent = "Lượt của x";

    let emptyCells = [];
    let random;

    boxes.forEach((box) => {
      if (box.textContent === "") {
        emptyCells.push(box);
      }
    });

    random = Math.ceil(Math.random() * emptyCells.length) - 1;

    setTimeout(() => {
      if (emptyCells.length > 0) {
        emptyCells[random].textContent = "X";
        emptyCells[random].classList.add("checked");
      }
      checkWin();
      changeToO(vsComputerSideO);
    }, 500);
  }
}

function checkedPvPBox(e) {
  let box = e.currentTarget;
  if (!box.classList.contains("checked")) {
    box.textContent = currentPlayer;
    box.classList.add("checked");

    if (checkWin()) return;

    // Switch turns
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    headerTitle.textContent = `Lượt của ${currentPlayer}`;
  }
}

function vsPlayer() {
  if (defaultMode !== "pvp") return;

  boxes.forEach((box) => {
    box.addEventListener("click", checkedPvPBox);
  });
}

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.classList.remove("hide");
    box.classList.remove("checked");
    box.textContent = "";
  }
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
    box.classList.add("hide");
  }
};

function checkWin() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boxes[a].textContent !== "" &&
      boxes[a].textContent === boxes[b].textContent &&
      boxes[a].textContent === boxes[c].textContent
    ) {
      showWinner(boxes[a].textContent);
      return true;
    }
  }

  // Check for a draw
  if ([...boxes].every((box) => box.textContent !== "")) {
    disableBoxes();
    headerTitle.textContent = "Draw!";
    resultDraw.classList.remove("hide");
    return true;
  }

  return false;
}

function showWinner(winCase) {
  disableBoxes();
  resultDraw.classList.add("hide");
  resultWin.classList.remove("hide");

  headerTitle.textContent = "We have a winner!";
  winner.textContent = winCase;

  if (winCase === "X") {
    xScore++;
    sideXScore.textContent = xScore;
  } else if (winCase === "O") {
    oScore++;
    sideOScore.textContent = oScore;
  }
}

function resetGame() {
  resultWin.classList.add("hide");
  resultDraw.classList.add("hide");
  moveCount = 0;
  sideX.classList.add("selected");
  sideO.classList.remove("selected");
  headerTitle.textContent = "Bắt đầu trò chơi hoặc chọn người chơi";
  currentPlayer = "X";
  enableBoxes();

  boxes.forEach((box) =>
    box.removeEventListener("click", checkedComputerBoxSideO)
  );
  if (defaultMode === "computer") {
    vsComputer();
  }
}

reset.addEventListener("click", () => resetGame());
initialGameStart();
