import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import ChatMain from "./ChatMain";

export default function ChatSidebar({ className = "" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const containerClasses = useMemo(
    () =>
      [
        "relative",
        "w-full",
        "flex",
        "flex-col",
        "h-full",
        "max-h-screen",
        "min-h-0",
        "transition-all",
        "duration-300",
        "ease-out",
        "lg:flex-shrink-0",
        isCollapsed ? "lg:max-w-[72px] lg:basis-[72px]" : "lg:max-w-[420px] lg:basis-[420px]",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [className, isCollapsed]
  );

  const handleToggle = () => setIsCollapsed((prev) => !prev);

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        className="fixed right-4 top-1/2 z-40 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#2f3b56] bg-[#0b1220] text-white shadow-2xl transition hover:border-[#8ee1b7] lg:flex"
        aria-label={isCollapsed ? "Expand chat" : "Collapse chat"}
      >
        {isCollapsed ? (
          <FiChevronsLeft className="text-xl text-[#8ee1b7]" />
        ) : (
          <FiChevronsRight className="text-xl text-[#8ee1b7]" />
        )}
      </button>

      <div className={containerClasses}>
        <div className="mb-4 flex justify-end lg:hidden">
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-3 rounded-xl border border-[#2f3b56] bg-[#151b2e] px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white"
          >
            {isCollapsed ? (
              <>
                <FiChevronsLeft />
                Show chat
              </>
            ) : (
              <>
                <FiChevronsRight />
                Hide chat
              </>
            )}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed ? (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0.2, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
              className="flex h-full max-h-screen flex-col"
            >
              <ChatMain variant="panel" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-collapsed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="hidden h-full max-h-screen items-center justify-center rounded-2xl border border-dashed border-[#2f3b56] bg-[#0b1120]/70 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60 lg:flex"
            >
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
