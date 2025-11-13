import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { cooridinatesToSquare } from "@/app/utils/squarecoordinates";
import { parseFen } from "@/app/utils/fen_parser";
import { BoardBackground } from "@/app/components/Board/BoardBackground";
import { Piece } from "@/app/components/Board/Piece";
import { SquareHighlight } from "@/app/components/Board/SquareHighlight";

const BlindfoldBoard = ({
  fen_,
  showCoordinates = false,
  boardFlipped = false,
  moves = [],
  solveChecker,
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [boardSize, setBoardSize] = useState(0);
  const [fen, setFen] = useState(fen_);
  const [selectedSquare, setSelectedSquare] = useState(null);

  // Refs
  const containerRef = useRef(null);
  const boardRef = useRef(null);
  const chessValidator = useRef(new Chess(fen_));
  const moveSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/media/movesound.mp3") : null
  );
  const movesRef = useRef([...moves]);

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

  useEffect(() => {
    setFen(fen_);
    movesRef.current = [...moves];
    chessValidator.current = new Chess(fen_);
    setIsStarted(false);
    setSelectedSquare(null);
  }, [fen_, moves]);

  useEffect(() => {
    if (boardSize > 0 && !isStarted) {
      moveContinue(true);
      setIsStarted(true);
    }
  }, [boardSize, isStarted]);

  // Helper functions
  const playMoveSound = () => {
    if (moveSound.current) {
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

  const moveContinue = (isFirst, moveInPgn) => {
    const solution = movesRef.current.shift();
    if (!solution) {
      return;
    }
    const move = chessValidator.current.move(solution).san;
    if (isFirst) {
      solveChecker("opponent_move", null, move);
    } else {
      solveChecker("opponent_move", moveInPgn, move);
    }
  };

  const checkIfSolved = (lastMove) => {

    if (movesRef.current[0] === lastMove) {
      const moveInPgn = chessValidator.current.move(lastMove).san;
      movesRef.current.shift();
      if (movesRef.current.length === 0) {
        solveChecker("game_won", moveInPgn);
        setFen(chessValidator.current.fen());
      } else {
        moveContinue(false, moveInPgn);
      }
    } else {
      solveChecker("wrong_move");
    }
  };

  const handleSquareClick = (event) => {
    const clickedSquare = calculateSquareFromClick(event);

    // If a piece was previously selected
    if (selectedSquare) {
      if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
        return;
      }
      // Try to move to new square
      checkIfSolved(`${selectedSquare}${clickedSquare}`);
      setSelectedSquare(null);
    } else {
      // Select the piece
      setSelectedSquare(clickedSquare);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative aspect-square" onClick={handleSquareClick}>
        <BoardBackground
          ref={boardRef}
          showCoordinates={showCoordinates}
          boardFlipped={boardFlipped}
        />

        {selectedSquare && (
          <SquareHighlight
            square={selectedSquare}
            squareSize={squareSize}
            boardFlipped={boardFlipped}
          />
        )}

        <ChessPieces
          fen={fen}
          cellSize={squareSize}
          pieceSize={squareSize - 10}
          boardFlipped={boardFlipped}
        />
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

export default BlindfoldBoard;
