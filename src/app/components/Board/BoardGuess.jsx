import { useState, useRef, useEffect } from "react";
import { squareCoordinates } from "@/app/utils/squarecoordinates";
import { PIECE_MAPPINGS } from "@/app/constants/pieces";
import { BoardBackground } from "./BoardBackground";
import { SquareHighlight } from "./SquareHighlight";
import { cooridinatesToSquare } from "@/app/utils/squarecoordinates";
import { Piece } from "./Piece";
import { parseFen } from "@/app/utils/fen_parser";

const Board = ({
    fen,
    showCoordinates = false,
    boardFlipped,
    onSquareSelect,
    square
}) => {
    const boardRef = useRef(null);
    const containerRef = useRef(null);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [boardSize, setBoardSize] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        const updateBoardSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setBoardSize(containerWidth);
            }
        };

        // Initial size calculation
        updateBoardSize();

        // Add resize listener
        const resizeObserver = new ResizeObserver(updateBoardSize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Cleanup
        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    const squareSize = boardSize / 8;

    const calculateSquareFromClick = (event) => {
        const board = boardRef.current;
        const boardRect = board.getBoundingClientRect();
        const relativeX = event.clientX - boardRect.left;
        const relativeY = event.clientY - boardRect.top;
        return cooridinatesToSquare(relativeX, relativeY, squareSize, boardFlipped);
    };

    const handleSquareClick = (event) => {
        if (isCorrect !== null) return;
        const clickedSquare = calculateSquareFromClick(event);
        setSelectedSquare(clickedSquare);
        const correct = clickedSquare === square;
        setIsCorrect(correct);
        onSquareSelect(correct);
    };

    return (
        <div ref={containerRef} className="w-full">
            <div
                className="relative aspect-square"
                onClick={handleSquareClick}
            >
                <BoardBackground
                    ref={boardRef}
                    showCoordinates={showCoordinates}
                    boardFlipped={boardFlipped}
                />
                {selectedSquare && (
                    <ChoiceHighlight
                        isCorrect={isCorrect}
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

const ChoiceHighlight = ({ square, squareSize, boardFlipped, isCorrect }) => {
    const { top, left } = squareCoordinates(square, squareSize, boardFlipped);

    const highlightClass = isCorrect
        ? "shadow-[inset_0px_30px_60px_-12px_rgba(20,250,93,0.25),inset_10px_36px_36px_-18px_rgba(20,250,0,0.4)]"
        : "shadow-[inset_0px_30px_60px_-12px_rgba(255,50,93,0.25),inset_10px_36px_36px_-18px_rgba(250,0,0,0.4)]";

    return (
        <div
            className={`flex justify-center items-center absolute ${highlightClass}`}
            style={{
                top,
                left,
                height: squareSize,
                width: squareSize
            }}
        >
            {square}
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
