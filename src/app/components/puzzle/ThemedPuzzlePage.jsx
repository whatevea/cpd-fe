import { PuzzleBoard } from "@/app/components/puzzle/PuzzleBoard";
import { PuzzleDetailsPanel } from "@/app/components/puzzle/PuzzleDetailsPanel";
import { PuzzleHeader } from "@/app/components/puzzle/PuzzleHeader";
import { getGameConfig } from "@/app/constants/gameConfig";
import { usePageMetadata } from "@/app/hooks/usePageMetadata";
import GamePageLayout from "@/app/components/Layout/GamePageLayout";
import { useThemedPuzzleGame } from "@/app/hooks/useThemedPuzzleGame";

const PuzzleLoadingState = ({ title, description }) => (
  <GamePageLayout title={title} description={description}>
    <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-[#2f3b56] bg-[#0b1220] text-white">
      Preparing {title} puzzles…
    </div>
  </GamePageLayout>
);

export default function ThemedPuzzlePage({ slug, theme }) {
  const game = getGameConfig(slug);
  const { boardProps, dialogue, isLoading, rawPuzzle, actions } =
    useThemedPuzzleGame({ theme });

  usePageMetadata({
    title: game.title,
    description: game.metaDescription,
  });

  if (!boardProps.fen || !boardProps.moves) {
    return (
      <PuzzleLoadingState
        title={game.title}
        description={game.metaDescription}
      />
    );
  }

  return (
    <GamePageLayout title={game.title} description={game.metaDescription}>
      <div className="space-y-6">
        <PuzzleHeader
          title={game.title}
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
