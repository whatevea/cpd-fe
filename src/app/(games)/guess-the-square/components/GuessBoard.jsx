import { useRef, useState } from "react";
import { cooridinatesToSquare, squareCoordinates } from "@/app/utils/squarecoordinates";
import GuessPieces from "./GuessPieces";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

const GuessBoard = ({
  boardSize,
  boardFlipped,
  onSquareSelect,
  fen,
  isDisabled,
  targetSquare,
}) => {
  const boardRef = useRef(null);
  const [selection, setSelection] = useState({ square: null, correct: null });
  const squareSize = boardSize / 8 || 0;

  const handleSquareClick = (event) => {
    if (!boardRef.current || isDisabled || !squareSize) return;
    const rect = boardRef.current.getBoundingClientRect();
    const clickedSquare = cooridinatesToSquare(
      event.clientX - rect.left,
      event.clientY - rect.top,
      squareSize,
      boardFlipped
    );
    const isCorrect = onSquareSelect(clickedSquare);
    setSelection({ square: clickedSquare, correct: isCorrect });
    setTimeout(() => setSelection({ square: null, correct: null }), 400);
  };

  const orientedFiles = boardFlipped ? [...files].reverse() : files;
  const orientedRanks = boardFlipped ? [...ranks].reverse() : ranks;

  const centeredTarget = targetSquare?.toUpperCase();

  return (
    <div className="relative aspect-square rounded-xl shadow-lg">
      <div
        ref={boardRef}
        onClick={handleSquareClick}
        className={`absolute inset-0 grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden ${
          isDisabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {orientedRanks.map((rank, rowIndex) =>
          orientedFiles.map((file, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const square = `${file}${rank}`;
            return (
              <div
                key={`${file}${rank}`}
                className={`relative ${
                  isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"
                }`}
                data-square={square}
              />
            );
          })
        )}
      </div>
      {selection.square && (
        <SquareHighlight
          square={selection.square}
          squareSize={squareSize}
          boardFlipped={boardFlipped}
          isCorrect={selection.correct}
        />
      )}
      <GuessPieces fen={fen} squareSize={squareSize} boardFlipped={boardFlipped} />
      {centeredTarget && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#8ee1b7] bg-[#0b1220]/80 px-5 py-3 text-xl font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          {centeredTarget}
        </div>
      )}
    </div>
  );
};

const SquareHighlight = ({ square, squareSize, boardFlipped, isCorrect }) => {
  const { top, left } = squareCoordinates(square, squareSize, boardFlipped);
  const style = {
    top,
    left,
    width: squareSize,
    height: squareSize,
  };

  const highlight =
    isCorrect === null
      ? "border-2 border-white"
      : isCorrect
      ? "border-2 border-green-500 bg-green-400/20"
      : "border-2 border-red-500 bg-red-400/30";

  return (
    <div
      className={`pointer-events-none absolute flex items-center justify-center text-sm font-semibold ${highlight}`}
      style={style}
    >
      {square}
    </div>
  );
};

export default GuessBoard;
