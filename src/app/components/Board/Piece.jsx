import { PIECE_MAPPINGS } from "@/app/constants/pieces";
import { squareCoordinates } from "@/app/utils/squarecoordinates";

export const Piece = ({ piece, square, pieceSize, cellSize, boardFlipped }) => {
    const pieceSizeOffset = (cellSize - pieceSize) / 2;
    const { top, left } = squareCoordinates(square, cellSize, boardFlipped);

    return (
        <img
            src={PIECE_MAPPINGS[piece]}
            width={pieceSize}
            height={pieceSize}
            className="transition-all duration-500"
            style={{
                position: "absolute",
                top: top + pieceSizeOffset,
                left: left + pieceSizeOffset
            }}
            alt={`${square}`}
            pieceinfo={piece}
        />
    )
}
