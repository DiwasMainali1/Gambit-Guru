import { whiteChessUtilities, blackChessUtilities } from "./helpers/helper.js";

const changeButton = document.getElementById("switchButton");
changeButton.addEventListener("click", changeBoard);

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener("click", resetBoard);

const dropdownItems = document.querySelectorAll('.dropdown-item');
const openingTitle = document.getElementById('opening-title');

whiteChessUtilities.createBoard(0, [], []);
whiteChessUtilities.addEventListeners();

let openingData;

fetch('openings.json')
  .then(response => response.json())
  .then(data => {
    openingData = data;

    dropdownItems.forEach(function(item) {
      item.addEventListener('click', function(event) {
        event.preventDefault();
        var openingId = this.id;
        loadOpeningContent(openingId);
      });
    });
  })
  .catch(error => {
    console.error('Error loading opening data:', error);
  });

function loadOpeningContent(openingId) {
  var openingInfo = openingData[openingId];
  if (openingInfo) {
    openingTitle.textContent = openingInfo.title;

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
      const whiteMovesCopy = [...openingInfo.whiteMoves];
      const blackMovesCopy = [...openingInfo.blackMoves];

      whiteChessUtilities.createBoard(1, whiteMovesCopy, blackMovesCopy);
      whiteChessUtilities.addEventListeners();
    }
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