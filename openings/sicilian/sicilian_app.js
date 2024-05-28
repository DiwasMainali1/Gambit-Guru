const board = document.querySelector("#Board");
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetBoard);

let isDragDrop;
let isKingMoved;
let isSrookMoved;
let isLrookMoved;
let draggedElement;

const startPieces = [
  A_whiteRook,
  whiteKnight,
  whiteBishop,
  whiteQueen,
  whiteKing,
  whiteBishop,
  whiteKnight,
  H_whiteRook,
  whitePawn,
  whitePawn,
  whitePawn,
  "",
  whitePawn,
  whitePawn,
  whitePawn,
  whitePawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  whitePawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  blackPawn,
  blackPawn,
  blackPawn,
  blackPawn,
  blackPawn,
  blackPawn,
  blackPawn,
  blackPawn,
  A_blackRook,
  blackKnight,
  blackBishop,
  blackQueen,
  blackKing,
  blackBishop,
  blackKnight,
  H_blackRook,
];
createBoard();
addEventListeners();

let sicilianMoves = [
  ["Black-Pawn", "b3"],
  ["Black-Pawn", "e3"],
  ["Black-Pawn", "e5"],
  ["Black-Knight", "f3"],
  ["Black-Pawn", "f4"],
];

let whiteMoves = [
  ["g8", "f6"],
  ["c6", "e5"],
  ["e7", "e5"],
  ["b8", "c6"],
];

//Functions
function addConfetti() {
  confetti({
    particleCount: 1000,
    spread: 500,
    origin: { y: 0.5 },
  });
}

function createBoard() {
  let rank = 8;
  startPieces.forEach((startPiece, i) => {
    let index = 8 - (i % 8);
    let file = String.fromCharCode(105 - index);
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute("draggable", true);
    if ((rank + (105 - index)) % 2) {
      square.classList.add("yellow");
    } else {
      square.classList.add("gray");
    }
    square.setAttribute("square-id", file + rank);
    board.append(square);
    if (index == 1) {
      rank = rank - 1;
    }
  });
}

function resetBoard() {
  sicilianMoves = [
    ["Black-Pawn", "b3"],
    ["Black-Pawn", "e3"],
    ["Black-Pawn", "e5"],
    ["Black-Knight", "f3"],
    ["Black-Pawn", "f4"],
  ];
  whiteMoves = [
    ["g8", "f6"],
    ["c6", "e5"],
    ["e7", "e5"],
    ["b8", "c6"],
  ];
  draggedElement = NaN;
  isKingMoved = 0;
  isLrookMoved = 0;
  isSrookMoved = 0;
  isDragDrop;
  const board = document.getElementById("Board");
  board.innerHTML = "";
  createBoard();
  addEventListeners();
}

function addEventListeners() {
  const allSquares = document.querySelectorAll("#Board .square");

  allSquares.forEach((square) => {
    const img = square.querySelector("img");
    if (img) {
      img.classList.add("grabbable");
    }
    square.addEventListener("dragstart", dragStart);
    square.addEventListener("dragover", dragOver);
    square.addEventListener("drop", dragDrop);
    square.addEventListener("dragend", dragEnd);
  });
}

function dragStart(e) {
  draggedElement = e.target;
  if (draggedElement.tagName.toLowerCase() !== "img") {
    e.preventDefault();
    return;
  }
  getPossibleMoves(e);
}

function dragOver(e) {
  e.dataTransfer.dropEffect = "move";
  e.preventDefault();
}

function dragDrop(e) {
  let pieceNode = e.target;
  let hasSpan = pieceNode.querySelector("span") !== null;
  let hasCapture =
    pieceNode.parentNode.style.backgroundColor === "rgb(100, 110, 64)";
  let squareId = e.target.getAttribute("square-id");
  if (pieceNode.tagName.toLowerCase() === "span") {
    pieceNode = pieceNode.parentNode;
    squareId = pieceNode.getAttribute("square-id");
    hasSpan = 1;
  }
  if (hasCapture) {
    pieceNode = pieceNode.parentNode;
    squareId = pieceNode.getAttribute("square-id");
  }
  if (!isKingMoved && draggedElement.id === "Black-King" && squareId === "g1") {
    let rookElement = document.querySelector(`[id="${"H-Black-Rook"}"]`);
    let rookSquare = document.querySelector(`[square-id="${"f1"}"]`);
    pieceNode.appendChild(draggedElement);
    rookSquare.appendChild(rookElement);
    removeColour(allSquares);
    specialSquares.length = 0;
    isDragDrop = 1;
  } else if (
    !isKingMoved &&
    draggedElement.id === "Black-King" &&
    squareId === "c1"
  ) {
    let rookElement = document.querySelector(`[id="${"A-Black-Rook"}"]`);
    let rookSquare = document.querySelector(`[square-id="${"d1"}"]`);
    pieceNode.appendChild(draggedElement);
    rookSquare.appendChild(rookElement);
    removeColour(allSquares);
    specialSquares.length = 0;
    isDragDrop = 1;
  } else if (hasSpan) {
    pieceNode.appendChild(draggedElement);
    removeColour(allSquares);
    specialSquares.length = 0;
    isDragDrop = 1;
  } else if (hasCapture) {
    console.log(pieceNode);
    pieceNode.innerHTML = "";
    pieceNode.appendChild(draggedElement);
    removeColour(allSquares);
    specialSquares.length = 0;
    isDragDrop = 1;
  }
  if (isDragDrop && draggedElement.id == "Black-King") {
    isKingMoved = 1;
  }
  if (isDragDrop && draggedElement.id == "A-Black-Rook") {
    isLrookMoved = 1;
  }
  if (isDragDrop && draggedElement.id == "H-Black-Rook") {
    isSrookMoved = 1;
  }
  if (isDragDrop) {
    const lastMove = sicilianMoves[sicilianMoves.length - 1];
    console.log(JSON.stringify([draggedElement.id, squareId]));
    if (
      JSON.stringify([draggedElement.id, squareId]) === JSON.stringify(lastMove)
    ) {
      pieceNode.style.backgroundColor = "green";
      specialSquares.push(pieceNode);
      if (whiteMoves.length > 0) {
        wPieceLocation = whiteMoves[whiteMoves.length - 1][0];
        whitePieceNode = whiteMoves[whiteMoves.length - 1][1];
        whitePiece = document.querySelector(`[square-id="${wPieceLocation}"]`);
        childNodes = whitePiece.childNodes;
        let blackSquare = document.querySelector(
          `[square-id="${whitePieceNode}"]`,
        );
        blackSquare.innerHTML = "";
        blackSquare.appendChild(childNodes[0]);
        blackSquare.style.backgroundColor = "";
        whiteMoves.pop();
      }
      sicilianMoves.pop();
    } else {
      pieceNode.style.backgroundColor = "red";
      setTimeout(() => {
        resetBoard();
      }, 250);
    }
    if (!sicilianMoves.length) {
      const allSquares = document.querySelectorAll("#Board .square");
      allSquares.forEach((square) => {
        const img = square.querySelector("img");
        if (img) {
          square.style.backgroundColor = "pink";
        }
      });
      addConfetti();
      setTimeout(() => {
        resetBoard();
      }, 1300);
    }
  }
}

function dragEnd(e) {
  const pieceNode = e.target;
  if (isDragDrop) {
    isDragDrop = 0;
  }
  pieceNode.style.visibility = "visible";
}

function getInfo(e) {
  pieceId = e.target.parentNode.getAttribute("square-id");
  pieceName = e.target.getAttribute("id");
  squareId = e.target.getAttribute("square-id");
  if (pieceId) {
    return [pieceId, pieceName];
  } else {
    return squareId;
  }
}

const specialSquares = [];
const captureSquares = [];
const allSquares = [];
prevSquare = NaN;
function getPossibleMoves(e) {
  const pieceNode = e.target.parentNode;
  const imageNode = e.target.parentNode.firstElementChild;
  if (imageNode) {
    setTimeout(() => {
      imageNode.style.visibility = "hidden";
    }, 0);
  }
  const clickInfo = getInfo(e);
  removeColour(allSquares);
  specialSquares.length = 0;
  captureSquares.length = 0;
  if (pieceNode && pieceNode == prevSquare) {
    prevSquare = NaN;
    return;
  }
  prevSquare = e.target.parentNode;
  if (Array.isArray(clickInfo)) {
    const pieceName = clickInfo[1];
    const pieceId = clickInfo[0];
    let possibleMoveIds = [];
    if (pieceName === "Black-Pawn") {
      possibleMoveIds = pawnMoves(pieceId);
    } else if (pieceName === "Black-Knight") {
      possibleMoveIds = knightMoves(pieceId);
    } else if (pieceName == "Black-Bishop") {
      possibleMoveIds = bishopMoves(pieceId);
    } else if (pieceName == "Black-Queen") {
      possibleMoveIds = queenMoves(pieceId);
    } else if (pieceName == "A-Black-Rook" || pieceName == "H-Black-Rook") {
      possibleMoveIds = rookMoves(pieceId);
    } else if (pieceName == "Black-King") {
      possibleMoveIds = kingMoves(pieceId);
    }
    possibleMoveIds.forEach((moveId) => {
      const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
      if (moveSquare) {
        if (moveSquare.childNodes.length > 0) {
          const childNode = moveSquare.childNodes[0];
          if (
            childNode &&
            childNode.classList &&
            childNode.classList.contains("Wpiece")
          ) {
            captureSquares.push(moveSquare);
            allSquares.push(moveSquare);
            captureHighlight(captureSquares);
            return;
          }
        }
        specialSquares.push(moveSquare);
        allSquares.push(moveSquare);
      }
    });
  }
  fillColour(specialSquares);
}

function captureHighlight(squares) {
  for (i in squares) {
    const square = squares[i];
    square.style.backgroundColor = "#646e40";
  }
}

function fillColour(squares) {
  for (i in squares) {
    const square = squares[i];
    square.style.display = "flex";
    square.style.justifyContent = "center";
    square.style.alignItems = "center";
    square.innerHTML =
      '<span style="display: inline-block; width: 19px; height: 19px; border-radius: 50%; background-color: #646e40; opacity: 0.9;"></span>';
  }
}

function removeColour(squares) {
  for (let i = 0; i < squares.length; i++) {
    const square = squares[i];
    const spanElement = square.querySelector("span");

    if (spanElement) {
      square.removeChild(spanElement);
    }
    square.style.backgroundColor = "";
  }
}

function pawnMoves(pos) {
  const file = pos[0];
  const rank = parseInt(pos[1]);
  const moveset = [];

  if (rank === 2) {
    const oneStepMove = file + (rank + 1);
    const twoStepMove = file + (rank + 2);
    const oneStepSquare = document.querySelector(
      `[square-id="${oneStepMove}"]`,
    );
    const twoStepSquare = document.querySelector(
      `[square-id="${twoStepMove}"]`,
    );

    if (oneStepSquare.childNodes.length === 0) {
      moveset.push(oneStepMove);

      if (twoStepSquare.childNodes.length === 0) {
        moveset.push(twoStepMove);
      }
    }
  } else {
    const oneStepMove = file + (rank + 1);
    const oneStepSquare = document.querySelector(
      `[square-id="${oneStepMove}"]`,
    );

    if (oneStepSquare.childNodes.length === 0) {
      moveset.push(oneStepMove);
    }
  }

  const captureFiles = [
    String.fromCharCode(file.charCodeAt(0) - 1),
    String.fromCharCode(file.charCodeAt(0) + 1),
  ];
  for (const captureFile of captureFiles) {
    if (captureFile >= "a" && captureFile <= "h") {
      const captureMove = captureFile + (rank + 1);
      const captureSquare = document.querySelector(
        `[square-id="${captureMove}"]`,
      );
      if (
        captureSquare.childNodes.length > 0 &&
        captureSquare.childNodes[0].classList.contains("Wpiece")
      ) {
        moveset.push(captureMove);
      }
    }
  }
  return moveset;
}

function knightMoves(pos) {
  const file = pos[0].charCodeAt(0);
  const rank = parseInt(pos[1]);
  const moveset = [];
  const moves = [
    [-1, 2],
    [1, 2],
    [-2, 1],
    [2, 1],
    [-2, -1],
    [2, -1],
    [-1, -2],
    [1, -2],
  ];

  for (const [fileOffset, rankOffset] of moves) {
    const newFile = String.fromCharCode(file + fileOffset);
    const newRank = rank + rankOffset;
    if (newFile >= "a" && newFile <= "h" && newRank >= 1 && newRank <= 8) {
      const moveId = newFile + newRank;
      const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
      if (
        moveSquare.childNodes.length === 0 ||
        !moveSquare.childNodes[0].classList.contains("Bpiece")
      ) {
        moveset.push(moveId);
      }
    }
  }

  return moveset;
}

function bishopMoves(pos) {
  const file = pos[0].charCodeAt(0);
  const rank = parseInt(pos[1]);
  const moveset = [];
  const directions = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];

  for (const [fileOffset, rankOffset] of directions) {
    for (let i = 1; i <= 8; i++) {
      const newFile = String.fromCharCode(file + fileOffset * i);
      const newRank = rank + rankOffset * i;
      if (newFile < "a" || newFile > "h" || newRank < 1 || newRank > 8) break;

      const moveId = newFile + newRank;
      const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
      if (moveSquare.childNodes.length > 0) {
        const childNode = moveSquare.childNodes[0];
        if (
          childNode &&
          childNode.classList &&
          childNode.classList.contains("Bpiece")
        ) {
          break;
        }
        if (
          childNode &&
          childNode.classList &&
          childNode.classList.contains("Wpiece")
        ) {
          moveset.push(moveId);
          break;
        }
      }

      moveset.push(moveId);
    }
  }

  return moveset;
}

function queenMoves(pos) {
  const file = pos[0].charCodeAt(0);
  const rank = parseInt(pos[1]);
  const moveset = [];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];

  for (const [fileOffset, rankOffset] of directions) {
    for (let i = 1; i <= 8; i++) {
      const newFile = String.fromCharCode(file + fileOffset * i);
      const newRank = rank + rankOffset * i;
      if (newFile < "a" || newFile > "h" || newRank < 1 || newRank > 8) break;

      const moveId = newFile + newRank;
      const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
      if (moveSquare.childNodes.length > 0) {
        const childNode = moveSquare.childNodes[0];
        if (
          childNode &&
          childNode.classList &&
          childNode.classList.contains("Bpiece")
        ) {
          break;
        }
        if (
          childNode &&
          childNode.classList &&
          childNode.classList.contains("Wpiece")
        ) {
          moveset.push(moveId);
          break;
        }
      }

      moveset.push(moveId);
    }
  }

  return moveset;
}

function rookMoves(pos) {
  const file = pos[0].charCodeAt(0);
  const rank = parseInt(pos[1]);
  const moveset = [];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (const [fileOffset, rankOffset] of directions) {
    for (let i = 1; i <= 8; i++) {
      const newFile = String.fromCharCode(file + fileOffset * i);
      const newRank = rank + rankOffset * i;
      if (newFile < "a" || newFile > "h" || newRank < 1 || newRank > 8) break;

      const moveId = newFile + newRank;
      const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
      if (moveSquare.childNodes.length > 0) {
        const childNode = moveSquare.childNodes[0];
        if (
          childNode &&
          childNode.classList &&
          childNode.classList.contains("Bpiece")
        ) {
          break;
        }
        if (
          childNode &&
          childNode.classList &&
          childNode.classList.contains("Wpiece")
        ) {
          moveset.push(moveId);
          break;
        }
      }

      moveset.push(moveId);
    }
  }

  return moveset;
}

function kingMoves(pos) {
  const file = pos[0].charCodeAt(0);
  const rank = parseInt(pos[1]);
  const moveset = [];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];
  const shortCastleDir = [
    [1, 0],
    [2, 0],
  ];
  const longCastleDir = [
    [-1, 0],
    [-2, 0],
    [-3, 0],
  ];
  for (const [fileOffset, rankOffset] of directions) {
    const newFile = String.fromCharCode(file + fileOffset);
    const newRank = rank + rankOffset;
    const moveId = newFile + newRank;
    const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
    if (moveSquare && moveSquare.childNodes.length > 0) {
      const childNode = moveSquare.childNodes[0];
      if (
        childNode &&
        childNode.classList &&
        childNode.classList.contains("Bpiece")
      ) {
        continue;
      }
    }
    moveset.push(moveId);
  }
  if (isKingMoved) {
    return moveset;
  }
  if (!isSrookMoved) {
    let isShortCastle = checkShortCastle(file, rank, shortCastleDir);
    if (isShortCastle) {
      moveset.push("g1");
    }
  }
  if (!isLrookMoved) {
    let isLongCastle = checkLongCastle(file, rank, longCastleDir);
    if (isLongCastle) {
      moveset.push("c1");
    }
  }
  return moveset;
}

function checkShortCastle(file, rank, shortCastleDir) {
  let boolean = 1;

  for (const [fileOffset, rankOffset] of shortCastleDir) {
    const newFile = String.fromCharCode(file + fileOffset);
    const newRank = rank + rankOffset;
    const moveId = newFile + newRank;
    const moveSquare = document.querySelector(`[square-id="${moveId}"]`);

    if (moveSquare && moveSquare.childNodes.length > 0) {
      const childNode = moveSquare.childNodes[0];
      if (
        childNode &&
        childNode.classList &&
        childNode.classList.contains("Bpiece")
      ) {
        boolean = 0;
        break;
      }
    }
  }

  return boolean;
}

function checkLongCastle(file, rank, longCastleDir) {
  let boolean = 1;

  for (const [fileOffset, rankOffset] of longCastleDir) {
    const newFile = String.fromCharCode(file + fileOffset);
    const newRank = rank + rankOffset;
    const moveId = newFile + newRank;
    const moveSquare = document.querySelector(`[square-id="${moveId}"]`);

    if (moveSquare && moveSquare.childNodes.length > 0) {
      const childNode = moveSquare.childNodes[0];
      if (
        childNode &&
        childNode.classList &&
        childNode.classList.contains("Bpiece")
      ) {
        boolean = 0;
        break;
      }
    }
  }

  return boolean;
}
