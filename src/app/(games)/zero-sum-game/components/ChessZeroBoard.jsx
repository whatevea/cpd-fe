import { useState, useEffect, useRef } from "react";
import { NumberedSquare } from "./NumberedSquare";
import { PIECE_MAPPINGS } from "@/app/constants/pieces";

export const ChessZeroBoard = ({
  lightSquareColor = "#F0D9B5",
  darkSquareColor = "#B58863",
  size = "100%",
  boardFlipped = false,
  numberedSquares = {},
  placePiece,
  boardPieces,
  boardLocked,
  targetBoard,
}) => {
  const [boardSize, setBoardSize] = useState(0);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const containerRef = useRef(null);

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

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  if (boardFlipped) {
    files.reverse();
    ranks.reverse();
  }

  const squareSize = boardSize / 8;

  const clickedSquare = (square) => {
    if (showPromotionDialog) {
      setShowPromotionDialog(false);
      return;
    }
    setSelectedSquare(square);
    setShowPromotionDialog(true);
  };

  const handlePromotion = (piece) => {
    placePiece(selectedSquare, piece);
    setShowPromotionDialog(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg p-2"
      style={{ width: size, height: boardSize, aspectRatio: "1/1" }}
    >
      {boardLocked && (
        <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[1px]" />
      )}
      {ranks.map((rank, rankIndex) =>
        files.map((file, fileIndex) => {
          const isLight = (rankIndex + fileIndex) % 2 === 0;
          const square = `${file}${rank}`;
          const number = numberedSquares[square];
          const pieceOnSquare = boardPieces[square];
          return (
            <div
              key={square}
              className={`absolute cursor-pointer transition-all hover:brightness-125 ${
                boardLocked ? "pointer-events-none opacity-70" : ""
              }`}
              onClick={() => {
                if (!targetBoard[square]) {
                  clickedSquare(square);
                }
              }}
              style={{
                top: rankIndex * squareSize,
                left: fileIndex * squareSize,
                width: squareSize,
                height: squareSize,
                backgroundColor: isLight ? lightSquareColor : darkSquareColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              data-square={square}
            >
              {number !== undefined && (
                <NumberedSquare number={number} squareSize={squareSize} />
              )}
              {pieceOnSquare !== undefined && (
                <img
                  src={PIECE_MAPPINGS[pieceOnSquare]}
                  className="w-full"
                  alt={pieceOnSquare}
                />
              )}
            </div>
          );
        })
      )}
      {showPromotionDialog && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-3 flex gap-2">
            {["Q", "R", "B", "N", "K"].map((piece) => (
              <img
                key={piece}
                src={PIECE_MAPPINGS[piece]}
                alt={piece}
                className="w-12 h-12 cursor-pointer hover:bg-gray-100 rounded p-1"
                onClick={() => handlePromotion(piece)}
              />
            ))}
            <img
              src={PIECE_MAPPINGS["Trash"]}
              alt="Remove"
              className="w-12 h-12 cursor-pointer hover:bg-gray-100 rounded p-1"
              onClick={() => handlePromotion("Remove")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessZeroBoard;
