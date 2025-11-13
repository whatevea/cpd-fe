import { motion, AnimatePresence } from "framer-motion";

export const NumberedSquare = ({ number, squareSize }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex items-center justify-center rounded-full 
                   bg-gradient-to-br from-blue-900 to-orange-800
                   text-white font-bold
                   shadow-lg hover:shadow-2xl shadow-green-900/20"
        style={{
          width: squareSize * 0.65,
          height: squareSize * 0.65,
          fontSize: squareSize * 0.4,
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: 1,
          rotate: 0,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
          },
        }}
        exit={{
          scale: 0,
          rotate: 180,
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        whileHover={{
          scale: 1.15,
          rotate: 5,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
          },
        }}
        whileTap={{ scale: 0.95 }}
      >
        {number}
      </motion.div>
    </AnimatePresence>
  );
};
