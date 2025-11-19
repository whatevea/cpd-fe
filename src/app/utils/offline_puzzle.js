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
    filteredPuzzlesCache = puzzleArray.filter((puzzle) => {
      if (!puzzle) return false;
      // If Themes is missing, we assume it's safe (or unsafe? let's assume safe but log warning if needed, 
      // but actually if we want "no promotion", we should be careful. 
      // If Themes is missing, we can't know if it has promotion. 
      // Let's assume if it's missing it's NOT a promotion puzzle unless proven otherwise.)
      const themes = puzzle.Themes || "";
      return typeof themes === "string" && !themes.includes("promotion");
    });
  } catch (error) {
    console.error("Failed to load offline puzzles:", error);
    puzzleArray = [];
    filteredPuzzlesCache = [];
  }

  return puzzleArray;
};

const ensurePuzzlesReady = async () => {
  // If we have puzzles in memory, return them
  if (puzzleArray.length) return puzzleArray;

  // If a load is already in progress, wait for it
  if (loadPromise) {
    await loadPromise;
    // After waiting, check if we got puzzles. If so, return them.
    if (puzzleArray.length) return puzzleArray;
  }

  // If we are here, it means either:
  // 1. We haven't tried loading yet.
  // 2. We tried loading before, but it was empty (maybe hydration wasn't done).
  // So we should try loading from storage again.

  loadPromise = loadPuzzlesFromStorage().finally(() => {
    loadPromise = null;
  });

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
