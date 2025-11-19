import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { puzzleStore } from "@/app/storage";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudDownloadAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const HYDRATION_FLAG = "cpd::puzzlesHydrated";
const PUZZLES_URL = "/puzzles.csv";

export const PuzzleHydrator = () => {
  const [state, setState] = useState("idle"); // idle, downloading, parsing, complete, error
  const [progress, setProgress] = useState(0); // 0-100
  const [details, setDetails] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const bufferRef = useRef([]);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Check if already hydrated
    if (localStorage.getItem(HYDRATION_FLAG)) {
      return;
    }

    const hydrate = async () => {
      setIsVisible(true);
      setState("downloading");
      setProgress(0);
      setDetails("Connecting to server...");

      try {
        abortControllerRef.current = new AbortController();
        const response = await fetch(PUZZLES_URL, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const contentLength = response.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;

        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          loaded += value.length;

          if (total) {
            setProgress(Math.round((loaded / total) * 100));
            setDetails(`Downloading: ${Math.round(loaded / 1024)}KB / ${Math.round(total / 1024)}KB`);
          } else {
            setDetails(`Downloading: ${Math.round(loaded / 1024)}KB`);
          }
        }

        // Combine chunks into a single blob/text
        const blob = new Blob(chunks);
        const text = await blob.text();

        // Start Parsing
        setState("parsing");
        setProgress(0);
        setDetails("Preparing to parse...");

        // Use a small timeout to let the UI update before blocking with parsing
        await new Promise(resolve => setTimeout(resolve, 100));

        Papa.parse(text, {
          header: true,
          skipEmptyLines: "greedy",
          worker: true, // Use a worker to avoid freezing the UI
          complete: async (results) => {
            setDetails("Saving to offline storage...");
            const puzzles = results.data;
            console.log(`Parsed ${puzzles.length} puzzles.`);

            if (puzzles.length === 0) {
              console.warn("Parsed puzzles array is empty!");
              setState("error");
              setDetails("No puzzles found in file.");
              return;
            }

            await puzzleStore.setItem("puzzlesArray", puzzles);
            localStorage.setItem(HYDRATION_FLAG, "true");

            setState("complete");
            setDetails("Ready to play!");
            setProgress(100);

            // Hide after a delay
            setTimeout(() => setIsVisible(false), 3000);
          },
          error: (err) => {
            console.error("CSV Parse Error:", err);
            setState("error");
            setDetails("Failed to parse puzzles.");
          }
        });

      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error("Hydration failed:", error);
        setState("error");
        setDetails("Failed to load puzzles. Please refresh.");
      }
    };

    hydrate();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-xl border border-[#282e39] bg-[#151b2e]/95 p-4 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1c2236]">
              {state === "downloading" && <FaCloudDownloadAlt className="text-[#135bec]" />}
              {state === "parsing" && <CgSpinner className="animate-spin text-[#eab308]" />}
              {state === "complete" && <FaCheckCircle className="text-green-500" />}
              {state === "error" && <FaExclamationCircle className="text-red-500" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white">
                {state === "downloading" && "Downloading Puzzles"}
                {state === "parsing" && "Processing Library"}
                {state === "complete" && "Update Complete"}
                {state === "error" && "Update Failed"}
              </h4>
              <p className="mt-1 text-xs text-gray-400 truncate">{details}</p>

              {(state === "downloading" || state === "parsing") && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#0d111c]">
                  <motion.div
                    className={`h-full rounded-full ${state === "parsing" ? "bg-[#eab308]" : "bg-[#135bec]"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${state === "parsing" ? 100 : progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
