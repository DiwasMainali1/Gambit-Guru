import { whiteChessUtilities, blackChessUtilities } from "./helpers/helper.js";

const changeButton = document.getElementById("switchButton"); 
changeButton.addEventListener("click", changeBoard);

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener("click", resetBoard);

const dropdownItems = document.querySelectorAll('.dropdown-item');
const openingTitle = document.getElementById('opening-title');

whiteChessUtilities.createBoard(0, [], []);
whiteChessUtilities.addEventListeners();

var openingData = {
  ruyLopez: {
    title: 'Ruy Lopez Opening',
    whiteMoves: [
      ["White-Pawn", "c3"],
      ["White-King", "g1"],
      ["White-Bishop", "b3"],
      ["White-Pawn", "d3"],
      ["White-Bishop", "a4"],
      ["White-Bishop", "b5"],
      ["White-Knight", "f3"],
      ["White-Pawn", "e4"],
    ],
    blackMoves: [
      ["d7", "d6"],
      ["f8", "c5"],
      ["b7", "b5"],
      ["g8", "f6"],
      ["a7", "a6"],
      ["b8", "c6"],
      ["e7", "e5"],
    ]
  },
  sicilianDefense: {
    title: 'Sicilian Defense',
    whiteMoves: [
      ["g8", "f6"],
      ["c6", "e5"],
      ["e7", "e5"],
      ["b8", "c6"],
      ["d7", "d5"],
    ],
    blackMoves: [
      ["Black-Pawn", "b3"],
      ["Black-Pawn", "e3"],
      ["Black-Pawn", "e5"],
      ["Black-Knight", "f3"],
      ["Black-Pawn", "f4"],
    ]
  },
  queensGambit: {
    title: "Queen's Gambit",
    whiteMoves: [
      ["White-Pawn", "e3"],
      ["White-Bishop", "f4"],
      ["White-Pawn", "d5"],
      ["White-Knight", "c3"],
      ["White-Pawn", "c4"],
      ["White-Pawn", "d4"]
    ],
    blackMoves: [
      ["c7", "c6"],
      ["c8", "f5"],
      ["e6", "d5"],
      ["g8", "f6"],
      ["e7", "e6"],
      ["d7", "d5"]
    ]
  },
  kingsIndianDefense: {
    title: "King's Indian Defense",
    whiteMoves: [
      ["e5", "e4"],
      ["sCastle", "sCastle"],
      ["c8", "d7"],
      ["b8", "c6"],
      ["d7", "d5"],
      ["g8", "f6"],
      ["f7", "f5"],
      ["e7", "e5"]
    ],
    blackMoves: [
      ["Black-Knight", "d2"],
      ["Black-Knight", "f3"],
      ["Black-Pawn", "d4"], 
      ["Black-King", "b1"],
      ["Black-Pawn", "e3"],
      ["Black-Bishop", "b2"],
      ["Black-Pawn", "b3"],
      ["Black-Knight", "c3"],
    ]
  },
  londonSystem: {
    title: 'London System',
    whiteMoves: [
      ["White-Pawn", "f4"],
      ["White-Knight", "e5"],
      ["White-Bishop", "d3"],
      ["White-Bishop", "g3"],
      ["White-Knight", "f3"],
      ["White-Knight", "d2"],
      ["White-Pawn", "c3"],
      ["White-Pawn", "e3"],
      ["White-Bishop", "f4"],
      ["White-Pawn", "d4"]
    ],
    blackMoves: [
      ["d8", "c7"],
      ["f8", "e8"],
      ["sCastle", "sCastle"],
      ["f8", "d6"],
      ["b8", "c6"],
      ["e7", "e6"],
      ["c7", "c5"],
      ["g8", "f6"],
      ["d7", "d5"]
    ]
  },
  caroKannDefense: {
    title: 'Caro-Kann Defense',
    whiteMoves: [
      ["f7", "f6"],
      ["sCastle", "sCastle"],
      ["c8", "e6"],
      ["b8", "c6"],
      ["d5", "c3"],
      ["f6", "d5"],
      ["g8", "f6"],
      ["e7", "e5"],
      ["d7", "d5"]
    ],
    blackMoves: [
      ["Black-Knight", "e2"],
      ["Black-Bishop", "b5"],
      ["Black-King", "b1"],
      ["Black-Bishop", "e3"],
      ["Black-Pawn", "c3"],
      ["Black-Knight", "c3"],
      ["Black-Pawn", "d5"],
      ["Black-Pawn", "e4"],
      ["Black-Pawn", "f3"]
    ]
  }
};

dropdownItems.forEach(function(item) {
  item.addEventListener('click', function(event) {
    event.preventDefault();
    var openingId = this.id;
    loadOpeningContent(openingId);
  });
});

function loadOpeningContent(openingId) {
  var openingInfo = openingData[openingId];
  if (openingInfo) {
    openingTitle.textContent = openingInfo.title;

    let board = document.querySelector("#Board");
    let pieceColour = board.childNodes[0].firstChild.id;

    if (pieceColour.includes("Black") && openingId !== 'sicilianDefense' && openingId !== 'kingsIndianDefense' && openingId !== 'caroKannDefense') {
      changeBoard();
    } else if (pieceColour.includes("White") && (openingId === 'sicilianDefense' || openingId === 'kingsIndianDefense' || openingId === 'caroKannDefense')) {
      changeBoard();
    }

    board.innerHTML = '';

    if (openingId === 'sicilianDefense' || openingId === 'kingsIndianDefense' || openingId === 'caroKannDefense') {
      blackChessUtilities.createBoard(1, openingInfo.blackMoves, openingInfo.whiteMoves);
      blackChessUtilities.addEventListeners();
    } else {
      whiteChessUtilities.createBoard(1, openingInfo.whiteMoves, openingInfo.blackMoves);
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