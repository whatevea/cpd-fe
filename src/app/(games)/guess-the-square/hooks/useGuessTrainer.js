import { useCallback, useEffect, useRef, useState } from "react";

const randomSquare = () => {
  const rank = Math.floor(Math.random() * 8) + 1;
  const file = String.fromCharCode(97 + Math.floor(Math.random() * 8));
  return `${file}${rank}`;
};

const SOUND_FILES = {
  right: "/media/right.wav",
  wrong: "/media/wrong.wav",
};

export const useGuessTrainer = () => {
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [square, setSquare] = useState(() => randomSquare());
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);
  const soundsRef = useRef({});

  useEffect(() => {
    if (typeof Audio === "undefined") return;
    soundsRef.current = Object.fromEntries(
      Object.entries(SOUND_FILES).map(([key, src]) => [key, new Audio(src)])
    );
  }, []);

  useEffect(() => {
    if (!hasStarted || isGameOver) return undefined;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [hasStarted, isGameOver]);

  const playSound = useCallback(
    (type) => {
      if (!soundEnabled) return;
      const audio = soundsRef.current[type];
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    },
    [soundEnabled]
  );

  const queueNextSquare = useCallback(() => {
    setTimeout(() => {
      setSquare(randomSquare());
      setBoardFlipped((prev) => (Math.random() > 0.5 ? !prev : prev));
    }, 250);
  }, []);

  const handleSquareSelect = useCallback(
    (guess) => {
      if (isGameOver) return false;
      if (!hasStarted) setHasStarted(true);

      const isCorrectGuess = guess === square;
      if (isCorrectGuess) {
        playSound("right");
        setScore((prev) => prev + 1);
        setCorrect((prev) => prev + 1);
      } else {
        playSound("wrong");
        setScore((prev) => prev - 1);
        setMistakes((prev) => prev + 1);
      }
      queueNextSquare();
      return isCorrectGuess;
    },
    [hasStarted, isGameOver, square, playSound, queueNextSquare]
  );

  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    setScore(0);
    setMistakes(0);
    setCorrect(0);
    setHasStarted(false);
    setIsGameOver(false);
    setTimeLeft(60);
    setSquare(randomSquare());
  }, []);

  return {
    state: {
      score,
      mistakes,
      correct,
      hasStarted,
      isGameOver,
      square,
      boardFlipped,
      soundEnabled,
      timeLeft,
    },
    actions: {
      toggleSound: () => setSoundEnabled((prev) => !prev),
      toggleBoard: () => setBoardFlipped((prev) => !prev),
      handleSquareSelect,
      resetGame,
    },
  };
};
