import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function MessageBubble({
  message,
  loggedInUserName,
  loggedInUserId,
}) {
  const messageUserId = message.user?._id || message.user;
  const isCurrentUser = messageUserId === loggedInUserId;

  const username =
    message.user?.username ||
    (isCurrentUser ? loggedInUserName : "DeepseekAI");

  const formattedTime = message.createdAt
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    : "just now";

  const messageText = (message?.message || "").trim();
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 max-w-[80%] ${isCurrentUser ? "ml-auto" : "mr-auto"}`}
    >
      <div
        className={`relative rounded-2xl p-4 shadow-md ${isCurrentUser
          ? "bg-[#819d25]/25 text-white"
          : "bg-[#1e3a3d] text-white/90"
          }`}
      >
        <div className="flex items-center gap-2 mb-1 text-xs">
          <span
            className={`font-semibold text-sm ${isCurrentUser ? "text-[#9edb30]" : "text-blue-200"
              }`}
          >
            {username}
          </span>
          <span className="text-white/50">{formattedTime}</span>
          {isAiMessage && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 uppercase text-[10px] tracking-widest">
              AI
            </span>
          )}
          {message.messageType === "game" && (
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-200 uppercase text-[10px] tracking-widest">
              Game
            </span>
          )}
        </div>

        {messageText && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 text-white/50 hover:text-white transition text-xs flex items-center gap-1"
            aria-label="Copy message"
          >
            {copied ? <FiCheck /> : <FiCopy />}
          </button>
        )}

        <p className="text-sm whitespace-pre-wrap break-words pr-8">
          {messageText}
        </p>

        {gameLink && (
          <a
            href={gameLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs text-sky-200 mt-3 underline-offset-2 hover:underline"
          >
            {gameLabel}
          </a>
        )}
      </div>
    </motion.div>
  );
}
