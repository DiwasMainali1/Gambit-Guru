import { whiteChessUtilities, blackChessUtilities } from "./helpers/helper.js";

const changeButton = document.getElementById("switchButton");
changeButton.addEventListener("click", changeBoard);

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener("click", resetBoard);

const dropdownItems = document.querySelectorAll('.dropdown-item');
const openingTitle = document.getElementById('opening-title');

const hintButton = document.getElementById("hintButton");
hintButton.addEventListener("click", giveHint);

const aboutButton = document.getElementById("aboutButton");
const aboutPage = document.getElementById("aboutPage");
const closeButton = document.getElementById("closeButton");

aboutButton.addEventListener("click", function() {
    aboutPage.style.display = "flex";
});

closeButton.addEventListener("click", function() {
    aboutPage.style.display = "none";
});
const openingsButton = document.getElementById('openingsButton');
const openingsPage = document.getElementById('openingsPage');
const closeOpeningsButton = document.getElementById('closeOpeningsButton');

openingsButton.addEventListener('click', () => {
    openingsPage.style.display = 'flex';
});

closeOpeningsButton.addEventListener('click', () => {
    openingsPage.style.display = 'none';
});
let board = document.querySelector("#Board");
board.innerHTML = "";
whiteChessUtilities.createBoard(0, [], []);
whiteChessUtilities.addEventListeners();

let openingData;

hintButton.style.display = 'none';
fetch('openings.json')
    .then(response => response.json())
    .then(data => {
        openingData = data;

        dropdownItems.forEach(function(item) {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                var openingId = this.id;
                loadOpeningContent(openingId);
                openingsPage.style.display = 'none';
            });
        });
    })
    .catch(error => {
        console.error('Error loading opening data:', error);
    });

function loadOpeningContent(openingId) {
    let currOpening = NaN;
    var openingInfo = openingData[openingId];
    if (openingInfo) {
        openingTitle.textContent = openingInfo.title;
        openingTitle.className = openingId;

        let board = document.querySelector("#Board");
        let pieceColour = board.childNodes[0].firstChild.id;

        if (pieceColour.includes("Black")) {
            board.innerHTML = "";
            whiteChessUtilities.createBoard(0, [], []);
            whiteChessUtilities.addEventListeners();
        } else {
            board.innerHTML = "";
            blackChessUtilities.createBoard(0, [], []);
            blackChessUtilities.addEventListeners();
        }

        board.innerHTML = '';

        if (openingId === 'sicilianDefense' || openingId === 'kingsIndianDefense' || openingId === 'caroKannDefense') {
            const blackMovesCopy = [...openingInfo.blackMoves];
            const whiteMovesCopy = [...openingInfo.whiteMoves];

            blackChessUtilities.createBoard(1, blackMovesCopy, whiteMovesCopy);
            blackChessUtilities.addEventListeners();
        } else {
            currOpening = openingInfo.blackMoves;
            const whiteMovesCopy = [...openingInfo.whiteMoves];
            const blackMovesCopy = [...openingInfo.blackMoves];

            whiteChessUtilities.createBoard(1, whiteMovesCopy, blackMovesCopy);
            whiteChessUtilities.addEventListeners();
        }
        resetButton.style.display = 'none';
        changeButton.style.display = 'none';
        hintButton.style.display = 'inline';
    }
}

function changeBoard() {
    let board = document.querySelector("#Board");
    let pieceColour = board.childNodes[0].firstChild.id;

    if (pieceColour.includes("Black")) {
        board.innerHTML = "";
        blackChessUtilities.createBoard(0, [], []);
        blackChessUtilities.addEventListeners();
    } else {
        board.innerHTML = "";
        whiteChessUtilities.createBoard(0, [], []);
        whiteChessUtilities.addEventListeners();
    }
}

function resetBoard() {
    let board = document.querySelector("#Board");
    let pieceColour = board.childNodes[0].firstChild.id;

    if (pieceColour.includes("Black")) {
        board.innerHTML = "";
        whiteChessUtilities.createBoard(0, [], []);
        whiteChessUtilities.addEventListeners();
    } else {
        board.innerHTML = "";
        blackChessUtilities.createBoard(0, [], []);
        blackChessUtilities.addEventListeners();
    }
}

function giveHint() {
    fetch('openings.json')
    .then(response => response.json())
    .then(data => {
        const opening = openingTitle.className;
        const openingMoves = data[opening];
        const hintMoves = openingMoves.hintMoves;
        let square1, square2, currMove;
        if(hintMoves[0][0] === "Black") {
            let currHint = blackChessUtilities.getHint();
            currMove = hintMoves[currHint + 1];
        } else {
            let currHint = whiteChessUtilities.getHint();
            currMove = hintMoves[currHint];
        }
        square1 = document.querySelector(`[square-id="${currMove[0]}"]`)
        square2 = document.querySelector(`[square-id="${currMove[1]}"]`)
        square1.style.backgroundColor = "#258CCC";
        square2.style.backgroundColor = "#258CCC";
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
    });
}