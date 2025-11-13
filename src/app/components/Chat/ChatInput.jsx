import { memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSend } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";

const ChatInput = memo(
  ({
    onSubmit,
    value,
    onChange,
    isLoading,
    maxLength = 600,
    disabled = false,
    errorMessage = "",
  }) => {
    const safeValue = value ?? "";

    const helperCopy = useMemo(
      () =>
        errorMessage
          ? errorMessage
          : "Press Enter to send. Shift + Enter adds a new line.",
      [errorMessage]
    );

    const isSendDisabled = useMemo(
      () => disabled || isLoading || !safeValue.trim(),
      [disabled, isLoading, safeValue]
    );

    const counterMeta = useMemo(() => {
      if (!maxLength) return null;
      const used = safeValue.length;
      const remaining = Math.max(maxLength - used, 0);
      const isCritical = remaining <= Math.round(maxLength * 0.1);
      return {
        used,
        max: maxLength,
        tone: isCritical ? "text-rose-300" : "text-white/70",
      };
    }, [safeValue, maxLength]);

    const handleKeyDown = useCallback(
      (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          if (!isSendDisabled) {
            onSubmit?.(event);
          }
        }
      },
      [isSendDisabled, onSubmit]
    );

    const handleSubmit = useCallback(
      (event) => {
        event?.preventDefault();
        if (isSendDisabled) return;
        onSubmit?.(event);
      },
      [isSendDisabled, onSubmit]
    );

    return (
      <motion.form
        onSubmit={handleSubmit}
        className="border-t border-[#1f2436] bg-[#0d1422] p-4 space-y-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-end gap-3">
          <div className="relative flex-1">
            {isLoading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="absolute left-3 top-3 text-white/40"
              >
                <HiOutlineRefresh className="text-xl" />
              </motion.div>
            )}

            <textarea
              value={safeValue}
              onChange={onChange}
              placeholder="Share a thought or ask @ai for help..."
              className="min-h-[56px] w-full resize-none border border-[#272e44] bg-[#090f1e] py-3 pl-11 pr-4 text-sm text-white/90 focus:border-[#135bec] focus:outline-none focus:ring-2 focus:ring-[#135bec]/30"
              maxLength={maxLength}
              disabled={disabled || isLoading}
              onKeyDown={handleKeyDown}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSendDisabled}
            className={`border px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-white transition ${
              isSendDisabled
                ? "border-[#2f3b56] bg-[#1b2337] cursor-not-allowed opacity-60"
                : "border-[#135bec] bg-[#135bec] hover:bg-[#1a6bff]"
            }`}
            aria-label="Send message"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isLoading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <HiOutlineRefresh className="animate-spin text-lg" />
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <IoSend className="text-lg" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <div className="flex items-center justify-between text-[12px]">
          <p
            className={`${
              errorMessage ? "text-rose-300" : "text-white/60"
            } leading-tight`}
          >
            {helperCopy}
          </p>
          {counterMeta && (
            <span className={`font-semibold ${counterMeta.tone}`}>
              {counterMeta.used}/{counterMeta.max}
            </span>
          )}
        </div>
      </motion.form>
    );
  }
);

export default ChatInput;
