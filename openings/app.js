const board = document.querySelector("#Board")

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
    let rank = 8
    startPieces.forEach((startPiece, i) => {
        let index = 8 - (i % 8);
        let file = String.fromCharCode(105 - index)

        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true)
        if (((rank + (105 - index)) % 2)) {
            square.classList.add('yellow')
        } else {
            square.classList.add('gray')
        }
        square.setAttribute('square-id', file + rank)
        board.append(square)
        if (index == 1) {
            rank = rank - 1
        }
    })
}
createBoard()


const allSquares = document.querySelectorAll("#Board .square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart); 
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
    square.addEventListener('dragend', dragEnd);   
})


function dragDrop(e) {
}

function dragOver(e) {
    e.preventDefault(); 
}

function dragEnd(e) {
    const pieceNode = e.target;
    pieceNode.style.visibility = "visible";
}

const specialSquares = [];
prevSquare = NaN

function dragStart(e) {
    getPossibleMoves(e);
}  

function getPossibleMoves(e) {
    const pieceNode = e.target.parentNode;
    console.log(pieceNode)
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
    prevSquare = e.target.parentNode.parentNode
    if (Array.isArray(clickInfo)) {
        const pieceName = clickInfo[1];
        const pieceId = clickInfo[0];

        let possibleMoveIds = [];
        if (pieceName === "White-Pawn") {
            possibleMoveIds = pawnMoves(pieceId);
        } else if (pieceName === "White-Knight") {
            possibleMoveIds = knightMoves(pieceId);
        }

        possibleMoveIds.forEach(moveId => {
            const moveSquare = document.querySelector(`[square-id="${moveId}"]`);
            if (moveSquare) {
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
    for(i in squares) {
        const square = squares[i];
        square.innerHTML = '';
    }
}

function pawnMoves(pos) {
    let num = parseInt(pos[1])

    if (num === 2) {
        let pos1 = pos[0] + (num + 1)
        let pos2 = pos[0] + (num + 2)
        moveset = [pos1, pos2]
        return moveset
    } else if(num < 8) {
        return pos[0] + (num + 1)
    }
}

function knightMoves(pos) {
    let file = pos[0].charCodeAt(0);
    let rank = parseInt(pos[1])

    let pos1 = String.fromCharCode(file - 1) + (rank + 2);
    let pos2 = String.fromCharCode(file + 1) + (rank + 2);

    moveset = [pos1, pos2];
    return moveset
}

function getInfo(e) {
    pieceId = e.target.parentNode.parentNode.getAttribute("square-id");
    pieceName = e.target.parentNode.getAttribute("id");
    squareId = e.target.getAttribute("square-id");
    if (pieceId) {
        return [pieceId, pieceName]
    } else {
        return squareId
    }
}