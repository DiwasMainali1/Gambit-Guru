const changeButton = document.getElementById("switchButton");
changeButton.addEventListener("click", changeBoard);
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetBoard);
import { whiteChessUtilities } from "./helper.js";
import { blackChessUtilities } from "./helper.js";
let oMoves = [
    ["White-Pawn", "c3"],
    ["White-King", "g1"],
    ["White-Bishop", "b3"],
    ["White-Pawn", "d3"],
    ["White-Bishop", "a4"],
    ["White-Bishop", "b5"],
    ["White-Knight", "f3"],
    ["White-Pawn", "e4"],
];
let bMoves = [
    ["d7", "d6"],
    ["f8", "c5"],
    ["b7", "b5"],
    ["g8", "f6"],
    ["a7", "a6"],
    ["b8", "c6"],
    ["e7", "e5"],
];
whiteChessUtilities.createBoard(0, oMoves, bMoves);

whiteChessUtilities.addEventListeners();

function changeBoard() {
  let board = document.querySelector("#Board");
  let pieceColour = board.childNodes[0].firstChild.id;
  if (pieceColour.includes("Black")) {
    board.innerHTML = "";
    blackChessUtilities.createBoard();
    blackChessUtilities.addEventListeners();
  } else {
    board.innerHTML = "";
    whiteChessUtilities.createBoard();
    whiteChessUtilities.addEventListeners();
  }
}

export function resetBoard() {
    let board = document.querySelector("#Board");
    let pieceColour = board.childNodes[0].firstChild.id;
    if (pieceColour.includes("Black")) {
      board.innerHTML = "";
      whiteChessUtilities.createBoard(0, oMoves, bMoves);
      whiteChessUtilities.addEventListeners();
    } else {
      board.innerHTML = "";
      blackChessUtilities.createBoard();
      blackChessUtilities.addEventListeners();
    }
}
