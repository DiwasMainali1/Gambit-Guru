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
    square.addEventListener('click', getInfo); square.addEventListener('dragstart', getInfo);
    square.addEventListener('click', getPossibleMoves); square.addEventListener('dragstart', getPossibleMoves);
})


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

function getPossibleMoves(e) {
    clickInfo = getInfo(e)
    if (Array.isArray(clickInfo)) {
        pieceName = clickInfo[1]
        pieceId = clickInfo[0]
        if (pieceName === "White-Pawn") {
            console.log(pawnMoves(pieceId))
        }
        if (pieceName === "White-Knight") {
            console.log(knightMoves(pieceId))
        }        
    }
}

//Moving pawns
function pawnMoves(pos) {
    let num = parseInt(pos[1])

    if (num === 2) {
        let pos1 = pos[0] + (num + 1)
        let pos2 = pos[0] + (num + 2)
        return [pos1, pos2]
    } else if(num < 8) {
        return pos[0] + (num + 1)
    }
}

function knightMoves(pos) {
    let file = pos[0].charCodeAt(0);
    let rank = parseInt(pos[1])
    return [String.fromCharCode(file + 1) + (rank + 2), String.fromCharCode(file - 1) + (rank + 2)]
}