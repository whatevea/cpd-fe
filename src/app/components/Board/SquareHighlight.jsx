import { squareCoordinates } from "@/app/utils/squarecoordinates";
export const SquareHighlight = ({ square, squareSize, boardFlipped }) => {
    const { top, left } = squareCoordinates(square, squareSize, boardFlipped);

    return (
        <div
            className="rounded-md bg-blue-600 absolute"
            style={{
                top,
                left,
                height: squareSize,
                width: squareSize
            }}
        />
    );
};
