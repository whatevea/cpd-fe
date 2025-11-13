import { PuzzleBoard } from "./components/PuzzleBoard";
import { PuzzleDetailsPanel } from "./components/PuzzleDetailsPanel";
import { PuzzleHeader } from "./components/PuzzleHeader";
import { getGameConfig } from "@/app/constants/gameConfig";
import { usePageMetadata } from "@/app/hooks/usePageMetadata";
import GamePageLayout from "@/app/components/Layout/GamePageLayout";
import { usePuzzleGame } from "./hooks/usePuzzleGame";

const game = getGameConfig("mix-tactics");

export default function MixTacticsPage() {
  const { boardProps, dialogue, isLoading, rawPuzzle, actions } =
    usePuzzleGame();

  usePageMetadata({
    title: game.title,
    description: game.metaDescription,
  });

  if (!boardProps.fen || !boardProps.moves) {
    return (
      <GamePageLayout title={game.title} description={game.metaDescription}>
        <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-[#2f3b56] bg-[#0b1220] text-white">
          Preparing {game.title} puzzles…
        </div>
      </GamePageLayout>
    );
  }

  return (
    <GamePageLayout title={game.title} description={game.metaDescription}>
      <div className="space-y-6">
        <PuzzleHeader
          turn={boardProps.turn}
          isSoundEnabled={boardProps.isSoundEnabled}
          onSoundToggle={actions.toggleSound}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <PuzzleBoard
            {...boardProps}
            iteration={boardProps.iteration}
            isLoading={isLoading}
          />
          <PuzzleDetailsPanel
            dialogue={dialogue}
            rawPuzzle={rawPuzzle}
            onReset={actions.resetPuzzle}
            onNext={actions.loadNextPuzzle}
          />
        </div>
      </div>
    </GamePageLayout>
  );
}
