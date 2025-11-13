import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { puzzleStore } from "@/app/storage";

const HYDRATION_FLAG = "cpd::puzzlesHydrated";

const scheduleIdle = (callback) => {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback);
  }
  return window.setTimeout(callback, 0);
};

const cancelIdle = (id) => {
  if (id === -1) return;
  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

export const PuzzleHydrator = () => {
  const [status, setStatus] = useState("");
  const bufferRef = useRef([]);
  const parserRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem(HYDRATION_FLAG)) {
      return undefined;
    }

    let idleHandle = -1;
    let cancelled = false;

    const startHydration = () => {
      parserRef.current = Papa.parse("/puzzles.csv", {
        download: true,
        header: true,
        worker: true,
        skipEmptyLines: "greedy",
        chunk: (results, parser) => {
          parser.pause();
          bufferRef.current.push(...results.data);
          setStatus(
            `Caching ${
              bufferRef.current.length.toLocaleString() || "…"
            } puzzles…`
          );
          idleHandle = scheduleIdle(() => parser.resume());
        },
        complete: async () => {
          if (cancelled) return;
          setStatus("Finalizing offline cache…");
          await puzzleStore.setItem("puzzlesArray", bufferRef.current);
          localStorage.setItem(HYDRATION_FLAG, "true");
          setStatus("");
        },
        error: (error) => {
          console.error("Puzzle hydration failed:", error);
          setStatus("Unable to prepare offline puzzles.");
        },
      });
    };

    idleHandle = scheduleIdle(startHydration);

    return () => {
      cancelled = true;
      cancelIdle(idleHandle);
      if (parserRef.current?.abort) {
        parserRef.current.abort();
      }
    };
  }, []);

  if (!status) return null;

  return (
    <div className="fixed bottom-4 right-4 rounded-lg bg-black/75 px-4 py-2 text-sm text-white shadow-2xl backdrop-blur">
      {status}
    </div>
  );
};
