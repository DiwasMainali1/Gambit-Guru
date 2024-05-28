const changeButton = document.getElementById("switchButton");
changeButton.addEventListener("click", changeBoard);
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetBoard);
import { whiteChessUtilities } from "./helper.js";
import { blackChessUtilities } from "./helper.js";

whiteChessUtilities.createBoard();
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

function resetBoard() {
    let board = document.querySelector("#Board");
    let pieceColour = board.childNodes[0].firstChild.id;
    if (pieceColour.includes("Black")) {
      board.innerHTML = "";
      whiteChessUtilities.createBoard();
      whiteChessUtilities.addEventListeners();
    } else {
      board.innerHTML = "";
      blackChessUtilities.createBoard();
      blackChessUtilities.addEventListeners();
    }
}
