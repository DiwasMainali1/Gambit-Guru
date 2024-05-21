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
    square.addEventListener('click', getInfo)
    square.addEventListener('dragstart', getInfo)
})


function getInfo(e) {
    pieceExists = e.target.parentNode.parentNode.getAttribute("square-id");
    if (pieceExists !== null) {
        console.log(pieceExists)
    } else {
        console.log(e.target.getAttribute("square-id"))
    }
}