import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCalendarOutline, IoCheckmarkCircle } from "react-icons/io5";
import { GiTwoCoins, GiGoldBar } from "react-icons/gi";
import useUserStore from "../storage/userInfo";
import { apiFetch } from "@/app/utils/apiClient";

export default function CollectCoin() {
  const { user, isAuthenticated, updateGamePoints } = useUserStore();
  const coinProgression = [1, 1, 1, 1, 1, 5, 5];

  const [isCollecting, setIsCollecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [didCheckoutToday, setDidCheckoutToday] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user checkout data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCheckoutData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch checkout data from API
  const fetchCheckoutData = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/api/checkout", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStreak(data.checkoutDayStreak);
        setDidCheckoutToday(data.didCheckoutToday);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load checkout data");
      console.error("Error fetching checkout data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate days based on streak
  const getDays = () => {
    return coinProgression.map((reward, index) => ({
      day: `Day ${index + 1}`,
      collected: index < streak,
      reward,
    }));
  };

  // Perform checkout API call
  const checkoutToday = async () => {
    setIsCollecting(true);
    setError(null);

    try {
      const response = await apiFetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Refresh data after successful checkout to get updated streak
        await fetchCheckoutData();
        updateGamePoints(data?.totalCoins);

        return true;
      } else {
        setError(data.message);
        return false;
      }
    } catch (err) {
      setError("Failed to collect today's reward");
      console.error("Error during checkout:", err);
      return false;
    } finally {
      setIsCollecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-5 rounded-xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-lg flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#819d25] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-3xl mx-auto p-5 rounded-xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-lg">
        <div className="text-center text-red-400">
          <p>Please log in to collect daily rewards</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-5 rounded-xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-primary_white mb-1">
          Daily Coin Rewards
        </h2>
        <motion.div
          className="flex items-center justify-center gap-2 text-[#819d25] font-bold text-sm"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.2,
          }}
        >
          <IoCalendarOutline className="text-lg" />
          <span>Current Streak: {streak} days</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {getDays().map((day, index) => (
          <motion.div
            key={index}
            className={`relative flex flex-col items-center justify-center p-2 rounded-lg border ${
              day.collected
                ? "bg-gradient-to-br from-[#819d25]/30 to-[#91b12a]/30 border-[#819d25]"
                : "bg-white/5 border-white/10"
            }`}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="text-xs text-light_white mb-1">{day.day}</div>

            <motion.div
              className="relative"
              animate={
                day.collected
                  ? {
                      y: [0, -3, 0],
                    }
                  : {}
              }
              transition={
                day.collected
                  ? {
                      repeat: Infinity,
                      duration: 1.5,
                    }
                  : {}
              }
            >
              {day.reward > 1 ? (
                <div className="relative">
                  <img
                    src="/media/coin3d5Piece.png"
                    alt="5 coins"
                    className="h-10 w-10 object-contain"
                  />
                  <div className="absolute -top-1 -right-1 bg-[#819d25] text-xs font-bold text-black rounded-full h-4 w-4 flex items-center justify-center">
                    {day.reward}
                  </div>
                </div>
              ) : (
                <img
                  src="/media/coin3dPiece.png"
                  alt="1 coin"
                  className="h-10 w-10 object-contain"
                />
              )}
            </motion.div>

            {day.collected && (
              <motion.div
                className="absolute -top-1 -right-1 text-[#819d25] bg-black rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <IoCheckmarkCircle className="text-sm" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          {streak < 7 ? (
            !didCheckoutToday ? (
              <motion.button
                onClick={checkoutToday}
                disabled={isCollecting}
                className="bg-gradient-to-r from-[#819d25] to-[#91b12a] text-primary_black font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-[#819d25]/50 transition-all disabled:opacity-70"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {isCollecting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary_black border-t-transparent rounded-full"></div>
                    <span>Collecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <GiTwoCoins className="text-lg" />
                    <span>Collect Today's Reward</span>
                  </div>
                )}
              </motion.button>
            ) : (
              <motion.div
                className="bg-yellow-300 text-black font-bold px-6 py-2.5 rounded-full border border-yellow-400 flex items-center gap-2 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <IoCheckmarkCircle className="text-lg" />
                <span>Already Collected Today!</span>
              </motion.div>
            )
          ) : (
            <motion.div
              className="bg-white/10 backdrop-blur-sm text-light_white font-bold px-6 py-2.5 rounded-full border border-[#819d25]/30 flex items-center gap-2 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <GiGoldBar className="text-[#819d25] text-lg" />
              <span>Maximum streak reached! Come back tomorrow.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {streak >= 5 && (
        <motion.div
          className="mt-5 p-3 rounded-lg bg-gradient-to-r from-[#819d25]/20 to-[#91b12a]/20 border border-[#819d25]/30 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
        >
          <div className="text-[#819d25] font-bold text-sm mb-0.5">
            Streak Bonus Unlocked!
          </div>
          <p className="text-light_white text-xs">
            You've maintained a {streak}-day streak! Keep it up for even bigger
            rewards.
          </p>
        </motion.div>
      )}
    </div>
  );
}
