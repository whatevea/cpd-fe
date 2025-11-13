import { useState, useRef, useEffect } from "react";
import {
  squareCoordinates,
  cooridinatesToSquare,
} from "@/app/utils/squarecoordinates";
import { parseFen } from "../../utils/fen_parser";
import { BoardBackground } from "./BoardBackground";
import { Piece } from "./Piece";
import { CheckLight } from "./CheckLight";
import { GreenLight } from "./GreenLight";
import { SquareHighlight } from "./SquareHighlight";
import { PromotionDialog } from "./PromotionDialog";
import { Chess } from "chess.js";

const Board = ({
  fen_,
  showCoordinates = false,
  boardFlipped,
  checkLight,
  greenLight,
  moves,
  solveChecker,
  isSoundEnabled,
}) => {
  // State
  const [fen, setFen] = useState(fen_);
  const [isStarted, setIsStarted] = useState(false);
  const [showPromotion, setShowPromotion] = useState(null);
  const [boardSize, setBoardSize] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [lastSelectedFromSquare, setLastSelectedFromSquare] = useState(null);
  const [lastSelectedToSquare, setLastSelectedToSquare] = useState(null);

  // Refs
  const containerRef = useRef(null);
  const boardRef = useRef(null);
  const PieceImagesContainer = useRef(null);
  const chessValidator = useRef(new Chess(fen));
  const moveSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/media/movesound.mp3") : null
  );

  // Derived values
  const squareSize = boardSize / 8;

  // Board size management
  useEffect(() => {
    const updateBoardSize = () => {
      if (containerRef.current) {
        setBoardSize(containerRef.current.offsetWidth);
      }
    };

    updateBoardSize();
    const resizeObserver = new ResizeObserver(updateBoardSize);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Initial move for puzzle
  useEffect(() => {
    if (boardSize > 0 && !isStarted) {
      const timer = setTimeout(moveContinue, 1000);
      setIsStarted(true);
      return () => clearTimeout(timer);
    }
  }, [boardSize]);

  // Helper functions
  const playMoveSound = () => {
    if (moveSound.current && isSoundEnabled) {
      moveSound.current
        .play()
        .catch((e) => console.log("Couldn't play sound:", e));
    }
  };

  const calculateSquareFromClick = (event) => {
    const board = boardRef.current;
    const boardRect = board.getBoundingClientRect();
    const relativeX = event.clientX - boardRect.left;
    const relativeY = event.clientY - boardRect.top;
    return cooridinatesToSquare(relativeX, relativeY, squareSize, boardFlipped);
  };

  const moveContinue = () => {
    if (!moves.length) return;

    const move = moves[0];
    const from = move.slice(0, 2);
    const to = move.slice(2);
    movePiece(from, to, false);
    moves.shift();
  };

  const triggerMove = (move) => {
    try {
      chessValidator.current.move(move);
      setTimeout(() => setFen(chessValidator.current.fen()), 500);
      return true;
    } catch (err) {
      console.log("Invalid move:", err);
      return false;
    }
  };

  const checkIfSolved = (lastMove) => {
    if (moves[0] === lastMove) {
      solveChecker("correct_move");
      moves.shift();

      if (moves.length === 0) {
        solveChecker("game_won");
      } else {
        setTimeout(moveContinue, 1000);
      }
    } else {
      solveChecker("wrong_move");
    }
  };

  const movePiece = (from, to, isUser = true) => {
    const allPiecesImg =
      PieceImagesContainer.current.getElementsByTagName("img");
    const pieceToMove = Array.from(allPiecesImg).find(
      (img) => img.alt === from
    );
    if (!pieceToMove) {
      return;
    }
    const pieceIdentity = pieceToMove.getAttribute("pieceinfo");
    if (
      isUser &&
      ((pieceIdentity === "P" &&
        to[1] === "8" &&
        +lastSelectedFromSquare[1] === 7) ||
        (pieceIdentity === "p" &&
          to[1] === "1" &&
          +lastSelectedFromSquare[1] === 2))
    ) {
      setShowPromotion(pieceIdentity === "P" ? "white" : "black");
      return;
    }

    if (!triggerMove(`${from}${to}`)) {
      solveChecker("invalid_move");
      return;
    }

    // Move animation
    const { top, left } = squareCoordinates(to, squareSize, boardFlipped);
    const pieceSizeOffset = (squareSize - pieceToMove.width) / 2;
    playMoveSound();
    pieceToMove.style.top = `${top + pieceSizeOffset}px`;
    pieceToMove.style.left = `${left + pieceSizeOffset}px`;
    pieceToMove.alt = to;

    if (isUser) {
      checkIfSolved(`${from}${to}`);
    }
  };

  const handleSquareClick = (event) => {
    const clickedSquare = calculateSquareFromClick(event);
    const allPiecesImg =
      PieceImagesContainer.current.getElementsByTagName("img");
    const pieceToMove = Array.from(allPiecesImg).find(
      (img) => img.alt === clickedSquare
    );

    // If no piece is found at clicked square
    if (!pieceToMove) {
      // If a piece was previously selected, try to move to empty square
      if (selectedSquare) {
        movePiece(selectedSquare, clickedSquare);
        setSelectedSquare(null);
        setLastSelectedToSquare(clickedSquare);
      }
      return;
    }

    // Don't allow moves during promotion selection
    if (showPromotion) {
      return;
    }

    const pieceInfo = pieceToMove.getAttribute("pieceinfo");
    // Check if piece belongs to current player's turn
    // boardFlipped = true if it is black's turn
    if (
      (!selectedSquare && pieceInfo.charCodeAt(0) > 96 && !boardFlipped) ||
      (!selectedSquare && pieceInfo.charCodeAt(0) < 96 && boardFlipped)
    ) {
      return;
    }

    // If a piece was previously selected
    if (selectedSquare) {
      // If clicking same square, deselect
      if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
        return;
      }
      // Try to move to new square
      movePiece(selectedSquare, clickedSquare);
      setSelectedSquare(null);
      setLastSelectedToSquare(clickedSquare);
    } else {
      // Select the piece
      setSelectedSquare(clickedSquare);
      setLastSelectedFromSquare(clickedSquare);
    }
  };
  const handlePromotionCompleted = (promotedPiece) => {
    const from = lastSelectedFromSquare;
    const to = lastSelectedToSquare;
    const move = from + to + promotedPiece.toLowerCase();
    if (!triggerMove(move)) {
      solveChecker("invalid_move");
      return;
    }
    checkIfSolved(move);
    setShowPromotion(null);
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative aspect-square" onClick={handleSquareClick}>
        <BoardBackground
          ref={boardRef}
          showCoordinates={showCoordinates}
          boardFlipped={boardFlipped}
        />

        {showPromotion && (
          <PromotionDialog
            color={showPromotion}
            onPromotionCompleted={handlePromotionCompleted}
          />
        )}

        {selectedSquare && (
          <SquareHighlight
            square={selectedSquare}
            squareSize={squareSize}
            boardFlipped={boardFlipped}
          />
        )}

        {checkLight && (
          <CheckLight
            square={checkLight}
            squareSize={squareSize}
            boardFlipped={boardFlipped}
          />
        )}

        {greenLight?.map((item, index) => (
          <GreenLight
            key={index}
            boardFlipped={boardFlipped}
            squareSize={squareSize}
            square={item}
          />
        ))}

        <div ref={PieceImagesContainer}>
          <ChessPieces
            fen={fen}
            cellSize={squareSize}
            pieceSize={squareSize - 10}
            boardFlipped={boardFlipped}
          />
        </div>
      </div>
    </div>
  );
};

const ChessPieces = ({ fen, cellSize, pieceSize, boardFlipped }) => {
  const piecePositions = parseFen(fen);
  return Object.entries(piecePositions).map(([square, piece]) => (
    <Piece
      key={square}
      piece={piece}
      square={square}
      pieceSize={pieceSize}
      cellSize={cellSize}
      boardFlipped={boardFlipped}
    />
  ));
};

export default Board;
