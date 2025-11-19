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
import { HoveredSquare } from "./HoveredSquare";
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
  revertOnWrongMove = false,
  isPuzzleComplete = false,
}) => {
  // State
  const [fen, setFen] = useState(fen_);
  const [isStarted, setIsStarted] = useState(false);
  const [showPromotion, setShowPromotion] = useState(null);
  const [boardSize, setBoardSize] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [lastSelectedFromSquare, setLastSelectedFromSquare] = useState(null);
  const [lastSelectedToSquare, setLastSelectedToSquare] = useState(null);
  const [hoveredSquare, setHoveredSquare] = useState(null);

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

  const handleMouseMove = (e) => {
    if (isPuzzleComplete) return;
    const parent = boardRef.current;
    if (parent?.contains(e.target)) {
      const square = calculateSquareFromClick(e);
      if (square !== hoveredSquare) {
        setHoveredSquare(square);
      }
    } else {
      setHoveredSquare(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSquare(null);
  };

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
      // This function only validates the move without changing the main state.
      // A temporary instance is used for validation.
      const tempChess = new Chess(chessValidator.current.fen());
      return !!tempChess.move(move);
    } catch (err) {
      return false; // Invalid move format
    }
  };

  const movePiece = (from, to, isUser = true, promotion) => {
    const moveObject = { from, to };
    if (promotion) {
      moveObject.promotion = promotion;
    }
    const moveStrWithPromotion = from + to + (promotion || "");
    const puzzleMove = moves[0];

    // --- Engine moves (always correct) ---
    if (!isUser) {
      chessValidator.current.move(puzzleMove);
      const allPiecesImg =
        PieceImagesContainer.current.getElementsByTagName("img");
      const pieceToMove = Array.from(allPiecesImg).find(
        (img) => img.alt === from
      );
      if (pieceToMove) {
        const toSquare = puzzleMove.slice(2, 4);
        const { top, left } = squareCoordinates(
          toSquare,
          squareSize,
          boardFlipped
        );
        const pieceSizeOffset = (squareSize - pieceToMove.width) / 2;
        playMoveSound();
        pieceToMove.style.top = `${top + pieceSizeOffset}px`;
        pieceToMove.style.left = `${left + pieceSizeOffset}px`;
        pieceToMove.alt = toSquare;
      }
      setTimeout(() => setFen(chessValidator.current.fen()), 300);
      return;
    }

    // --- User moves ---
    const isCorrect = puzzleMove === moveStrWithPromotion;

    // For mix-tactics, we don't animate incorrect moves.
    if (revertOnWrongMove) {
      if (!triggerMove(moveObject)) {
        solveChecker("invalid_move");
        setSelectedSquare(null);
        return;
      }
      if (!isCorrect) {
        solveChecker("wrong_move");
        setSelectedSquare(null);
        return; // No animation for incorrect moves.
      }
    }

    // --- Correct user move (or other games) ---
    const moveResult = chessValidator.current.move(moveObject);
    if (!moveResult) {
      // This should not happen if puzzle data is correct
      solveChecker("invalid_move");
      setSelectedSquare(null);
      return;
    }
    
    // Animate
    const allPiecesImg =
      PieceImagesContainer.current.getElementsByTagName("img");
    const pieceToMove = Array.from(allPiecesImg).find(
      (img) => img.alt === from
    );
    if (pieceToMove) {
      const { top, left } = squareCoordinates(to, squareSize, boardFlipped);
      const pieceSizeOffset = (squareSize - pieceToMove.width) / 2;
      playMoveSound();
      pieceToMove.style.top = `${top + pieceSizeOffset}px`;
      pieceToMove.style.left = `${left + pieceSizeOffset}px`;
      pieceToMove.alt = to;
    }

    setTimeout(() => setFen(chessValidator.current.fen()), 300);
    solveChecker("correct_move");
    moves.shift();

    if (moves.length === 0) {
      solveChecker("game_won");
    } else {
      setTimeout(moveContinue, 1000);
    }
    setSelectedSquare(null);
  };

  const handleSquareClick = (event) => {
    if (isPuzzleComplete || showPromotion) {
      return;
    }
    const clickedSquare = calculateSquareFromClick(event);
    
    if (selectedSquare) {
      if (selectedSquare === clickedSquare) {
        setSelectedSquare(null); // Deselect
        return;
      }

      const allPiecesImg = PieceImagesContainer.current.getElementsByTagName("img");
      const pieceToMove = Array.from(allPiecesImg).find(
        (img) => img.alt === selectedSquare
      );
      const pieceIdentity = pieceToMove?.getAttribute("pieceinfo");

      // Check for promotion
      if (
        pieceIdentity &&
        ((pieceIdentity === "P" && clickedSquare[1] === "8") ||
          (pieceIdentity === "p" && clickedSquare[1] === "1"))
      ) {
          const tempChess = new Chess(chessValidator.current.fen());
          if (tempChess.move({ from: selectedSquare, to: clickedSquare, promotion: "q" })) {
            setShowPromotion(pieceIdentity === "P" ? "white" : "black");
            setLastSelectedToSquare(clickedSquare);
            return;
          }
      }
      
      // Regular move
      movePiece(selectedSquare, clickedSquare, true);
      setLastSelectedToSquare(clickedSquare);

    } else {
      // Attempting to select a piece
      const pieceOnSquare = PieceImagesContainer.current && Array.from(
        PieceImagesContainer.current.getElementsByTagName("img")
      ).find((img) => img.alt === clickedSquare);

      if (!pieceOnSquare) return; // Clicked on empty square

      const pieceInfo = pieceOnSquare.getAttribute("pieceinfo");
      const isBlackPiece = pieceInfo.charCodeAt(0) > 96;
      const isWhitePiece = !isBlackPiece;
      const isBlackTurn = boardFlipped;
      const isWhiteTurn = !boardFlipped;

      if ((isWhiteTurn && isWhitePiece) || (isBlackTurn && isBlackPiece)) {
        setSelectedSquare(clickedSquare);
        setLastSelectedFromSquare(clickedSquare);
      }
    }
  };

  const handlePromotionCompleted = (promotedPiece) => {
    const from = lastSelectedFromSquare;
    const to = lastSelectedToSquare;
    
    movePiece(from, to, true, promotedPiece.toLowerCase());
    
    setShowPromotion(null);
  };

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="relative aspect-square"
        onClick={handleSquareClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
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

        <HoveredSquare
          square={hoveredSquare}
          squareSize={squareSize}
          boardFlipped={boardFlipped}
          pieceSelected={!!selectedSquare}
        />

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
        {isPuzzleComplete && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/60">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">Puzzle Complete!</p>
            </div>
          </div>
        )}
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
