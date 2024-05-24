const board = document.querySelector("#Board")

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

function createBoard() {
    let rank = 8
    startPieces.forEach((startPiece, i) => {
        let index = 8 - (i % 8);
        let file = String.fromCharCode(105 - index)

        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true)
        if (((rank + (105 - index)) % 2)) {
            square.classList.add('gray')
        } else {
            square.classList.add('yellow')
        }
        square.setAttribute('square-id', file + rank)
        board.append(square)
        if (index == 1) {
            rank = rank - 1
        }
    })
}

createBoard();

const allSquares = document.querySelectorAll("#Board .square")

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
function dragStart(e) {
    draggedElement = e.target
    getPossibleMoves(e);
}  

function dragOver(e) {
    e.dataTransfer.dropEffect = "move";
    e.preventDefault(); 
}

let isDragDrop;
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

function dragEnd(e) {
    const pieceNode = e.target;
    if (isDragDrop) {
        console.log(pieceNode.id, pieceNode.parentNode.getAttribute("square-id"))
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
    let num = parseInt(pos[1])
    if (num === 2) {
        let pos1 = pos[0] + (num + 1)
        let pos2 = pos[0] + (num + 2)
        moveset = [pos1, pos2]
        return moveset
    } else {
        moveset = [pos[0] + (num + 1)]
        return moveset
    }
}

function knightMoves(pos) {
    let file = pos[0].charCodeAt(0);
    let rank = parseInt(pos[1])

    let pos1 = String.fromCharCode(file - 1) + (rank + 2);
    let pos2 = String.fromCharCode(file + 1) + (rank + 2);
    let pos3 = String.fromCharCode(file - 2) + (rank + 1);
    let pos4 = String.fromCharCode(file + 2) + (rank + 1);
    let pos5 = String.fromCharCode(file - 2) + (rank - 1);
    let pos6 = String.fromCharCode(file + 2) + (rank - 1);
    let pos7 = String.fromCharCode(file - 1) + (rank - 2);
    let pos8 = String.fromCharCode(file + 1) + (rank - 2);

    moveset = [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8];
    return moveset
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
                if (childNode && childNode.classList && childNode.classList.contains("Bpiece")) {
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
                if (childNode && childNode.classList && childNode.classList.contains("Bpiece")) {
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
                if (childNode && childNode.classList && childNode.classList.contains("Bpiece")) {
                    break;
                }
            }

            moveset.push(moveId);
        }
    }

    return moveset;
}