import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChessZeroBoard from "./components/ChessZeroBoard";
import { ChessZeroControls } from "./components/ChessZeroControls";
import { WinDialog } from "./components/WinDialog";
import { Game } from "@/app/lib/chesszero/Game";
import { targetSquares } from "@/app/utils/randompieceplacer";
import { encrypt, decrypt } from "@/app/utils/encrypt_decrypt";
import { PUBLIC_APP_URL } from "@/app/config/env";
import { usePageMetadata } from "@/app/hooks/usePageMetadata";
import { getGameConfig } from "@/app/constants/gameConfig";
import GamePageLayout from "@/app/components/Layout/GamePageLayout";

const soundMap = {
  pop: "/media/pop.mp3",
  win: "/media/victory.mp3",
  move: "/media/movesound.mp3",
};

const POP_DELAY_MS = 50;
const WIN_DIALOG_DELAY_MS = 100;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const game = getGameConfig("zero-sum-game");

export default function ZeroSumGamePage() {
  return (
    <Suspense
      fallback={
        <GamePageLayout title={game.title} description={game.metaDescription}>
          <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-[#2f3b56] bg-[#0b1220] text-white">
            Loading {game.title}…
          </div>
        </GamePageLayout>
      }
    >
      <ZeroSumGameContent />
    </Suspense>
  );
}

function ZeroSumGameContent() {
  const [searchParams] = useSearchParams();
  const [gameId, setGameId] = useState(searchParams.get("id"));
  const [targetBoard, setTargetBoard] = useState(null);
  const [userBoard, setUserBoard] = useState({});
  const [boardPieces, setBoardPieces] = useState({});
  const [differenceBoard, setDifferenceBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [difficulty, setDifficulty] = useState(3);
  const [boardLocked, setBoardLocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const gameInstanceRef = useRef(new Game());
  const runningTimeRef = useRef(0);
  const winTriggeredRef = useRef(false);
  const soundsRef = useRef({});

  usePageMetadata({
    title: game.title,
    description: game.metaDescription,
  });

  useEffect(() => {
    if (typeof Audio === "undefined") return;
    soundsRef.current = Object.fromEntries(
      Object.entries(soundMap).map(([key, src]) => [key, new Audio(src)])
    );
  }, []);

  useEffect(() => {
    runningTimeRef.current = 0;
    const interval = setInterval(() => {
      runningTimeRef.current += 1;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const playSound = useCallback((key) => {
    const audio = soundsRef.current[key];
    if (!audio) return;
    const sound = key === "pop" ? audio.cloneNode() : audio;
    sound.currentTime = 0;
    sound.play().catch(() => { });
  }, []);

  const initializeBoard = useCallback(
    (forceNew = false, customDifficulty) => {
      let parsedSeed = {};
      try {
        parsedSeed = JSON.parse(decrypt(gameId) || "{}");
      } catch {
        parsedSeed = {};
      }

      const shouldReuseSeed = Object.keys(parsedSeed).length && !forceNew;
      const seed = shouldReuseSeed
        ? parsedSeed
        : targetSquares(customDifficulty ?? difficulty);

      if (!shouldReuseSeed) {
        setGameId(encrypt(JSON.stringify(seed)));
      }

      winTriggeredRef.current = false;
      runningTimeRef.current = 0;
      gameInstanceRef.current = new Game();
      setSolution(seed.solution);
      setTargetBoard(seed.attackedSquares);
      setBoardPieces({});
      setUserBoard({});
      setMoves(0);
      setBoardLocked(false);
      setShowWinDialog(false);
    },
    [difficulty, gameId]
  );

  useEffect(() => {
    const hash = Math.floor(10000 + Math.random() * 90000);
    window.localStorage.setItem("hash", hash.toString());
    initializeBoard();
  }, [initializeBoard]);

  useEffect(() => {
    if (!targetBoard) return;
    const diff = { ...targetBoard };
    Object.entries(userBoard).forEach(([square, attack]) => {
      diff[square] = (diff[square] || 0) - attack;
    });
    setDifferenceBoard(diff);
  }, [targetBoard, userBoard]);

  const animateWin = useCallback(
    async (snapshot) => {
      if (!snapshot) return;
      setBoardLocked(true);
      const removalOrder = Object.keys(snapshot);
      for (const square of removalOrder) {
        await wait(POP_DELAY_MS);
        playSound("pop");
        setDifferenceBoard((prev) => {
          if (!prev || !(square in prev)) return prev;
          const next = { ...prev };
          delete next[square];
          return next;
        });
      }
      playSound("win");
      await wait(WIN_DIALOG_DELAY_MS);
      setShowWinDialog(true);
      setBoardLocked(false);
    },
    [playSound]
  );

  useEffect(() => {
    if (!differenceBoard || winTriggeredRef.current) return;
    const values = Object.values(differenceBoard);
    if (values.length && values.every((value) => value === 0)) {
      winTriggeredRef.current = true;
      animateWin(differenceBoard);
    }
  }, [differenceBoard, animateWin]);

  const placePiece = useCallback(
    (square, piece) => {
      setMoves((prev) => prev + 1);
      const [file, rank] = [square[0], Number(square[1])];

      if (piece === "Remove") {
        gameInstanceRef.current.removePiece(file, rank);
        setBoardPieces((prev) => {
          const { [square]: _, ...rest } = prev;
          return rest;
        });
      } else {
        gameInstanceRef.current.placePiece(file, rank, piece);
        playSound("move");
        setBoardPieces((prev) => ({ ...prev, [square]: piece }));
      }

      const attacked = gameInstanceRef.current
        .getAttackedSquares()
        .reduce((acc, sq) => {
          acc[`${sq.file}${sq.rank}`] = sq.attackCount;
          return acc;
        }, {});
      setUserBoard(attacked);
    },
    [playSound]
  );

  const copyGameLevel = useCallback(() => {
    const base = PUBLIC_APP_URL || window.location.origin;
    navigator.clipboard
      .writeText(`${base}/zero-sum-game?id=${gameId}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => { });
  }, [gameId]);

  const handleDifficultyChange = useCallback(
    (nextDifficulty) => {
      setDifficulty(nextDifficulty);
      initializeBoard(true, nextDifficulty);
    },
    [initializeBoard]
  );

  const pendingSquares = useMemo(() => {
    if (!differenceBoard) return 0;
    return Object.values(differenceBoard).filter((value) => value !== 0).length;
  }, [differenceBoard]);

  const placedPieces = useMemo(
    () => Object.keys(boardPieces).length,
    [boardPieces]
  );

  const metrics = [
    { label: "Level", value: `Lv ${difficulty}`, helper: "Seed difficulty" },
    { label: "Moves", value: moves, helper: "Steps taken" },
    { label: "Pieces placed", value: placedPieces, helper: "Active pieces" },
    { label: "Squares left", value: pendingSquares, helper: "Until zero sum" },
  ];

  return (
    <GamePageLayout title={game.title} description={game.metaDescription}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="rounded-2xl border border-[#2f3b56] bg-gradient-to-b from-[#141b32] to-[#080d1f] p-5">
            <div className="mx-auto w-full max-w-[720px]">
              {differenceBoard && (
                <ChessZeroBoard
                  numberedSquares={differenceBoard}
                  placePiece={placePiece}
                  boardPieces={boardPieces}
                  boardLocked={boardLocked}
                  targetBoard={targetBoard ?? {}}
                />
              )}
            </div>
          </div>
          <ChessZeroControls
            difficulty={difficulty}
            setDifficulty={handleDifficultyChange}
            onNewGame={() => initializeBoard(true)}
            onShare={copyGameLevel}
            copied={copied}
            moves={moves}
            solution={solution}
          />
        </div>

        {showWinDialog && (
          <WinDialog
            onShare={copyGameLevel}
            copied={copied}
            getTime={() => runningTimeRef.current}
            onNextLevel={() => {
              setShowWinDialog(false);
              initializeBoard(true);
            }}
          />
        )}
      </div>
    </GamePageLayout>
  );
}

const MetricCard = ({ label, value, helper }) => (
  <div className="rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-4 text-white shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
    <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">
      {label}
    </p>
    <p className="mt-3 text-2xl font-black text-white">{value}</p>
    <p className="mt-1 text-xs text-white/50">{helper}</p>
  </div>
);
