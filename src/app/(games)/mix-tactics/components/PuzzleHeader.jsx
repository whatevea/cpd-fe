import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { FaChessKing } from "react-icons/fa";

export const PuzzleHeader = ({ turn, isSoundEnabled, onSoundToggle }) => (
  <header className="rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-6 text-white shadow-[0_20px_45px_rgba(3,7,18,0.55)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/60">
          <FaChessKing className="h-4 w-4 text-[#8ee1b7]" />
          Mix Tactics
        </span>
        <p className="mt-3 text-2xl font-semibold">
          {turn ? `${turn} to move` : "Loading puzzle…"}
        </p>
      </div>
      <button
        onClick={onSoundToggle}
        className="inline-flex h-12 items-center gap-2 border border-[#2f3b56] bg-[#101622] px-5 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-[#8ee1b7]"
      >
        {isSoundEnabled ? (
          <>
            <HiMiniSpeakerWave className="h-5 w-5" />
            Sound on
          </>
        ) : (
          <>
            <HiMiniSpeakerXMark className="h-5 w-5" />
            Sound off
          </>
        )}
      </button>
    </div>
  </header>
);
