export const BoardBackground = ({ ref, showCoordinates, boardFlipped }) => (
    <>
        <img
            src="/media/board.svg"
            className="w-full"
            alt="Chess Board"
            ref={ref}
        />
        {showCoordinates && (
            <>
                <div className="absolute top-0 text-xs font-bold text-black "> {boardFlipped ? "h1" : "a8"}</div>
                <div className="absolute bottom-0 text-xs font-bold text-[#F0D9B5]"> {boardFlipped ? "h8" : "a1"}</div>
                <div className="absolute bottom-0 right-0 text-xs font-bold text-black"> {boardFlipped ? "a8" : "h1"}</div>
                <div className="absolute top-0 right-0 text-xs font-bold text-[#F0D9B5]"> {boardFlipped ? "a1" : "h8"}</div>
            </>
        )}
    </>

);
