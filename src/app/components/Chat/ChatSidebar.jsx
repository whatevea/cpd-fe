import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronsLeft, FiChevronsRight, FiMessageSquare } from "react-icons/fi";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { Link } from "react-router-dom";
import useUserStore from "@/app/storage/userInfo";
import ChatMain from "./ChatMain";

const GuestPreview = () => (
  <div className="flex max-h-screen flex-col justify-between border border-[#2f3b56] bg-[#151b2e] p-6 text-white shadow-[0_15px_60px_rgba(0,0,0,0.45)]">
    <div>
      <p className="text-[11px] uppercase tracking-[0.4em] text-[#8a96c9]">Community</p>
      <h3 className="mt-4 text-2xl font-semibold">
        Sign in to join <span className="text-[#8ee1b7]">live chat</span>
      </h3>
      <p className="mt-3 text-sm text-white/70">
        Log in with Google or Lichess to drop puzzles, mention{" "}
        <span className="text-[#8ee1b7]">@ai</span>, and keep your shoutouts linked
        to your profile.
      </p>
    </div>

    <div className="space-y-4">
      <div className="rounded-xl border border-[#2b3347] bg-[#10162a] p-4 text-sm text-white/70">
        <div className="flex items-center gap-3 text-white">
          <IoChatbubbleEllipses className="text-xl text-[#8ee1b7]" />
          <span className="text-xs uppercase tracking-[0.4em] text-[#8a96c9]">
            What you get
          </span>
        </div>
        <ul className="mt-3 space-y-2 text-white/70">
          {[
            "Realtime global lobby with smart caching",
            "Mention @ai for instant replies",
            "Profile linked shoutouts with moderation",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <span className="mt-1 size-1 rounded-full bg-[#8ee1b7]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/account"
        className="inline-flex w-full items-center justify-center border border-[#2f3b56] bg-[#8ee1b7] px-4 py-3 text-sm font-bold uppercase tracking-[0.3em] text-[#071221] transition hover:bg-[#9af0c4]"
      >
        Go to login
      </Link>
    </div>
  </div>
);

export default function ChatSidebar({ className = "" }) {
  const { isAuthenticated } = useUserStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const containerClasses = useMemo(
    () =>
      [
        "relative",
        "w-full",
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
              className="h-full"
            >
              {isAuthenticated ? (
                <ChatMain variant="panel" />
              ) : (
                <GuestPreview />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chat-collapsed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="hidden h-full items-center justify-center rounded-2xl border border-dashed border-[#2f3b56] bg-[#0b1120]/70 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60 lg:flex"
            >
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
