import { IoGridOutline, IoVolumeMediumOutline } from "react-icons/io5";
import { BsVolumeMute } from "react-icons/bs";

export const StatsPanel = ({
  timeLeft,
  score,
  soundEnabled,
  onToggleSound,
  boardFlipped,
  onToggleBoard,
}) => (
  <div className="h-full rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-5 shadow-[0_20px_45px_rgba(3,7,18,0.55)]">
    <div className="flex h-full flex-col gap-4">
      <StatCard label="Time left" value={`${timeLeft}s`} helper="Live clock" />
      <StatCard label="Score" value={score} helper="Current streak" />
      <div className="flex flex-col gap-3 rounded-xl border border-[#2f3b56] bg-[#101622] p-4">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">
          Controls
        </p>
        <div className="flex gap-3">
          <button
            onClick={onToggleSound}
            className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#2f3b56] bg-[#0d1324] text-white transition hover:border-[#8ee1b7]"
          >
            {soundEnabled ? (
              <IoVolumeMediumOutline className="text-xl" />
            ) : (
              <BsVolumeMute className="text-xl" />
            )}
          </button>
          <button
            onClick={onToggleBoard}
            className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#2f3b56] bg-[#0d1324] text-white transition hover:border-[#8ee1b7]"
          >
            <IoGridOutline className="text-xl" />
          </button>
        </div>
        <p className="text-xs text-white/60">
          {boardFlipped ? "Board flipped" : "Default orientation"}
        </p>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, helper }) => (
  <div className="rounded-xl border border-[#2f3b56] bg-[#101a3a] p-4">
    <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">
      {label}
    </p>
    <p className="mt-3 text-2xl font-black text-white">{value}</p>
    <p className="mt-1 text-xs text-white/50">{helper}</p>
  </div>
);
