const changeButton = document.getElementById("switchButton"); 
changeButton.addEventListener("click", changeBoard);

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetBoard);

const ruyLopezButton = document.getElementById('ruyLopez');
const sicilianDefenseButton = document.getElementById('sicilianDefense');
const frenchDefenseButton = document.getElementById('frenchDefense');
const queensGambitButton = document.getElementById('queensGambit');
const kingsIndianDefenseButton = document.getElementById('kingsIndianDefense');
const caroKannDefenseButton = document.getElementById('caroKannDefense');

import { whiteChessUtilities, blackChessUtilities } from "./helpers/helper.js";

whiteChessUtilities.createBoard(0, [], []);
whiteChessUtilities.addEventListeners();

ruyLopezButton.addEventListener('click', () => {
    let board = document.querySelector("#Board");
    let pieceColour = board.childNodes[0].firstChild.id;
    
    if (pieceColour.includes("White")) {
        changeBoard();
    }
    board.innerHTML = '';
    let ruyLopezMoves = [
        ["White-Pawn", "c3"],
        ["White-King", "g1"],
        ["White-Bishop", "b3"],
        ["White-Pawn", "d3"],
        ["White-Bishop", "a4"],
        ["White-Bishop", "b5"],
        ["White-Knight", "f3"],
        ["White-Pawn", "e4"],
    ];   
    let blackMoves = [
        ["d7", "d6"],
        ["f8", "c5"],
        ["b7", "b5"],
        ["g8", "f6"],
        ["a7", "a6"],
        ["b8", "c6"],
        ["e7", "e5"],
    ];
    whiteChessUtilities.createBoard(1, ruyLopezMoves, blackMoves);
    whiteChessUtilities.addEventListeners();
});

sicilianDefenseButton.addEventListener('click', () => {
    let board = document.querySelector("#Board");
    let pieceColour = board.childNodes[0].firstChild.id;
    if (pieceColour.includes("Black")) {
        changeBoard();
    }
    board.innerHTML = '';
    let sicilianMoves = [
        ["Black-Pawn", "b3"],
        ["Black-Pawn", "e3"],
        ["Black-Pawn", "e5"],
        ["Black-Knight", "f3"],
        ["Black-Pawn", "f4"],
    ];
    let whiteMoves = [
        ["g8", "f6"],
        ["c6", "e5"],
        ["e7", "e5"],
        ["b8", "c6"],
    ];   
    blackChessUtilities.createBoard(1, sicilianMoves, whiteMoves);
    blackChessUtilities.addEventListeners();
});

queensGambitButton.addEventListener('click', () => {
    let board = document.querySelector("#Board");
    let pieceColour = board.childNodes[0].firstChild.id;
    if (pieceColour.includes("White")) {
        changeBoard();
    }
    board.innerHTML = '';
    let queensGambitMoves = [
        ["White-Pawn", "e3"],
        ["White-Bishop", "f4"],
        ["White-Pawn", "d5"],
        ["White-Knight", "c3"],
        ["White-Pawn", "c4"],
        ["White-Pawn", "d4"]
    ];
    
    let blackMoves = [
        ["c7", "c6"],
        ["c8", "f5"],
        ["e6", "d5"],
        ["g8", "f6"],
        ["e7", "e6"],
        ["d7", "d5"]
    ];
    whiteChessUtilities.createBoard(1, queensGambitMoves, blackMoves);
    whiteChessUtilities.addEventListeners();
});

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
