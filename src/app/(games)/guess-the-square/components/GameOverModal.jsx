import { IoRefreshOutline, IoTrophyOutline } from "react-icons/io5";

export const GameOverModal = ({ score, correct, mistakes, onReset }) => (
  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl border border-[#2f3b56] bg-black/70 backdrop-blur-sm">
    <div className="mx-4 w-full max-w-md rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
      <div className="mb-5 flex items-center justify-center">
        <IoTrophyOutline className="text-5xl text-[#ffd166]" />
      </div>
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
        Round complete
      </h2>
      <div className="mb-6 space-y-3">
        <Row label="Final score" value={score} accent="text-[#8ee1b7]" />
        <Row label="Correct moves" value={correct} accent="text-[#8ab4ff]" />
        <Row label="Mistakes" value={mistakes} accent="text-[#ff9e9e]" />
      </div>
      <button
        onClick={onReset}
        className="inline-flex w-full items-center justify-center gap-2 border border-[#8ab4ff] bg-[#8ab4ff] px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-[#0b1220] transition hover:bg-[#9dc1ff]"
      >
        <IoRefreshOutline className="text-lg" />
        Play again
      </button>
    </div>
  </div>
);

const Row = ({ label, value, accent }) => (
  <div className="flex items-center justify-between rounded-xl border border-[#2f3b56] bg-[#101622] px-4 py-3">
    <span className="text-xs uppercase tracking-[0.3em] text-white/60">
      {label}
    </span>
    <span className={`text-xl font-semibold ${accent}`}>{value}</span>
  </div>
);
