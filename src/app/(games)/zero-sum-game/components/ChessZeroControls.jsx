import { useState } from "react";
import { FaDice, FaCheck, FaCog, FaQuestion } from "react-icons/fa";

export const ChessZeroControls = ({
  difficulty,
  setDifficulty,
  onNewGame,
  onShare,
  copied,
  moves,
  solution,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-5 text-white shadow-[0_20px_45px_rgba(3,7,18,0.55)]">
      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#2f3b56] bg-[#101622] p-4">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">
              Moves taken
            </p>
            <p className="mt-2 text-3xl font-black text-[#8ee1b7]">{moves}</p>
          </div>
          <label className="flex flex-col gap-2 rounded-xl border border-[#2f3b56] bg-[#101622] p-4 text-sm">
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/60">
              Difficulty
            </span>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(Number(e.target.value));
              }}
              className="w-full border border-[#2f3b56] bg-[#0b1220] px-3 py-2 text-white focus:border-[#8ab4ff] focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                <option key={level} value={level} className="bg-[#0b1220]">
                  Level {level}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <PrimaryButton onClick={onNewGame} icon={<FaDice className="text-base" />}>
            New game
          </PrimaryButton>
          <PrimaryButton
            tone="secondary"
            onClick={onShare}
            icon={
              copied ? <FaCheck className="text-base" /> : <FaCog className="text-base" />
            }
          >
            {copied ? "Copied" : "Share level"}
          </PrimaryButton>
          <PrimaryButton
            tone="ghost"
            onClick={() => setShowHowToPlay(true)}
            icon={<FaQuestion className="text-base" />}
          >
            Help
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full border border-[#2f3b56] bg-[#101622] px-4 py-3 text-sm font-bold uppercase tracking-[0.3em] transition hover:border-[#8ab4ff]"
        >
          {showSolution ? "Hide solution" : "Show solution"}
        </button>

        {showSolution && (
          <div className="rounded-xl border border-[#2f3b56] bg-[#0b1220] p-4">
            <pre className="max-h-60 overflow-auto font-mono text-xs text-white/80">
              {JSON.stringify(solution, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-6 text-left text-white shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
            <h2 className="text-2xl font-bold">How to play</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>
                <span className="font-semibold text-white">Start easy:</span>{" "}
                begin on level 1 and ramp up once you zero the grid.
              </li>
              <li>
                <span className="font-semibold text-white">Goal:</span> place pieces
                so every highlighted square sums to zero.
              </li>
              <li>
                <span className="font-semibold text-white">Track progress:</span>{" "}
                share the level to replay or challenge friends.
              </li>
            </ul>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/50">
              Tip: you can always reveal the solution.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="border border-[#2f3b56] bg-[#101622] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#8ee1b7]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PrimaryButton = ({ children, icon, tone = "primary", ...rest }) => {
  const palette = {
    primary:
      "border border-[#8ee1b7] bg-[#8ee1b7] text-[#041019] hover:bg-[#9ef2c5]",
    secondary:
      "border border-[#8ab4ff] bg-[#8ab4ff] text-[#071221] hover:bg-[#9dc1ff]",
    ghost:
      "border border-[#2f3b56] bg-[#101622] text-white hover:border-[#8ab4ff]",
  }[tone];

  return (
    <button
      className={`inline-flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-[0.3em] transition ${palette}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};
