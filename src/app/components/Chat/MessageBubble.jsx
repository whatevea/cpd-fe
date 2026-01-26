import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function MessageBubble({
  message,
  loggedInUserName,
  loggedInUserId,
  isHighlighted = false,
}) {
  const messageUserId = message.user?._id || message.user;
  const isCurrentUser = messageUserId === loggedInUserId;

  const username =
    message.user?.username ||
    (isCurrentUser ? loggedInUserName : "DeepSeek AI");

  const formattedTime = message.createdAt
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    : "just now";

  const messageText = (message?.message || "").trim().slice(0, 200);
  const isAiMessage = /DeepSeekAI/i.test(username || "");
  const gameLink =
    typeof message?.gameDetail === "object"
      ? message?.gameDetail?.url || message?.gameDetail?.link
      : null;
  const gameLabel =
    (typeof message?.gameDetail === "object" &&
      (message?.gameDetail?.title ||
        message?.gameDetail?.opponent ||
        message?.gameDetail?.event)) ||
    "View game";

  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (
      !messageText ||
      typeof navigator === "undefined" ||
      !navigator.clipboard?.writeText
    ) {
      return;
    }
    try {
      await navigator?.clipboard?.writeText(messageText);
      setCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  }, [messageText]);

  return (
    <motion.div
      id={`message-${message._id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-3 max-w-[78%] ${isCurrentUser ? "ml-auto" : "mr-auto"}`}
    >
      <motion.div
        animate={isHighlighted ? { borderColor: ["#fbbf24", "#f97316", "#fbbf24"] } : {}}
        transition={isHighlighted ? { duration: 0.6, repeat: 4, ease: "easeInOut" } : {}}
        className={`group relative rounded-2xl border px-3 py-2 shadow-sm ${
          isCurrentUser
            ? "border-[#2a3f31] bg-[#0f1f1a] text-white"
            : "border-[#1f2a3f] bg-[#0f1626] text-white/90"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/60">
          <span
            className={`font-semibold text-[12px] ${
              isCurrentUser ? "text-[#9edb30]" : "text-blue-200"
            }`}
          >
            {username}
          </span>
          <span className="text-white/50">• {formattedTime}</span>
          {isAiMessage && (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 uppercase text-[9px] tracking-[0.3em] text-amber-200">
              AI
            </span>
          )}
          {message.messageType === "game" && (
            <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 uppercase text-[9px] tracking-[0.3em] text-sky-200">
              Game
            </span>
          )}
        </div>

        {messageText && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-2 flex items-center gap-1 text-xs text-white/40 opacity-0 transition group-hover:opacity-100 hover:text-white"
            aria-label="Copy message"
          >
            {copied ? <FiCheck /> : <FiCopy />}
          </button>
        )}

        <p className="text-sm leading-snug whitespace-pre-wrap break-words pr-6">
          {messageText}
        </p>

        {gameLink && (
          <a
            href={gameLink}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-xs text-sky-200 underline-offset-2 hover:underline"
          >
            {gameLabel}
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}
