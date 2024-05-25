const board = document.querySelector("#Board")
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetBoard);

const startPieces = [
    blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook,
    blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn,
    '', '',  '',  '',  '',  '',  '',  '', 
    '', '',  '',  '',  '',  '',  '',  '',
    '', '',  '',  '',  '',  '',  '',  '',
    '', '',  '',  '',  '',  '',  '',  '',
    whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn,
    whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook
]

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

let draggedElement;
let castleRook;
function dragStart(e) {
    draggedElement = e.target
    getPossibleMoves(e);
}  

function dragOver(e) {
    e.dataTransfer.dropEffect = "move";
    e.preventDefault(); 
}

let isDragDrop;
let isCastle;
let isShortCastle;
function dragDrop(e) {
    const pieceNode = e.target;
    const hasSpan = pieceNode.querySelector('span') !== null;
    if (hasSpan && isCastle) {
        if (isShortCastle) {
            isShortCastle = 0;
        } else {
            console.log("Hi");
        }
    } else if (hasSpan) {
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

function dragEnd(e) {
    const pieceNode = e.target;
    if (isDragDrop) {
        isDragDrop = 0
    }
    pieceNode.style.visibility = "visible";
}

//Functions

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
        if (pieceName === "White-Pawn") {
            possibleMoveIds = pawnMoves(pieceId);
        } else if (pieceName === "White-Knight") {
            possibleMoveIds = knightMoves(pieceId);
        } else if (pieceName == "White-Bishop") {
            possibleMoveIds = bishopMoves(pieceId);
        } else if (pieceName == "White-Queen") {
            possibleMoveIds = queenMoves(pieceId);
        } else if (pieceName == "White-Rook") {
            possibleMoveIds = rookMoves(pieceId);
        } else if (pieceName == "White-King") {
            possibleMoveIds = kingMoves(pieceId);
        }
        possibleMoveIds.forEach(moveId => {
            const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
            if (moveSquare) {
                if (moveSquare.childNodes.length > 0) {
                    const childNode = moveSquare.childNodes[0];
                    if (childNode && childNode.classList && childNode.classList.contains("Bpiece")) {
                        return;
                    }
                }     
                specialSquares.push(moveSquare);
            }
        });
    }
    fillColour(specialSquares);   
}

function fillColour(squares) {
    for(i in squares) {
        const square = squares[i];
        square.style.display = 'flex';
        square.style.justifyContent = 'center';
        square.style.alignItems = 'center';
        square.innerHTML = '<span style="display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: #646e40; opacity: 0.9;"></span>';
    }
}

function removeColour(squares) {
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const spanElement = square.querySelector('span');
      
        if (spanElement) {
            square.removeChild(spanElement);
        }
    }
}

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
            if (captureSquare.childNodes.length > 0 && captureSquare.childNodes[0].classList.contains("Bpiece")) {
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
        [1, -2]
    ];

    for (const [fileOffset, rankOffset] of moves) {
        const newFile = String.fromCharCode(file + fileOffset);
        const newRank = rank + rankOffset;
        if (newFile >= 'a' && newFile <= 'h' && newRank >= 1 && newRank <= 8) {
            const moveId = newFile + newRank;
            const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
            if (moveSquare.childNodes.length === 0 || !moveSquare.childNodes[0].classList.contains("Wpiece")) {
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
                if (childNode && childNode.classList && childNode.classList.contains("Wpiece")) {
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
                if (childNode && childNode.classList && childNode.classList.contains("Wpiece")) {
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
                if (childNode && childNode.classList && childNode.classList.contains("Wpiece")) {
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
        [-1, -1]
    ];
    const shortCastleDir = [
        [1, 0],
        [2, 0],
    ];  
    const longCastleDir = [
        [-1, 0],
        [-2, 0],
        [-3, 0],
    ]
    for (const [fileOffset, rankOffset] of directions) {
        const newFile = String.fromCharCode(file + fileOffset);
        const newRank = rank + rankOffset;
        const moveId = newFile + newRank;
        const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
        if (moveSquare && moveSquare.childNodes.length > 0) {
            const childNode = moveSquare.childNodes[0];
            if (childNode && childNode.classList && childNode.classList.contains("Wpiece")) {
                continue;
            }
        }
        moveset.push(moveId);
    }
    for (const [fileOffset, rankOffset] of shortCastleDir) {
        const newFile = String.fromCharCode(file + fileOffset);
        const newRank = rank + rankOffset;
        const moveId = newFile + newRank;
        const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
        if (moveSquare && moveSquare.childNodes.length > 0) {
            const childNode = moveSquare.childNodes[0];
            if (childNode && childNode.classList && childNode.classList.contains("Wpiece")) {
                break;
            }
        } 
        moveset.push(moveId);       
    }
    for (const [fileOffset, rankOffset] of longCastleDir) {
        const newFile = String.fromCharCode(file + fileOffset);
        const newRank = rank + rankOffset;
        const moveId = newFile + newRank;
        const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
        if (moveSquare && moveSquare.childNodes.length > 0) {
            const childNode = moveSquare.childNodes[0];
            if (childNode && childNode.classList && childNode.classList.contains("Wpiece")) {
                break;
            }
        } 
        moveset.push(moveId);       
    }
    return moveset;
}