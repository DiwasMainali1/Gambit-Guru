const board = document.querySelector("#Board");
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetBoard);

const startPieces = [
    whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook,
    whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn,
    '', '',  '',  '',  '',  '',  '',  '', 
    '', '',  '',  '',  '',  '',  '',  '',
    '', '',  '',  '',  '',  '',  '',  '',
    '', '',  '',  '',  '',  '',  '',  '',
    blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn,
    blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook
]

// Function to create the chess board
function createBoard() {
    let rank = 8;
    startPieces.forEach((startPiece, i) => {
        let index = 8 - (i % 8);
        let file = String.fromCharCode(105 - index);
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true);
        if ((rank + (105 - index)) % 2) {
            square.classList.add('yellow');
        } else {
            square.classList.add('gray');
        }
        square.setAttribute('square-id', file + rank);
        board.append(square);
        if (index == 1) {
            rank = rank - 1;
        }
    });
}

function resetBoard() {
    const board = document.getElementById('Board');
    board.innerHTML = ''; 
    createBoard(); 
    addEventListeners(); 
}

function addEventListeners() {
    const allSquares = document.querySelectorAll("#Board .square");

    allSquares.forEach(square => {
        const img = square.querySelector('img');
        if (img) {
            img.classList.add('grabbable');
        }
        square.addEventListener('dragstart', dragStart);
        square.addEventListener('dragover', dragOver);
        square.addEventListener('drop', dragDrop);
        square.addEventListener('dragend', dragEnd);
    });
}

createBoard();
addEventListeners();

const allSquares = document.querySelectorAll("#Board .square")

// Add event listeners to each square on the board
allSquares.forEach(square => {
    const img = square.querySelector('img');
    if (img) {
      img.classList.add('grabbable'); 
    }
    square.addEventListener('dragstart', dragStart); 
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
    square.addEventListener('dragend', dragEnd);   
})

let draggedElement;
// Function to handle drag start event
function dragStart(e) {
    draggedElement = e.target
    getPossibleMoves(e);
}  

// Function to handle drag over event
function dragOver(e) {
    e.dataTransfer.dropEffect = "move";
    e.preventDefault(); 
}

let isDragDrop;
// Function to handle drop event
function dragDrop(e) {
    const pieceNode = e.target;
    const hasSpan = pieceNode.querySelector('span') !== null;
    if (hasSpan) {
        pieceNode.appendChild(draggedElement);
        removeColour(specialSquares);
        specialSquares.length = 0;
        isDragDrop = 1
    } else if (pieceNode.tagName.toLowerCase() === 'span') {
        let square = pieceNode.parentNode;
        square.appendChild(draggedElement);
        removeColour(specialSquares);
        specialSquares.length = 0;
        isDragDrop = 1
    }
}

// Function to handle drag end event
function dragEnd(e) {
    const pieceNode = e.target;
    if (isDragDrop) {
        console.log(pieceNode.id, pieceNode.parentNode.getAttribute("square-id"))
        isDragDrop = 0
    }
    pieceNode.style.visibility = "visible";
}


//Functions
// Function to get information about the clicked piece and square
function getInfo(e) {
    pieceId = e.target.parentNode.getAttribute("square-id");
    pieceName = e.target.getAttribute("id");
    squareId = e.target.getAttribute("square-id");
    if (pieceId) {
        return [pieceId, pieceName]
    } else {
        return squareId
    }
}


const specialSquares = [];
prevSquare = NaN
// Function to get possible moves for a piece
function getPossibleMoves(e) {
    const pieceNode = e.target.parentNode;
    const imageNode = e.target.parentNode.firstElementChild;
    if (imageNode) {
        setTimeout(() => {
            imageNode.style.visibility = "hidden";
        }, 0); 
    }
    const clickInfo = getInfo(e);
    removeColour(specialSquares);
    specialSquares.length = 0;
    if (pieceNode && pieceNode == prevSquare) {
        prevSquare = NaN
        return
    }
    prevSquare = e.target.parentNode
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
        } else if (pieceName == "Black-Rook") {
            possibleMoveIds = rookMoves(pieceId);
        }
        possibleMoveIds.forEach(moveId => {
            const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
            if (moveSquare) {
                if (moveSquare.childNodes.length > 0) {
                    const childNode = moveSquare.childNodes[0];
                    if (childNode && childNode.classList && childNode.classList.contains("Wpiece")) {
                        return;
                    }
                }     
                specialSquares.push(moveSquare);
            }
        });
    }
    fillColour(specialSquares);   
}

// Function to highlight possible move squares
function fillColour(squares) {
    for(i in squares) {
        const square = squares[i];
        square.style.display = 'flex';
        square.style.justifyContent = 'center';
        square.style.alignItems = 'center';
        square.innerHTML = '<span style="display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: #646e40; opacity: 0.9;"></span>';
    }
}

// Function to remove highlight from squares
function removeColour(squares) {
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const spanElement = square.querySelector('span');
      
        if (spanElement) {
            square.removeChild(spanElement);
        }
    }
}

// Function to get possible pawn moves
function pawnMoves(pos) {
    const file = pos[0];
    const rank = parseInt(pos[1]);
    const moveset = [];

    if (rank === 2) {
        const oneStepMove = file + (rank + 1);
        const twoStepMove = file + (rank + 2);
        const oneStepSquare = document.querySelector(`[square-id="${oneStepMove}"]`);
        const twoStepSquare = document.querySelector(`[square-id="${twoStepMove}"]`);

        if (oneStepSquare.childNodes.length === 0) {
            moveset.push(oneStepMove);

            if (twoStepSquare.childNodes.length === 0) {
                moveset.push(twoStepMove);
            }
        }
    } else {
        const oneStepMove = file + (rank + 1);
        const oneStepSquare = document.querySelector(`[square-id="${oneStepMove}"]`);

        if (oneStepSquare.childNodes.length === 0) {
            moveset.push(oneStepMove);
        }
    }

    const captureFiles = [String.fromCharCode(file.charCodeAt(0) - 1), String.fromCharCode(file.charCodeAt(0) + 1)];
    for (const captureFile of captureFiles) {
        if (captureFile >= 'a' && captureFile <= 'h') {
            const captureMove = captureFile + (rank + 1);
            const captureSquare = document.querySelector(`[square-id="${captureMove}"]`);
            if (captureSquare.childNodes.length > 0 && captureSquare.childNodes[0].classList.contains("Wpiece")) {
                moveset.push(captureMove);
            }
        }
    }
    return moveset;
}

// Function to get possible knight moves
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
        [1, -2]
    ];

    for (const [fileOffset, rankOffset] of moves) {
        const newFile = String.fromCharCode(file + fileOffset);
        const newRank = rank + rankOffset;
        if (newFile >= 'a' && newFile <= 'h' && newRank >= 1 && newRank <= 8) {
            const moveId = newFile + newRank;
            const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
            if (moveSquare.childNodes.length === 0 || !moveSquare.childNodes[0].classList.contains("Bpiece")) {
                moveset.push(moveId);
            }
        }
    }

    return moveset;
}

// Function to get possible bishop moves
function bishopMoves(pos) {
    const file = pos[0].charCodeAt(0);
    const rank = parseInt(pos[1]);
    const moveset = [];
    const directions = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1]
    ];

    for (const [fileOffset, rankOffset] of directions) {
        for (let i = 1; i <= 8; i++) {
            const newFile = String.fromCharCode(file + fileOffset * i);
            const newRank = rank + rankOffset * i;
            if (newFile < 'a' || newFile > 'h' || newRank < 1 || newRank > 8) break;

            const moveId = newFile + newRank;
            const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
            if (moveSquare.childNodes.length > 0) {
                const childNode = moveSquare.childNodes[0];
                if (childNode && childNode.classList && childNode.classList.contains("Bpiece")) {
                    break;
                }
            }

            moveset.push(moveId);
        }
    }

    return moveset;
}

// Function to get possible queen moves
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
        [-1, -1]
    ];

    for (const [fileOffset, rankOffset] of directions) {
        for (let i = 1; i <= 8; i++) {
            const newFile = String.fromCharCode(file + fileOffset * i);
            const newRank = rank + rankOffset * i;
            if (newFile < 'a' || newFile > 'h' || newRank < 1 || newRank > 8) break;

            const moveId = newFile + newRank;
            const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
            if (moveSquare.childNodes.length > 0) {
                const childNode = moveSquare.childNodes[0];
                if (childNode && childNode.classList && childNode.classList.contains("Bpiece")) {
                    break;
                }
            }

            moveset.push(moveId);
        }
    }

    return moveset;
}

// Function to get possible rook moves
function rookMoves(pos) {
    const file = pos[0].charCodeAt(0);
    const rank = parseInt(pos[1]);
    const moveset = [];
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    for (const [fileOffset, rankOffset] of directions) {
        for (let i = 1; i <= 8; i++) {
            const newFile = String.fromCharCode(file + fileOffset * i);
            const newRank = rank + rankOffset * i;
            if (newFile < 'a' || newFile > 'h' || newRank < 1 || newRank > 8) break;

            const moveId = newFile + newRank;
            const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
            if (moveSquare.childNodes.length > 0) {
                const childNode = moveSquare.childNodes[0];
                if (childNode && childNode.classList && childNode.classList.contains("Bpiece")) {
                    break;
                }
            }

            moveset.push(moveId);
        }
    }

    return moveset;
}