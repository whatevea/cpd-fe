import { useCallback, useEffect, useRef, useState } from "react";
import { getRandomPuzzleOfflineNoPromotion } from "@/app/utils/offline_puzzle";

const SOUND_EFFECTS = {
  wrong: "/media/wrong.wav",
  invalid: "/media/invalid_move.mp3",
  correct: "/media/right.wav",
  victory: "/media/victory.mp3",
};

const INITIAL_STATUS = {
  message: "Visualize the sequence and announce the winning line.",
  type: "info",
};

export const useBlindfoldPuzzle = () => {
  const [puzzle, setPuzzle] = useState({
    fen: null,
    moves: [],
    raw: null,
  });
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [confirmedMoves, setConfirmedMoves] = useState([]);
  const [ui, setUi] = useState({
    isLoading: true,
    boardFlipped: false,
    isSoundEnabled: true,
    showDetails: false,
    turn: "white",
  });

  const retryRef = useRef(0);
  const isFirstMoveRef = useRef(true);
  const soundRefs = useRef({});

  useEffect(() => {
    if (typeof Audio === "undefined") return;

    soundRefs.current = Object.fromEntries(
      Object.entries(SOUND_EFFECTS).map(([key, src]) => [key, new Audio(src)])
    );

    return () => {
      Object.values(soundRefs.current).forEach((audio) => audio?.pause());
    };
  }, []);

  const playSound = useCallback(
    (soundKey) => {
      if (!ui.isSoundEnabled) return;
      const audio = soundRefs.current[soundKey];
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => { });
    },
    [ui.isSoundEnabled]
  );

  const loadPuzzle = useCallback(async () => {
    setUi((prev) => ({ ...prev, isLoading: true }));
    try {
      const offlinePuzzle = await getRandomPuzzleOfflineNoPromotion();
      if (!offlinePuzzle) {
        throw new Error("No offline puzzle available");
      }

      const moves = offlinePuzzle.Moves.split(" ");
      const turnToPlay =
        offlinePuzzle.FEN?.split(" ")[1] === "w" ? "white" : "black";

      setPuzzle({
        raw: offlinePuzzle,
        fen: offlinePuzzle.FEN,
        moves,
      });

      setConfirmedMoves([]);
      retryRef.current = 0;
      isFirstMoveRef.current = true;
      setUi((prev) => ({
        ...prev,
        isLoading: false,
        turn: turnToPlay,
        boardFlipped: turnToPlay !== "black",
      }));
      setStatus({
        message: "Your opponent just moved. Calculate the refutation.",
        type: "info",
      });
    } catch (error) {
      console.error("Blind puzzle load failed:", error);
      retryRef.current += 1;
      setUi((prev) => ({ ...prev, isLoading: false }));
      setStatus({
        message: "Failed to fetch puzzle. Retrying…",
        type: "error",
      });
      if (retryRef.current <= 20) {
        setTimeout(loadPuzzle, 2000);
      }
    }
  }, []);

  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  const handleSolveEvent = useCallback(
    (eventType, yourMove, opponentMove) => {
      switch (eventType) {
        case "wrong_move":
          playSound("invalid");
          setStatus({
            message:
              "That's not correct. Reconstruct the position and try again.",
            type: "error",
          });
          break;
        case "opponent_move":
          playSound("correct");
          setConfirmedMoves((prev) =>
            isFirstMoveRef.current
              ? [...prev, opponentMove]
              : [...prev, yourMove, opponentMove]
          );
          isFirstMoveRef.current = false;
          setStatus({
            message: `Great! Opponent replies ${opponentMove}. Visualize your next move.`,
            type: "info",
          });
          break;
        case "game_won":
          playSound("victory");
          setConfirmedMoves((prev) => [...prev, yourMove]);
          setStatus({
            message: "Puzzle solved blindfolded! 🎉",
            type: "success",
          });
          break;
        default:
          break;
      }
    },
    [playSound]
  );

  return {
    puzzle,
    status,
    confirmedMoves,
    ui,
    actions: {
      loadPuzzle,
      toggleBoard: () =>
        setUi((prev) => ({ ...prev, boardFlipped: !prev.boardFlipped })),
      toggleSound: () =>
        setUi((prev) => ({ ...prev, isSoundEnabled: !prev.isSoundEnabled })),
      toggleDetails: () =>
        setUi((prev) => ({ ...prev, showDetails: !prev.showDetails })),
      solveChecker: handleSolveEvent,
    },
  };
};

