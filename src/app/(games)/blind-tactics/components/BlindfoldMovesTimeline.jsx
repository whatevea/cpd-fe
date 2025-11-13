import { motion } from "framer-motion";
import BrainStormingIcon from "./BrainstormingIcon";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const colorClass = (color) =>
  color === "white" ? "text-white" : "text-[#8ee1b7]";

const BlindfoldMovesTimeline = ({ moves, totalFields, indexColor }) => {
  const nextColor = indexColor === "white" ? "black" : "white";

  return (
    <div className="w-full p-2">
      <div className="mb-4 flex items-center gap-3">
        <BrainStormingIcon width="48px" height="48px" />
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#8a96c9]">
            Move tracker
          </p>
          <h2 className="text-lg font-semibold text-white">
            Visualization sequence
          </h2>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-2"
      >
        {Array.from({ length: totalFields }, (_, i) => {
          const text = moves[i] || "…";
          const alternateTextColor = i % 2 === 0 ? indexColor : nextColor;

          return (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="relative flex h-12 items-center justify-center rounded-xl border border-[#262f45] bg-[#0d1527] text-white transition hover:border-[#8ee1b7]"
            >
              <motion.p
                className={`select-none text-lg font-bold ${colorClass(
                  alternateTextColor
                )}`}
                whileHover={{ scale: 1.05 }}
              >
                {text}
              </motion.p>
              {moves[i] && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-[#8ee1b7]"
                  style={{ width: "100%" }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default BlindfoldMovesTimeline;
