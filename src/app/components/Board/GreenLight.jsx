import { squareCoordinates } from "@/app/utils/squarecoordinates";

export const GreenLight = ({ square, squareSize, boardFlipped }) => {
    const { top, left } = squareCoordinates(square, squareSize, boardFlipped);

    return (
        <div
            className="absolute flex justify-center items-center"
            style={{
                top,
                left,
                height: squareSize,
                width: squareSize
            }}
        >
            <div
                className=" bg-green-500 rounded-full"
                style={{
                    height: squareSize / 4,
                    width: squareSize / 4
                }}
            >
            </div>
        </div>
    );
};