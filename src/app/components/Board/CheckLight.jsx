import { squareCoordinates } from "@/app/utils/squarecoordinates";
export const CheckLight = ({ square, squareSize, boardFlipped }) => {
    const { top, left } = squareCoordinates(square, squareSize, boardFlipped);
    return (
        <div
            className="absolute shadow-[inset_0px_30px_60px_-12px_rgba(255,50,93,0.25),inset_10px_36px_36px_-18px_rgba(250,0,0,0.4)]"
            style={{
                top,
                left,
                height: squareSize,
                width: squareSize
            }}
        />

    );
};
