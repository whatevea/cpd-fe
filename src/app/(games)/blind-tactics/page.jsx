import { motion } from "framer-motion";
import { getGameConfig } from "@/app/constants/gameConfig";
import { usePageMetadata } from "@/app/hooks/usePageMetadata";
import GamePageLayout from "@/app/components/Layout/GamePageLayout";
import BlindfoldBoard from "./components/BlindfoldBoard";
import BlindfoldMovesTimeline from "./components/BlindfoldMovesTimeline";
import { BlindfoldStatusBar } from "./components/BlindfoldStatusBar";
import { useBlindfoldPuzzle } from "./hooks/useBlindfoldPuzzle";

const game = getGameConfig("blind-tactics");

export default function BlindTacticsPage() {
  const { puzzle, status, confirmedMoves, ui, actions } =
    useBlindfoldPuzzle();

  usePageMetadata({
    title: game.title,
    description: game.metaDescription,
  });

  return (
    <GamePageLayout title={game.title} description={game.metaDescription}>
      <div className="space-y-6">
        <BlindfoldStatusBar
          status={status}
          boardFlipped={ui.boardFlipped}
          onToggleBoard={actions.toggleBoard}
          isSoundEnabled={ui.isSoundEnabled}
          onToggleSound={actions.toggleSound}
          showDetails={ui.showDetails}
          onToggleDetails={actions.toggleDetails}
          currentPuzzle={puzzle.raw}
        />

        {ui.isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-[#2f3b56] bg-[#0b1220]"
          >
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-[#8ee1b7] border-t-transparent" />
            <p className="text-lg text-white">Loading your next challenge…</p>
          </motion.div>
        ) : (
          puzzle.fen &&
          puzzle.moves.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="rounded-2xl border border-[#2f3b56] bg-gradient-to-b from-[#141b32] to-[#080d1f] p-5">
                <div className="mx-auto w-full max-w-[660px]">
                  <BlindfoldBoard
                    showCoordinates
                    fen_={puzzle.fen}
                    moves={puzzle.moves}
                    boardFlipped={ui.boardFlipped}
                    solveChecker={actions.solveChecker}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-4">
                <BlindfoldMovesTimeline
                  totalFields={puzzle.moves.length}
                  indexColor={ui.turn}
                  moves={confirmedMoves}
                />
              </div>
            </div>
          )
        )}

        <motion.div className="flex justify-center" whileHover={{ scale: 1.01 }}>
          <button
            onClick={actions.loadPuzzle}
            disabled={ui.isLoading}
            className="inline-flex min-w-[220px] items-center justify-center border border-[#8ee1b7] bg-[#8ee1b7] px-8 py-3 text-sm font-bold uppercase tracking-[0.3em] text-[#041019] transition disabled:border-white/20 disabled:bg-transparent disabled:text-white/30"
          >
            {ui.isLoading ? "Preparing…" : "New challenge"}
          </button>
        </motion.div>
      </div>
    </GamePageLayout>
  );
}
