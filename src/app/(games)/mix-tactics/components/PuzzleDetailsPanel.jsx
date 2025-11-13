import {
  FaArrowRight,
  FaExclamationCircle,
  FaHashtag,
  FaRedo,
  FaTags,
  FaUsers,
} from "react-icons/fa";

const toneStyles = {
  error: "border border-[#ff9e9e]/60 bg-[#2f1018] text-[#ffb3b3]",
  success: "border border-[#8ee1b7]/60 bg-[#11251d] text-[#9ef2c5]",
  info: "border border-[#8ab4ff]/50 bg-[#101b34] text-[#9dbdff]",
};

export const PuzzleDetailsPanel = ({
  dialogue,
  rawPuzzle,
  onReset,
  onNext,
}) => (
  <aside className="w-full rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-5 text-white">
    <div
      className={`mb-4 flex items-start gap-3 rounded-xl px-3 py-2 text-sm ${
        toneStyles[dialogue.tone] || toneStyles.info
      }`}
    >
      <FaExclamationCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <p>{dialogue.message}</p>
    </div>

    {rawPuzzle && (
      <div className="space-y-3 rounded-xl border border-[#2f3b56] bg-[#101a3a] p-4">
        <PuzzleDetail
          icon={<FaHashtag className="h-4 w-4" />}
          label="Puzzle ID"
          value={rawPuzzle.PuzzleId}
        />
        <PuzzleDetail
          icon={<FaUsers className="h-4 w-4" />}
          label="Attempts"
          value={rawPuzzle.NbPlays?.toLocaleString()}
        />
        <PuzzleDetail
          icon={<FaTags className="h-4 w-4" />}
          label="Themes"
          value={
            <div className="flex flex-wrap gap-1">
              {rawPuzzle.Themes?.split(" ").map((theme) => (
                <span
                  key={theme}
                  className="rounded-sm border border-[#2f3b56] px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70"
                >
                  {theme}
                </span>
              ))}
            </div>
          }
        />
      </div>
    )}

    <div className="mt-4 flex flex-col gap-2">
      <ActionButton onClick={onReset} icon={<FaRedo className="h-4 w-4" />}>
        Reset puzzle
      </ActionButton>
      <ActionButton
        onClick={onNext}
        tone="primary"
        icon={<FaArrowRight className="h-4 w-4" />}
      >
        New puzzle
      </ActionButton>
    </div>
  </aside>
);

const PuzzleDetail = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 text-sm text-white/80">
    <span className="mt-0.5 text-white/60">{icon}</span>
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
        {label}
      </p>
      {typeof value === "string" || typeof value === "number" ? (
        <p className="text-base font-semibold text-white">{value}</p>
      ) : (
        value
      )}
    </div>
  </div>
);

const ActionButton = ({ children, icon, tone = "default", ...rest }) => {
  const toneClasses =
    tone === "primary"
      ? "border border-[#8ee1b7] bg-[#8ee1b7] text-[#041019] hover:bg-[#9ef2c5]"
      : "border border-[#2f3b56] bg-[#101622] text-white hover:border-[#8ab4ff]";

  return (
    <button
      className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-[0.3em] transition ${toneClasses}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};
