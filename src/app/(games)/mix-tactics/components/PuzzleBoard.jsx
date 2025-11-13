import Board from "@/app/components/Board/Board";

export const PuzzleBoard = ({
  isLoading,
  fen,
  moves,
  iteration,
  turn,
  isShaking,
  isSoundEnabled,
  solveChecker,
}) => (
  <section
    className={`w-full rounded-2xl border border-[#2f3b56] bg-gradient-to-b from-[#141b32] to-[#080d1f] p-5 transition-transform ${
      isShaking ? "animate-shake" : ""
    }`}
  >
    {isLoading ? (
      <div className="flex h-[440px] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-[#8ee1b7] border-t-transparent" />
      </div>
    ) : (
      fen &&
      moves && (
        <div className="relative mx-auto max-w-[640px]">
          <div className="aspect-square">
            <Board
              key={iteration}
              fen_={fen}
              moves={moves}
              showCoordinates
              boardFlipped={turn !== "White"}
              solveChecker={solveChecker}
              isSoundEnabled={isSoundEnabled}
            />
          </div>
        </div>
      )
    )}
  </section>
);
