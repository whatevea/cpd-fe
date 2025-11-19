let allPuzzles = [];
let nonPromoPuzzles = [];
let storePromise = null;
let loadPromise = null;

//  data structure is like this PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,TotalPieces
// 00008,r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24,f2g3 e6e7 b2b1 b3c1 b1c1 h6c1,1838,75,95,7002,crushing hangingPiece long middlegame,20

const getRandomItem = (arr) =>
  arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

const isNonPromotional = (puzzle) => {
  const themes = puzzle?.Themes;
  // Assume safe if Themes is missing, otherwise check for 'promotion'
  return typeof themes !== "string" || !themes.includes("promotion");
};

const getPuzzleStore = async () => {
  if (!storePromise) {
    storePromise = import("@/app/storage").then((mod) => mod.puzzleStore);
  }
  return storePromise;
};


const loadPuzzlesFromStorage = async () => {
  try {
    const store = await getPuzzleStore();
    if (!store) return [];
    const data = await store.getItem("puzzlesArray");
    allPuzzles = Array.isArray(data) ? data.filter(Boolean) : [];
    nonPromoPuzzles = allPuzzles.filter(isNonPromotional);

  } catch (error) {
    console.error("Failed to load offline puzzles:", error);
    allPuzzles = [];
    nonPromoPuzzles = [];
  }

  return allPuzzles;
};

const ensurePuzzlesReady = async () => {
  if (allPuzzles.length) return allPuzzles;

  // If not loading, start loading
  if (!loadPromise) {
    loadPromise = loadPuzzlesFromStorage().finally(() => {
      loadPromise = null; // Allow retries on future calls
    });
  }

  await loadPromise;
  return allPuzzles;
};


export const getRandomPuzzleOffline = async () => {
  await ensurePuzzlesReady();
  return getRandomItem(allPuzzles);
};

export const getRandomPuzzleOfflineNoPromotion = async () => {
  await ensurePuzzlesReady();
  return getRandomItem(nonPromoPuzzles);
};