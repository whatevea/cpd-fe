let puzzleArray = [];
let filteredPuzzlesCache = [];
let storePromise = null;
let loadPromise = null;

const getPuzzleStore = async () => {
  if (!storePromise) {
    storePromise = import("@/app/storage").then((mod) => mod.puzzleStore);
  }
  return storePromise;
};

const loadPuzzlesFromStorage = async () => {
  const store = await getPuzzleStore();
  if (!store) return [];

  try {
    const data = await store.getItem("puzzlesArray");
    puzzleArray = Array.isArray(data) ? data.filter(Boolean) : [];
    filteredPuzzlesCache = puzzleArray.filter(
      (puzzle) =>
        puzzle?.Themes && typeof puzzle.Themes === "string"
          ? !puzzle.Themes.includes("promotion")
          : false
    );
  } catch (error) {
    console.error("Failed to load offline puzzles:", error);
    puzzleArray = [];
    filteredPuzzlesCache = [];
  }

  return puzzleArray;
};

const ensurePuzzlesReady = async () => {
  if (puzzleArray.length) return puzzleArray;

  if (!loadPromise) {
    loadPromise = loadPuzzlesFromStorage().finally(() => {
      loadPromise = null;
    });
  }

  await loadPromise;
  return puzzleArray;
};

export const getRandomPuzzleOffline = async () => {
  const puzzles = await ensurePuzzlesReady();
  if (!puzzles.length) return null;
  return puzzles[Math.floor(Math.random() * puzzles.length)];
};

export const getRandomPuzzleOfflineNoPromotion = async () => {
  await ensurePuzzlesReady();
  if (!filteredPuzzlesCache.length) return null;
  return filteredPuzzlesCache[
    Math.floor(Math.random() * filteredPuzzlesCache.length)
  ];
};
