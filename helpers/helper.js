const whiteChessUtilities = (function () {
	const board = document.querySelector("#Board");

    let isDragDrop, isKingMoved, isSrookMoved, isLrookMoved, draggedElement, isOpening;
    let openingMoves = [], blackMoves = [];
    let openingStorage = [], blackStorage = [];

    const startPieces = [
        A_blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, H_blackRook,
        blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn,
        '', '',  '',  '',  '',  '',  '',  '', 
        '', '',  '',  '',  '',  '',  '',  '',
        '', '',  '',  '',  '',  '',  '',  '',
        '', '',  '',  '',  '',  '',  '',  '',
        whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn,
        A_whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, H_whiteRook
    ];
	createBoard();
	addEventListeners();
	function addConfetti() {
		confetti({
			particleCount: 1000,
			spread: 700,
			origin: { y: 0.5 },
		});
	}
	function createBoard(bool, movesA, movesB) {
		if (bool) {
			isOpening = 1;
			openingMoves = movesA;
            openingStorage = [...movesA];			
            blackMoves = movesB;
            blackStorage = [...movesB];
        }
		let rank = 8;
		startPieces.forEach((startPiece, i) => {
			let index = 8 - (i % 8);
			let file = String.fromCharCode(105 - index);
			const square = document.createElement("div");
			square.classList.add("square");
			square.innerHTML = startPiece;
			square.firstChild?.setAttribute("draggable", true);
			if ((rank + (105 - index)) % 2) {
				square.classList.add("yellow");
			} else {
				square.classList.add("gray");
			}
			square.setAttribute("square-id", file + rank);
			board.append(square);
			if (index == 1) {
				rank = rank - 1;
			}
		});
	}

    function getHint() {
        return openingMoves.length - 1;
    }

    function resetBoard() {
        (isDragDrop = isSrookMoved = isLrookMoved = draggedElement = 0),
		(isKingMoved = 0);
        openingMoves = [...openingStorage];
        blackMoves = [...blackStorage];
        board.innerHTML = '';
        createBoard(isOpening, openingMoves, blackMoves);
        addEventListeners();
    }
	function addEventListeners() {
		const allSquares = document.querySelectorAll("#Board .square");
		allSquares.forEach((square) => {
			const img = square.querySelector("img");
			img?.classList.add("grabbable");
			square.addEventListener("dragstart", dragStart);
			square.addEventListener("dragover", dragOver);
			square.addEventListener("drop", dragDrop);
			square.addEventListener("dragend", dragEnd);
		});
	}
	function dragStart(e) {
		draggedElement =
			e.target.tagName.toLowerCase() === "img" ? e.target : null;
		if (draggedElement) getPossibleMoves(e);
		else e.preventDefault();
	}

	function dragOver(e) {
		e.dataTransfer.dropEffect = "move";
		e.preventDefault();
	}

	function dragDrop(e) {
		let pieceNode = e.target;
		let hasSpan = pieceNode.querySelector("span") !== null;
		let hasCapture =
			pieceNode.parentNode.style.backgroundColor === "rgb(100, 110, 64)";
		let squareId = e.target.getAttribute("square-id");
		if (pieceNode.tagName.toLowerCase() === "span") {
			pieceNode = pieceNode.parentNode;
			squareId = pieceNode.getAttribute("square-id");
			hasSpan = 1;
		}
		if (hasCapture) {
			pieceNode = pieceNode.parentNode;
			squareId = pieceNode.getAttribute("square-id");
		}
		if (!isKingMoved && draggedElement.id === "White-King" && squareId === "g1") {
			let rookElement = document.querySelector(
				`[id="${"H-White-Rook"}"]`,
			);
			let rookSquare = document.querySelector(`[square-id="${"f1"}"]`);
			pieceNode.appendChild(draggedElement);
			rookSquare.appendChild(rookElement);
			removeColour(allSquares);
			specialSquares.length = 0;
			isDragDrop = 1;
		} else if (!isKingMoved && draggedElement.id === "White-King" && squareId === "c1") {
			let rookElement = document.querySelector(
				`[id="${"A-White-Rook"}"]`,
			);
			let rookSquare = document.querySelector(`[square-id="${"d1"}"]`);
			pieceNode.appendChild(draggedElement);
			rookSquare.appendChild(rookElement);
			removeColour(allSquares);
			specialSquares.length = 0;
			isDragDrop = 1;
		} else if (hasSpan) {
			pieceNode.appendChild(draggedElement);
			removeColour(allSquares);
			specialSquares.length = 0;
			isDragDrop = 1;
		} else if (hasCapture) {
			pieceNode.innerHTML = "";
			pieceNode.appendChild(draggedElement);
			removeColour(allSquares);
			specialSquares.length = 0;
			isDragDrop = 1;
		}
		if (isDragDrop && draggedElement.id == "White-King") {
			isKingMoved = 1;
		}
		if (isDragDrop && draggedElement.id == "A-White-Rook") {
			isLrookMoved = 1;
		}
		if (isDragDrop && draggedElement.id == "H-White-Rook") {
			isSrookMoved = 1;
		}
		if (isOpening && isDragDrop) {
            const lastMove = openingMoves[openingMoves.length - 1];
            if (JSON.stringify([draggedElement.id, squareId]) === JSON.stringify(lastMove)) {
                pieceNode.style.backgroundColor = "green";
                specialSquares.push(pieceNode);
                if (blackMoves.length > 0) {
                    let bPieceLocation = blackMoves[blackMoves.length - 1][0];
                    let blackPieceNode = blackMoves[blackMoves.length - 1][1];

                    if(blackPieceNode === "sCastle") {
                        let ksquare1 = document.querySelector(`[square-id="${'g8'}"]`);
                        let rsquare1 = document.querySelector(`[square-id="${'f8'}"]`);
                        let kSquare = document.querySelector(`[square-id="${'e8'}"]`);
                        let rSquare = document.querySelector(`[square-id="${'h8'}"]`);
                        let kPiece = kSquare.childNodes[0];
                        let rPiece = rSquare.childNodes[0];
                        ksquare1.appendChild(kPiece);
                        rsquare1.appendChild(rPiece);
                        blackMoves.pop();
                        openingMoves.pop();
                        return;
                    }

                    let blackPiece = document.querySelector(`[square-id="${bPieceLocation}"]`);
                    let childNodes = blackPiece.childNodes;
                    let whiteSquare = document.querySelector(
                        `[square-id="${blackPieceNode}"]`,
                    );
                    isDragDrop = 0;
                    whiteSquare.innerHTML = "";
                    whiteSquare.appendChild(childNodes[0]);
                    whiteSquare.style.backgroundColor = "";
                    blackMoves.pop();
                }
                openingMoves.pop();
            } else {
                pieceNode.style.backgroundColor = "red";
                setTimeout(() => {
                    resetBoard();
                }, 250);
            }
			if (!openingMoves.length) {
				const allSquares = document.querySelectorAll("#Board .square");
				allSquares.forEach((square) => {
					const img = square.querySelector("img");
					if (img) {
						square.style.backgroundColor = "pink";
					}
				});
				addConfetti();
				setTimeout(() => {
					resetBoard();
				}, 1300);
			}
		}
	}

	function dragEnd(e) {
		const pieceNode = e.target;
		if (isDragDrop) {
			isDragDrop = 0;
		}
		pieceNode.style.visibility = "visible";
	}

	function getInfo(e) {
		let pieceId = e.target.parentNode.getAttribute("square-id");
		let pieceName = e.target.getAttribute("id");
		let squareId = e.target.getAttribute("square-id");
		if (pieceId) {
			return [pieceId, pieceName];
		} else {
			return squareId;
		}
	}

	const specialSquares = [];
	const captureSquares = [];
	const allSquares = [];
	let prevSquare = NaN;
	function getPossibleMoves(e) {
		const pieceNode = e.target.parentNode;
		const imageNode = e.target.parentNode.firstElementChild;
		if (imageNode) {
			setTimeout(() => {
				imageNode.style.visibility = "hidden";
			}, 0);
		}
		const clickInfo = getInfo(e);
		removeColour(allSquares);
		specialSquares.length = 0;
		captureSquares.length = 0;
		if (pieceNode && pieceNode == prevSquare) {
			prevSquare = NaN;
			return;
		}
		prevSquare = e.target.parentNode;
		if (Array.isArray(clickInfo)) {
			const pieceName = clickInfo[1];
			const pieceId = clickInfo[0];
			let possibleMoveIds = [];
			if (pieceName === "White-Pawn") {
				possibleMoveIds = pawnMoves(pieceId);
			} else if (pieceName === "White-Knight") {
				possibleMoveIds = knightMoves(pieceId);
			} else if (pieceName == "White-Bishop") {
				possibleMoveIds = bishopMoves(pieceId);
			} else if (pieceName == "White-Queen") {
				possibleMoveIds = queenMoves(pieceId);
			} else if (
				pieceName == "A-White-Rook" ||
				pieceName == "H-White-Rook"
			) {
				possibleMoveIds = rookMoves(pieceId);
			} else if (pieceName == "White-King") {
				possibleMoveIds = kingMoves(pieceId);
			}
			possibleMoveIds.forEach((moveId) => {
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (moveSquare) {
					if (moveSquare.childNodes.length > 0) {
						const childNode = moveSquare.childNodes[0];
						if (
							childNode &&
							childNode.classList &&
							childNode.classList.contains("Bpiece")
						) {
							captureSquares.push(moveSquare);
							allSquares.push(moveSquare);
							captureHighlight(captureSquares);
							return;
						}
					}
					specialSquares.push(moveSquare);
					allSquares.push(moveSquare);
				}
			});
		}
		fillColour(specialSquares);
	}

	function captureHighlight(squares) {
		for (let i in squares) {
			const square = squares[i];
			square.style.backgroundColor = "#646e40";
		}
	}

	function fillColour(squares) {
		for (let i in squares) {
			const square = squares[i];
			square.style.display = "flex";
			square.style.justifyContent = "center";
			square.style.alignItems = "center";
			square.innerHTML =
				'<span style="display: inline-block; width: 19px; height: 19px; border-radius: 50%; background-color: #646e40; opacity: 0.9;"></span>';
		}
	}

	function removeColour(squares) {
		for (let i = 0; i < squares.length; i++) {
			const square = squares[i];
			const spanElement = square.querySelector("span");

			if (spanElement) {
				square.removeChild(spanElement);
			}
			square.style.backgroundColor = "";
		}
	}

	function pawnMoves(pos) {
		const file = pos[0];
		const rank = parseInt(pos[1]);
		const moveset = [];

		if (rank === 2) {
			const oneStepMove = file + (rank + 1);
			const twoStepMove = file + (rank + 2);
			const oneStepSquare = document.querySelector(
				`[square-id="${oneStepMove}"]`,
			);
			const twoStepSquare = document.querySelector(
				`[square-id="${twoStepMove}"]`,
			);

			if (oneStepSquare.childNodes.length === 0) {
				moveset.push(oneStepMove);

				if (twoStepSquare.childNodes.length === 0) {
					moveset.push(twoStepMove);
				}
			}
		} else {
			const oneStepMove = file + (rank + 1);
			const oneStepSquare = document.querySelector(
				`[square-id="${oneStepMove}"]`,
			);

			if (oneStepSquare.childNodes.length === 0) {
				moveset.push(oneStepMove);
			}
		}

		const captureFiles = [
			String.fromCharCode(file.charCodeAt(0) - 1),
			String.fromCharCode(file.charCodeAt(0) + 1),
		];
		for (const captureFile of captureFiles) {
			if (captureFile >= "a" && captureFile <= "h") {
				const captureMove = captureFile + (rank + 1);
				const captureSquare = document.querySelector(
					`[square-id="${captureMove}"]`,
				);
				if (
					captureSquare.childNodes.length > 0 &&
					captureSquare.childNodes[0].classList.contains("Bpiece")
				) {
					moveset.push(captureMove);
				}
			}
		}
		return moveset;
	}

	function knightMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const moves = [
			[-1, 2],
			[1, 2],
			[-2, 1],
			[2, 1],
			[-2, -1],
			[2, -1],
			[-1, -2],
			[1, -2],
		];

		for (const [fileOffset, rankOffset] of moves) {
			const newFile = String.fromCharCode(file + fileOffset);
			const newRank = rank + rankOffset;
			if (
				newFile >= "a" &&
				newFile <= "h" &&
				newRank >= 1 &&
				newRank <= 8
			) {
				const moveId = newFile + newRank;
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (
					moveSquare.childNodes.length === 0 ||
					!moveSquare.childNodes[0].classList.contains("Wpiece")
				) {
					moveset.push(moveId);
				}
			}
		}

		return moveset;
	}

	function bishopMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const directions = [
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1],
		];

		for (const [fileOffset, rankOffset] of directions) {
			for (let i = 1; i <= 8; i++) {
				const newFile = String.fromCharCode(file + fileOffset * i);
				const newRank = rank + rankOffset * i;
				if (
					newFile < "a" ||
					newFile > "h" ||
					newRank < 1 ||
					newRank > 8
				)
					break;

				const moveId = newFile + newRank;
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (moveSquare.childNodes.length > 0) {
					const childNode = moveSquare.childNodes[0];
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Wpiece")
					) {
						break;
					}
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Bpiece")
					) {
						moveset.push(moveId);
						break;
					}
				}

				moveset.push(moveId);
			}
		}

		return moveset;
	}

	function queenMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const directions = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1],
		];

		for (const [fileOffset, rankOffset] of directions) {
			for (let i = 1; i <= 8; i++) {
				const newFile = String.fromCharCode(file + fileOffset * i);
				const newRank = rank + rankOffset * i;
				if (
					newFile < "a" ||
					newFile > "h" ||
					newRank < 1 ||
					newRank > 8
				)
					break;

				const moveId = newFile + newRank;
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (moveSquare.childNodes.length > 0) {
					const childNode = moveSquare.childNodes[0];
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Wpiece")
					) {
						break;
					}
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Bpiece")
					) {
						moveset.push(moveId);
						break;
					}
				}
				moveset.push(moveId);
			}
		}

		return moveset;
	}

	function rookMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const directions = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		];

		for (const [fileOffset, rankOffset] of directions) {
			for (let i = 1; i <= 8; i++) {
				const newFile = String.fromCharCode(file + fileOffset * i);
				const newRank = rank + rankOffset * i;
				if (
					newFile < "a" ||
					newFile > "h" ||
					newRank < 1 ||
					newRank > 8
				)
					break;

				const moveId = newFile + newRank;
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (moveSquare.childNodes.length > 0) {
					const childNode = moveSquare.childNodes[0];
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Wpiece")
					) {
						break;
					}
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Bpiece")
					) {
						moveset.push(moveId);
						break;
					}
				}

				moveset.push(moveId);
			}
		}

		return moveset;
	}

	function kingMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const directions = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1],
		];
		const shortCastleDir = [
			[1, 0],
			[2, 0],
		];
		const longCastleDir = [
			[-1, 0],
			[-2, 0],
			[-3, 0],
		];
		for (const [fileOffset, rankOffset] of directions) {
			const newFile = String.fromCharCode(file + fileOffset);
			const newRank = rank + rankOffset;
			const moveId = newFile + newRank;
			const moveSquare = document.querySelector(
				`[square-id="${moveId}"]`,
			);
			if (moveSquare && moveSquare.childNodes.length > 0) {
				const childNode = moveSquare.childNodes[0];
				if (
					childNode &&
					childNode.classList &&
					childNode.classList.contains("Wpiece")
				) {
					continue;
				}
			}
			moveset.push(moveId);
		}
		if (isKingMoved) {
			return moveset;
		}
		if (!isSrookMoved) {
			let isShortCastle = checkShortCastle(file, rank, shortCastleDir);
			if (isShortCastle) {
				moveset.push("g1");
			}
		}
		if (!isLrookMoved) {
			let isLongCastle = checkLongCastle(file, rank, longCastleDir);
			if (isLongCastle) {
				moveset.push("c1");
			}
		}
		return moveset;
	}

	function checkShortCastle(file, rank, shortCastleDir) {
		let boolean = 1;

		for (const [fileOffset, rankOffset] of shortCastleDir) {
			const newFile = String.fromCharCode(file + fileOffset);
			const newRank = rank + rankOffset;
			const moveId = newFile + newRank;
			const moveSquare = document.querySelector(
				`[square-id="${moveId}"]`,
			);

			if (moveSquare && moveSquare.childNodes.length > 0) {
				const childNode = moveSquare.childNodes[0];
				if (
					childNode &&
					childNode.classList &&
					childNode.classList.contains("Wpiece")
				) {
					boolean = 0;
					break;
				}
			}
		}

		return boolean;
	}

	function checkLongCastle(file, rank, longCastleDir) {
		let boolean = 1;

		for (const [fileOffset, rankOffset] of longCastleDir) {
			const newFile = String.fromCharCode(file + fileOffset);
			const newRank = rank + rankOffset;
			const moveId = newFile + newRank;
			const moveSquare = document.querySelector(
				`[square-id="${moveId}"]`,
			);

			if (moveSquare && moveSquare.childNodes.length > 0) {
				const childNode = moveSquare.childNodes[0];
				if (
					childNode &&
					childNode.classList &&
					childNode.classList.contains("Wpiece")
				) {
					boolean = 0;
					break;
				}
			}
		}

		return boolean;
	}
	return {
        getHint,
		addConfetti,
		createBoard,
		addEventListeners,
		dragStart,
		dragOver,
		dragDrop,
		dragEnd,
		getInfo,
		getPossibleMoves,
		captureHighlight,
		fillColour,
		removeColour,
		pawnMoves,
		knightMoves,
		bishopMoves,
		queenMoves,
		rookMoves,
		kingMoves,
		checkShortCastle,
		checkLongCastle,
	};
})();

const blackChessUtilities = (function() {
    const board = document.querySelector("#Board")

    let isDragDrop, isKingMoved, isSrookMoved, isLrookMoved, draggedElement, isOpening;
    let openingMoves = [], whiteMoves = [];
    let openingStorage = [], whiteStorage = [];

    const startPieces = [
        A_whiteRook, whiteKnight, whiteBishop, whiteKing, whiteQueen, whiteBishop, whiteKnight, H_whiteRook,
        whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn,
        '', '',  '',  '',  '',  '',  '',  '', 
        '', '',  '',  '',  '',  '',  '',  '',
        '', '',  '',  '',  '',  '',  '',  '',
        '', '',  '',  '',  '',  '',  '',  '',
        blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn,
        A_blackRook, blackKnight, blackBishop, blackKing, blackQueen, blackBishop, blackKnight, H_blackRook
    ]
    createBoard();
    addEventListeners();
	function addConfetti() {
		confetti({
			particleCount: 1000,
			spread: 700,
			origin: { y: 0.5 },
		});
	}
	function createBoard(bool, movesA, movesB) {
		if (bool) {
			isOpening = 1;
			openingMoves = movesA;
            openingStorage = [...movesA];			
            whiteMoves = movesB;
            whiteStorage = [...movesB];
            setTimeout(() => {
                let [wPieceLocation, whitePieceNode] = whiteMoves.pop();
                let whitePiece = document.querySelector(`[square-id="${wPieceLocation}"]`);
                let blackSquare = document.querySelector(`[square-id="${whitePieceNode}"]`);
                isDragDrop = 0;
                blackSquare.innerHTML = "";
                blackSquare.appendChild(whitePiece.childNodes[0]);
                blackSquare.style.backgroundColor = "";
            }, 100);
        }
		let rank = 8;
		startPieces.forEach((startPiece, i) => {
			let index = 8 - (i % 8);
			let file = String.fromCharCode(105 - index);
			const square = document.createElement("div");
			square.classList.add("square");
			square.innerHTML = startPiece;
			square.firstChild?.setAttribute("draggable", true);
			if ((rank + (105 - index)) % 2) {
				square.classList.add("yellow");
			} else {
				square.classList.add("gray");
			}
			square.setAttribute("square-id", file + rank);
			board.append(square);
			if (index == 1) {
				rank = rank - 1;
			}
		});
	}

    function getHint() {
        return openingMoves.length - 1;
    }

    function resetBoard() {
        (isDragDrop = isSrookMoved = isLrookMoved = draggedElement = 0),
		(isKingMoved = 0);
        openingMoves = [...openingStorage];
        whiteMoves = [...whiteStorage];
        board.innerHTML = '';
        createBoard(isOpening, openingMoves, whiteMoves);
        addEventListeners();
    }
	function addEventListeners() {
		const allSquares = document.querySelectorAll("#Board .square");

		allSquares.forEach((square) => {
			const img = square.querySelector("img");
			if (img) {
				img.classList.add("grabbable");
			}
			square.addEventListener("dragstart", dragStart);
			square.addEventListener("dragover", dragOver);
			square.addEventListener("drop", dragDrop);
			square.addEventListener("dragend", dragEnd);
		});
	}

	function dragStart(e) {
		draggedElement = e.target;
		if (draggedElement.tagName.toLowerCase() !== "img") {
			e.preventDefault();
			return;
		}
		getPossibleMoves(e);
	}

	function dragOver(e) {
		e.dataTransfer.dropEffect = "move";
		e.preventDefault();
	}

	function dragDrop(e) {
		let pieceNode = e.target;
		let hasSpan = pieceNode.querySelector("span") !== null;
		let hasCapture =
			pieceNode.parentNode.style.backgroundColor === "rgb(100, 110, 64)";
		let squareId = e.target.getAttribute("square-id");
		if (pieceNode.tagName.toLowerCase() === "span") {
			pieceNode = pieceNode.parentNode;
			squareId = pieceNode.getAttribute("square-id");
			hasSpan = 1;
		}
		if (hasCapture) {
			pieceNode = pieceNode.parentNode;
			squareId = pieceNode.getAttribute("square-id");
		}
		if (
			!isKingMoved &&
			draggedElement.id === "Black-King" &&
			squareId === "f1"
		) {
			let rookElement = document.querySelector(
				`[id="${"H-Black-Rook"}"]`,
			);
			let rookSquare = document.querySelector(`[square-id="${"e1"}"]`);
			pieceNode.appendChild(draggedElement);
			rookSquare.appendChild(rookElement);
			removeColour(allSquares);
			specialSquares.length = 0;
			isDragDrop = 1;
		} else if (
			!isKingMoved &&
			draggedElement.id === "Black-King" &&
			squareId === "b1"
		) {
			let rookElement = document.querySelector(
				`[id="${"A-Black-Rook"}"]`,
			);
			let rookSquare = document.querySelector(`[square-id="${"c1"}"]`);
			pieceNode.appendChild(draggedElement);
			rookSquare.appendChild(rookElement);
			removeColour(allSquares);
			specialSquares.length = 0;
			isDragDrop = 1;
		} else if (hasSpan) {
			pieceNode.appendChild(draggedElement);
			removeColour(allSquares);
			specialSquares.length = 0;
			isDragDrop = 1;
		} else if (hasCapture) {
			pieceNode.innerHTML = "";
			pieceNode.appendChild(draggedElement);
			removeColour(allSquares);
			specialSquares.length = 0;
			isDragDrop = 1;
		}
		if (isDragDrop && draggedElement.id == "Black-King") {
			isKingMoved = 1;
		}
		if (isDragDrop && draggedElement.id == "A-Black-Rook") {
			isLrookMoved = 1;
		}
		if (isDragDrop && draggedElement.id == "H-Black-Rook") {
			isSrookMoved = 1;
		}
		if (isOpening && isDragDrop) {
			const lastMove = openingMoves[openingMoves.length - 1];
			if (JSON.stringify([draggedElement.id, squareId]) === JSON.stringify(lastMove)) {
				pieceNode.style.backgroundColor = "green";
				specialSquares.push(pieceNode);
				if (whiteMoves.length > 0) {
					let wPieceLocation = whiteMoves[whiteMoves.length - 1][0];
					let whitePieceNode = whiteMoves[whiteMoves.length - 1][1];
                    if(whitePieceNode === "sCastle") {
                        let ksquare1 = document.querySelector(`[square-id="${'b8'}"]`);
                        let rsquare1 = document.querySelector(`[square-id="${'c8'}"]`);
                        let kSquare = document.querySelector(`[square-id="${'d8'}"]`);
                        let rSquare = document.querySelector(`[square-id="${'a8'}"]`);
                        let kPiece = kSquare.childNodes[0];
                        let rPiece = rSquare.childNodes[0];
                        ksquare1.appendChild(kPiece);
                        rsquare1.appendChild(rPiece);
                        whiteMoves.pop();
                        openingMoves.pop();
                        return;
                    }
                    let whitePiece = document.querySelector(
						`[square-id="${wPieceLocation}"]`,
					);
					let childNodes = whitePiece.childNodes;
					let blackSquare = document.querySelector(
						`[square-id="${whitePieceNode}"]`,
					);
                    isDragDrop = 0;
					blackSquare.innerHTML = "";
					blackSquare.appendChild(childNodes[0]);
					whiteMoves.pop();
				}
				openingMoves.pop();
			} else {
				pieceNode.style.backgroundColor = "red";
                setTimeout(() => {
					resetBoard();
				}, 250);
			}
			if (!openingMoves.length) {
				const allSquares = document.querySelectorAll("#Board .square");
				allSquares.forEach((square) => {
					const img = square.querySelector("img");
					if (img) {
						square.style.backgroundColor = "pink";
					}
				});
				addConfetti();
				setTimeout(() => {
					resetBoard();
				}, 1300);
			}
		}
	}

	function dragEnd(e) {
		const pieceNode = e.target;
		if (isDragDrop) {
			isDragDrop = 0;
		}
		pieceNode.style.visibility = "visible";
	}

	function getInfo(e) {
		let pieceId = e.target.parentNode.getAttribute("square-id");
		let pieceName = e.target.getAttribute("id");
		let squareId = e.target.getAttribute("square-id");
		if (pieceId) {
			return [pieceId, pieceName];
		} else {
			return squareId;
		}
	}

	const specialSquares = [];
	const captureSquares = [];
	const allSquares = [];
	let prevSquare = NaN;
	function getPossibleMoves(e) {
		const pieceNode = e.target.parentNode;
		const imageNode = e.target.parentNode.firstElementChild;
		if (imageNode) {
			setTimeout(() => {
				imageNode.style.visibility = "hidden";
			}, 0);
		}
		const clickInfo = getInfo(e);
		removeColour(allSquares);
		specialSquares.length = 0;
		captureSquares.length = 0;
		if (pieceNode && pieceNode == prevSquare) {
            prevSquare = NaN;
			return;
		}
		prevSquare = e.target.parentNode;
		if (Array.isArray(clickInfo)) {
			const pieceName = clickInfo[1];
			const pieceId = clickInfo[0];
			let possibleMoveIds = [];
			if (pieceName === "Black-Pawn") {
				possibleMoveIds = pawnMoves(pieceId);
			} else if (pieceName === "Black-Knight") {
				possibleMoveIds = knightMoves(pieceId);
			} else if (pieceName == "Black-Bishop") {
				possibleMoveIds = bishopMoves(pieceId);
			} else if (pieceName == "Black-Queen") {
				possibleMoveIds = queenMoves(pieceId);
			} else if (
				pieceName == "A-Black-Rook" ||
				pieceName == "H-Black-Rook"
			) {
				possibleMoveIds = rookMoves(pieceId);
			} else if (pieceName == "Black-King") {
				possibleMoveIds = kingMoves(pieceId);
			}
			possibleMoveIds.forEach((moveId) => {
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (moveSquare) {
					if (moveSquare.childNodes.length > 0) {
						const childNode = moveSquare.childNodes[0];
						if (
							childNode &&
							childNode.classList &&
							childNode.classList.contains("Wpiece")
						) {
							captureSquares.push(moveSquare);
							allSquares.push(moveSquare);
							captureHighlight(captureSquares);
							return;
						}
					}
					specialSquares.push(moveSquare);
					allSquares.push(moveSquare);
				}
			});
		}
		fillColour(specialSquares);
	}

	function captureHighlight(squares) {
		for (let i in squares) {
			const square = squares[i];
			square.style.backgroundColor = "#646e40";
		}
	}

	function fillColour(squares) {
		for (let i in squares) {
			const square = squares[i];
			square.style.display = "flex";
			square.style.justifyContent = "center";
			square.style.alignItems = "center";
			square.innerHTML =
				'<span style="display: inline-block; width: 19px; height: 19px; border-radius: 50%; background-color: #646e40; opacity: 0.9;"></span>';
		}
	}

	function removeColour(squares) {
		for (let i = 0; i < squares.length; i++) {
			const square = squares[i];
			const spanElement = square.querySelector("span");

			if (spanElement) {
				square.removeChild(spanElement);
			}
			square.style.backgroundColor = "";
		}
	}

	function pawnMoves(pos) {
		const file = pos[0];
		const rank = parseInt(pos[1]);
		const moveset = [];

		if (rank === 2) {
			const oneStepMove = file + (rank + 1);
			const twoStepMove = file + (rank + 2);
			const oneStepSquare = document.querySelector(
				`[square-id="${oneStepMove}"]`,
			);
			const twoStepSquare = document.querySelector(
				`[square-id="${twoStepMove}"]`,
			);

			if (oneStepSquare.childNodes.length === 0) {
				moveset.push(oneStepMove);

				if (twoStepSquare.childNodes.length === 0) {
					moveset.push(twoStepMove);
				}
			}
		} else {
			const oneStepMove = file + (rank + 1);
			const oneStepSquare = document.querySelector(
				`[square-id="${oneStepMove}"]`,
			);

			if (oneStepSquare.childNodes.length === 0) {
				moveset.push(oneStepMove);
			}
		}

		const captureFiles = [
			String.fromCharCode(file.charCodeAt(0) - 1),
			String.fromCharCode(file.charCodeAt(0) + 1),
		];
		for (const captureFile of captureFiles) {
			if (captureFile >= "a" && captureFile <= "h") {
				const captureMove = captureFile + (rank + 1);
				const captureSquare = document.querySelector(
					`[square-id="${captureMove}"]`,
				);
				if (
					captureSquare.childNodes.length > 0 &&
					captureSquare.childNodes[0].classList.contains("Wpiece")
				) {
					moveset.push(captureMove);
				}
			}
		}
		return moveset;
	}

	function knightMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const moves = [
			[-1, 2],
			[1, 2],
			[-2, 1],
			[2, 1],
			[-2, -1],
			[2, -1],
			[-1, -2],
			[1, -2],
		];

		for (const [fileOffset, rankOffset] of moves) {
			const newFile = String.fromCharCode(file + fileOffset);
			const newRank = rank + rankOffset;
			if (
				newFile >= "a" &&
				newFile <= "h" &&
				newRank >= 1 &&
				newRank <= 8
			) {
				const moveId = newFile + newRank;
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (
					moveSquare.childNodes.length === 0 ||
					!moveSquare.childNodes[0].classList.contains("Bpiece")
				) {
					moveset.push(moveId);
				}
			}
		}

		return moveset;
	}

	function bishopMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const directions = [
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1],
		];

		for (const [fileOffset, rankOffset] of directions) {
			for (let i = 1; i <= 8; i++) {
				const newFile = String.fromCharCode(file + fileOffset * i);
				const newRank = rank + rankOffset * i;
				if (
					newFile < "a" ||
					newFile > "h" ||
					newRank < 1 ||
					newRank > 8
				)
					break;

				const moveId = newFile + newRank;
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (moveSquare.childNodes.length > 0) {
					const childNode = moveSquare.childNodes[0];
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Bpiece")
					) {
						break;
					}
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Wpiece")
					) {
						moveset.push(moveId);
						break;
					}
				}

				moveset.push(moveId);
			}
		}

		return moveset;
	}

	function queenMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const directions = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1],
		];

		for (const [fileOffset, rankOffset] of directions) {
			for (let i = 1; i <= 8; i++) {
				const newFile = String.fromCharCode(file + fileOffset * i);
				const newRank = rank + rankOffset * i;
				if (
					newFile < "a" ||
					newFile > "h" ||
					newRank < 1 ||
					newRank > 8
				)
					break;

				const moveId = newFile + newRank;
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (moveSquare.childNodes.length > 0) {
					const childNode = moveSquare.childNodes[0];
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Bpiece")
					) {
						break;
					}
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Wpiece")
					) {
						moveset.push(moveId);
						break;
					}
				}

				moveset.push(moveId);
			}
		}

		return moveset;
	}

	function rookMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const directions = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		];

		for (const [fileOffset, rankOffset] of directions) {
			for (let i = 1; i <= 8; i++) {
				const newFile = String.fromCharCode(file + fileOffset * i);
				const newRank = rank + rankOffset * i;
				if (
					newFile < "a" ||
					newFile > "h" ||
					newRank < 1 ||
					newRank > 8
				)
					break;

				const moveId = newFile + newRank;
				const moveSquare = document.querySelector(
					`[square-id="${moveId}"]`,
				);
				if (moveSquare.childNodes.length > 0) {
					const childNode = moveSquare.childNodes[0];
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Bpiece")
					) {
						break;
					}
					if (
						childNode &&
						childNode.classList &&
						childNode.classList.contains("Wpiece")
					) {
						moveset.push(moveId);
						break;
					}
				}

				moveset.push(moveId);
			}
		}

		return moveset;
	}

	function kingMoves(pos) {
		const file = pos[0].charCodeAt(0);
		const rank = parseInt(pos[1]);
		const moveset = [];
		const directions = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1],
		];
		const shortCastleDir = [
			[-1, 0],
			[-2, 0],
		];
		const longCastleDir = [
			[1, 0],
			[2, 0],
			[3, 0],
		];
		for (const [fileOffset, rankOffset] of directions) {
			const newFile = String.fromCharCode(file + fileOffset);
			const newRank = rank + rankOffset;
			const moveId = newFile + newRank;
			const moveSquare = document.querySelector(
				`[square-id="${moveId}"]`,
			);
			if (moveSquare && moveSquare.childNodes.length > 0) {
				const childNode = moveSquare.childNodes[0];
				if (
					childNode &&
					childNode.classList &&
					childNode.classList.contains("Bpiece")
				) {
					continue;
				}
			}
			moveset.push(moveId);
		}
		if (isKingMoved) {
			return moveset;
		}
		if (!isSrookMoved) {
			let isShortCastle = checkShortCastle(file, rank, shortCastleDir);
			if (isShortCastle) {
				moveset.push("b1");
			}
		}
		if (!isLrookMoved) {
			let isLongCastle = checkLongCastle(file, rank, longCastleDir);
			if (isLongCastle) {
				moveset.push("f1");
			}
		}
		return moveset;
	}

	function checkShortCastle(file, rank, shortCastleDir) {
		let boolean = 1;

		for (const [fileOffset, rankOffset] of shortCastleDir) {
			const newFile = String.fromCharCode(file + fileOffset);
			const newRank = rank + rankOffset;
			const moveId = newFile + newRank;
			const moveSquare = document.querySelector(
				`[square-id="${moveId}"]`,
			);

			if (moveSquare && moveSquare.childNodes.length > 0) {
				const childNode = moveSquare.childNodes[0];
				if (
					childNode &&
					childNode.classList &&
					childNode.classList.contains("Bpiece")
				) {
					boolean = 0;
					break;
				}
			}
		}

		return boolean;
	}

	function checkLongCastle(file, rank, longCastleDir) {
		let boolean = 1;

		for (const [fileOffset, rankOffset] of longCastleDir) {
			const newFile = String.fromCharCode(file + fileOffset);
			const newRank = rank + rankOffset;
			const moveId = newFile + newRank;
			const moveSquare = document.querySelector(
				`[square-id="${moveId}"]`,
			);

			if (moveSquare && moveSquare.childNodes.length > 0) {
				const childNode = moveSquare.childNodes[0];
				if (
					childNode &&
					childNode.classList &&
					childNode.classList.contains("Bpiece")
				) {
					boolean = 0;
					break;
				}
			}
		}

		return boolean;
	}
	return {
        getHint,
		resetBoard,
        createBoard,
		addEventListeners,
		dragStart,
		dragOver,
		dragDrop,
		dragEnd,
		getInfo,
		getPossibleMoves,
		captureHighlight,
		fillColour,
		removeColour,
		pawnMoves,
		knightMoves,
		bishopMoves,
		queenMoves,
		rookMoves,
		kingMoves,
		checkShortCastle,
		checkLongCastle,
	};
})();

export { whiteChessUtilities };
export { blackChessUtilities };
