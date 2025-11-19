import { squareCoordinates } from "@/app/utils/squarecoordinates";

export const HoveredSquare = ({
  square,
  squareSize,
  boardFlipped,
  pieceSelected,
}) => {
  if (!square) {
    return null;
  }
  const { top, left } = squareCoordinates(square, squareSize, boardFlipped);
  const shadowColor = pieceSelected
    ? "rgba(255, 204, 51, 0.8)"
    : "rgba(138, 179, 255, 0.8)";

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        boxShadow: `inset 0 0 3px 2px ${shadowColor}`,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};
