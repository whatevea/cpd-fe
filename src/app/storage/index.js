import localforage from "localforage";
export const puzzleStore = localforage.createInstance({
  name: "allpuzzles",
});
