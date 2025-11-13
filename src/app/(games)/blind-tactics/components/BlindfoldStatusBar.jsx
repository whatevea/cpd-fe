import { LuArrowUpDown } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const BlindfoldStatusBar = ({
  status,
  boardFlipped,
  onToggleBoard,
  isSoundEnabled,
  onToggleSound,
  showDetails,
  onToggleDetails,
  currentPuzzle,
}) => (
  <div className="mb-4 md:mb-6">
    <div className="rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-5 shadow-[0_20px_45px_rgba(3,7,18,0.55)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className={`flex items-start gap-3 text-sm md:text-base ${
            status.type === "error"
              ? "text-[#ff9e9e]"
              : status.type === "success"
              ? "text-[#8ee1b7]"
              : "text-[#8ab4ff]"
          }`}
        >
          <FiInfo className="mt-1 h-5 w-5 flex-shrink-0" />
          <p className="text-current">{status.message}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ControlButton
            title="Flip board"
            onClick={onToggleBoard}
            icon={<LuArrowUpDown className="h-5 w-5" />}
          />
          <ControlButton
            title="Toggle sound"
            onClick={onToggleSound}
            icon={
              isSoundEnabled ? (
                <FiVolume2 className="h-5 w-5" />
              ) : (
                <FiVolumeX className="h-5 w-5" />
              )
            }
          />
          <ControlButton
            title="Puzzle details"
            onClick={onToggleDetails}
            icon={
              showDetails ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )
            }
          />
        </div>
      </div>

      <AnimatePresence>
        {showDetails && currentPuzzle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-5"
          >
            <PuzzleDetails puzzle={currentPuzzle} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const ControlButton = ({ icon, ...props }) => (
  <motion.button
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
    className="flex h-12 w-12 items-center justify-center border border-[#2f3b56] bg-[#101622] text-white transition hover:border-[#8ee1b7]"
    {...props}
  >
    {icon}
  </motion.button>
);

const PuzzleDetails = ({ puzzle }) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    className="mt-2 rounded-2xl border border-[#2f3b56] bg-[#101a3a] p-4"
  >
    <div className="grid grid-cols-3 gap-4 text-white">
      <DetailCard label="Rating" value={puzzle.Rating} />
      <DetailCard label="Plays" value={puzzle.NbPlays} />
      <DetailCard label="Popularity" value={`${puzzle.Popularity}%`} />
    </div>
    <div className="mt-3">
      <span className="text-xs uppercase tracking-[0.3em] text-white/60">
        Themes
      </span>
      <div className="mt-2 flex flex-wrap gap-2">
        {puzzle.Themes.split(" ").map((theme) => (
          <span
            key={theme}
            className="rounded-sm border border-[#2f3b56] bg-[#151f3a] px-2 py-1 text-xs uppercase tracking-[0.2em] text-white/70"
          >
            {theme}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const DetailCard = ({ label, value }) => (
  <div className="flex flex-col items-center rounded-xl border border-[#2f3b56] bg-[#0b1220] px-3 py-4 text-center">
    <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
      {label}
    </span>
    <span className="mt-2 text-lg font-semibold text-white">{value}</span>
  </div>
);
