import { useEffect, useState } from "react";
import { FaCog, FaCheck, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export const WinDialog = ({ copied, onShare, onNextLevel, getTime }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-6 text-center text-white shadow-[0_25px_60px_rgba(0,0,0,0.65)]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <motion.h2
          className="text-2xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Level complete
        </motion.h2>

        <motion.p
          className="mt-3 text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Solved in{" "}
          <span className="font-semibold text-[#8ee1b7]">{getTime()}</span>{" "}
          seconds.
        </motion.p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <motion.button
            onClick={onShare}
            className="inline-flex flex-1 items-center justify-center gap-2 border border-[#8ab4ff] bg-[#8ab4ff] px-4 py-3 text-sm font-bold uppercase tracking-[0.3em] text-[#071221] transition hover:bg-[#9dc1ff]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {copied ? (
              <>
                <FaCheck />
                Copied
              </>
            ) : (
              <>
                <FaCog className="animate-spin-slow" />
                Share
              </>
            )}
          </motion.button>

          <motion.button
            onClick={onNextLevel}
            className="inline-flex flex-1 items-center justify-center gap-2 border border-[#8ee1b7] bg-[#8ee1b7] px-4 py-3 text-sm font-bold uppercase tracking-[0.3em] text-[#041019] transition hover:bg-[#9ef2c5]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Next level
            <FaArrowRight />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
