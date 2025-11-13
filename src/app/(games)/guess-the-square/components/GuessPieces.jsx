import { parseFen } from "@/app/utils/fen_parser";
import { Piece } from "@/app/components/Board/Piece";

const GuessPieces = ({ fen, squareSize, boardFlipped }) => {
  if (!squareSize) return null;

  const positions = parseFen(fen);
  const pieceSize = squareSize - 10;

  return (
    <div className="pointer-events-none">
      {Object.entries(positions).map(([square, piece]) => (
        <Piece
          key={`${piece}-${square}`}
          piece={piece}
          square={square}
          pieceSize={pieceSize}
          cellSize={squareSize}
          boardFlipped={boardFlipped}
        />
      ))}
    </div>
  );
};

export default GuessPieces;

