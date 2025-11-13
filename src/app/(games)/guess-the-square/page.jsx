import { useEffect, useRef, useState } from "react";
import { getGameConfig } from "@/app/constants/gameConfig";
import { usePageMetadata } from "@/app/hooks/usePageMetadata";
import GamePageLayout from "@/app/components/Layout/GamePageLayout";
import GuessBoard from "./components/GuessBoard";
import { StatsPanel } from "./components/StatsPanel";
import { GameOverModal } from "./components/GameOverModal";
import { useGuessTrainer } from "./hooks/useGuessTrainer";

const TRAINING_FEN = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";
const game = getGameConfig("guess-the-square");

const GuessTheSquarePage = () => {
  const {
    state: {
      score,
      mistakes,
      correct,
      isGameOver,
      square,
      boardFlipped,
      soundEnabled,
      timeLeft,
    },
    actions,
  } = useGuessTrainer();

  const boardWrapperRef = useRef(null);
  const [boardSize, setBoardSize] = useState(0);

  usePageMetadata({
    title: game.title,
    description: game.metaDescription,
  });

  useEffect(() => {
    if (!boardWrapperRef.current) return undefined;

    const updateSize = () => {
      if (boardWrapperRef.current) {
        setBoardSize(
          boardWrapperRef.current.getBoundingClientRect().width
        );
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(boardWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <GamePageLayout title={game.title} description={game.metaDescription}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative rounded-2xl border border-[#2f3b56] bg-gradient-to-b from-[#141b32] to-[#080d1f] p-5">
          {isGameOver && (
            <GameOverModal
              score={score}
              correct={correct}
              mistakes={mistakes}
              onReset={actions.resetGame}
            />
          )}

          <div ref={boardWrapperRef} className="mx-auto w-full max-w-[640px]">
            <GuessBoard
              boardSize={boardSize}
              boardFlipped={boardFlipped}
              fen={TRAINING_FEN}
              isDisabled={isGameOver}
              onSquareSelect={actions.handleSquareSelect}
              targetSquare={square}
            />
          </div>
        </div>

        <StatsPanel
          timeLeft={timeLeft}
          score={score}
          soundEnabled={soundEnabled}
          onToggleSound={actions.toggleSound}
          boardFlipped={boardFlipped}
          onToggleBoard={actions.toggleBoard}
        />
      </div>
    </GamePageLayout>
  );
};

export default GuessTheSquarePage;
