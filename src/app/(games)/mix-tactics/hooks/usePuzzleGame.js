import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getRandomPuzzleOffline } from "@/app/utils/offline_puzzle";
import useUserStore from "@/app/storage/userInfo";

const SOUND_ASSETS = {
  wrong: "/media/wrong.wav",
  invalid: "/media/invalid_move.mp3",
  correct: "/media/right.wav",
  victory: "/media/victory.mp3",
};

const HYDRATION_RETRY_LIMIT = 20;

//This inferTurn is reversed because first move is played automatically 
const inferTurn = (fen) => (fen?.split(" ")[1] === "w" ? "Black" : "White");

export const usePuzzleGame = () => {
  const { isAuthenticated } = useUserStore();
  const [puzzle, setPuzzle] = useState({
    raw: null,
    fen: null,
    moves: null,
    turn: null,
  });
  const [dialogue, setDialogue] = useState({
    message: "Loading your first puzzle…",
    tone: "info",
  });
  const [gameIterations, setGameIterations] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  const retryRef = useRef(0);
  const audioMap = useRef({});

  useEffect(() => {
    if (typeof Audio === "undefined") {
      audioMap.current = {};
      return;
    }

    audioMap.current = Object.fromEntries(
      Object.entries(SOUND_ASSETS).map(([key, src]) => [key, new Audio(src)])
    );

    return () => {
      Object.values(audioMap.current).forEach((audio) => audio?.pause());
    };
  }, []);

  const playSound = useCallback(
    (soundKey) => {
      if (!isSoundEnabled) return;
      const audio = audioMap.current[soundKey];
      if (!audio) return;

      audio.currentTime = 0;
      audio.play().catch(() => { });
    },
    [isSoundEnabled]
  );

  const loadPuzzle = useCallback(async () => {
    setIsLoading(true);
    setDialogue({
      message: "Fetching an offline puzzle for you…",
      tone: "info",
    });

    const hydrationReady =
      window.localStorage.getItem("cpd::puzzlesHydrated") === "true";

    try {
      const offlinePuzzle = await getRandomPuzzleOffline();
      if (!offlinePuzzle) {
        const hydrating = !hydrationReady;
        retryRef.current += 1;
        setDialogue({
          message: hydrating
            ? "Preparing puzzles in the background. This only happens once…"
            : "No cached puzzles yet. Retrying…",
          tone: hydrating ? "info" : "error",
        });

        if (retryRef.current <= HYDRATION_RETRY_LIMIT) {
          setTimeout(loadPuzzle, hydrating ? 2000 : 1000);
        }

        return;
      }

      retryRef.current = 0;
      setPuzzle({
        raw: offlinePuzzle,
        fen: offlinePuzzle.FEN,
        moves: offlinePuzzle.Moves.split(" "),
        turn: inferTurn(offlinePuzzle.FEN),
      });

      setDialogue({
        message: isAuthenticated
          ? "Your turn! Make the winning move."
          : "Puzzle ready. Log in to collect rewards.",
        tone: "info",
      });
    } catch (error) {
      console.error("Failed to hydrate puzzle:", error);
      retryRef.current += 1;
      setDialogue({
        message: "Unable to load puzzle. Retrying shortly…",
        tone: "error",
      });

      if (retryRef.current <= HYDRATION_RETRY_LIMIT) {
        setTimeout(loadPuzzle, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  const resetPuzzle = useCallback(() => {
    if (!puzzle.raw) return;

    setPuzzle((prev) => ({
      ...prev,
      fen: prev.raw.FEN,
      moves: prev.raw.Moves.split(" "),
      turn: inferTurn(prev.raw.FEN),



    }));
    setGameIterations((prev) => prev + 1);
    setDialogue({
      message: "Puzzle reset. Visualize and try again!",
      tone: "info",
    });
  }, [puzzle.raw]);

  const loadNextPuzzle = useCallback(() => {
    setGameIterations((prev) => prev + 1);
    loadPuzzle();
  }, [loadPuzzle]);

  const solveChecker = useCallback(
    (result) => {
      switch (result) {
        case "game_won":
          playSound("victory");
          setDialogue({
            message: isAuthenticated
              ? "Nice! Points inbound."
              : "Solved! Sign in to earn rewards.",
            tone: "success",
          });
          break;
        case "correct_move":
          playSound("correct");
          setDialogue({
            message: "Great find! Keep the momentum.",
            tone: "success",
          });
          break;
        case "wrong_move":
          playSound("wrong");
          setIsShaking(true);
          setDialogue({
            message: "Not quite. Resetting the position…",
            tone: "error",
          });
          setTimeout(() => {
            setIsShaking(false);
            resetPuzzle();
          }, 900);
          break;
        case "invalid_move":
          playSound("invalid");
          setIsShaking(true);
          setDialogue({
            message: "Illegal move detected.",
            tone: "error",
          });
          setTimeout(() => setIsShaking(false), 300);
          break;
        default:
          break;
      }
    },
    [isAuthenticated, playSound, resetPuzzle]
  );

  const boardProps = useMemo(
    () => ({
      fen: puzzle.fen,
      moves: puzzle.moves,
      iteration: gameIterations,
      turn: puzzle.turn,
      isShaking,
      isSoundEnabled,
      solveChecker,
    }),
    [
      gameIterations,
      isShaking,
      isSoundEnabled,
      puzzle.fen,
      puzzle.moves,
      puzzle.turn,
      solveChecker,
    ]
  );

  return {
    boardProps,
    dialogue,
    isLoading,
    rawPuzzle: puzzle.raw,
    actions: {
      toggleSound: () => setIsSoundEnabled((prev) => !prev),
      resetPuzzle,
      loadNextPuzzle,
    },
  };
};
