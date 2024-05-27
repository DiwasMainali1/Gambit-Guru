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

function addConfetti() {
    confetti({
        particleCount: 1000,
        spread: 500, 
        origin: { y: 0.5 } 
    });
}

function resetBoard() {
    draggedElement = NaN;
    isKingMoved = 0;
    isLrookMoved = 0;
    isSrookMoved = 0;
    isDragDrop;
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