import { useEffect, useState } from "react";
import {
  FiClock,
  FiRefreshCw,
  FiAward,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { apiFetch } from "@/app/utils/apiClient";
import { usePageMetadata } from "@/app/hooks/usePageMetadata";

const LEADERBOARD_API_URL = `${import.meta.env.VITE_API_URL}/api/leaderboard`;
const LEADERBOARD_CACHE_KEY = "cpd::leaderboardCache";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const getRowBgClass = (rank) => {
  if (rank === 1) return "bg-gradient-to-r from-yellow-500/30 to-yellow-500/10 hover:from-yellow-500/40 hover:to-yellow-500/20 border-l-4 border-yellow-500";
  if (rank === 2) return "bg-gradient-to-r from-slate-300/20 to-slate-300/5 hover:from-slate-300/30 hover:to-slate-300/15 border-l-4 border-slate-300";
  if (rank === 3) return "bg-gradient-to-r from-orange-500/25 to-orange-500/10 hover:from-orange-500/35 hover:to-orange-500/20 border-l-4 border-orange-500";
  return "hover:bg-[#1a2340]";
};

const getRankMedal = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Never";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString();
};

const readLeaderboardCache = () => {
  if (typeof window === "undefined") return null;
  try {
    const rawValue = window.localStorage.getItem(LEADERBOARD_CACHE_KEY);
    if (!rawValue) return null;
    const parsed = JSON.parse(rawValue);
    if (!parsed || !Array.isArray(parsed.users)) return null;
    if (typeof parsed.cachedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeLeaderboardCache = (users) => {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      users,
      cachedAt: Date.now(),
    };
    window.localStorage.setItem(
      LEADERBOARD_CACHE_KEY,
      JSON.stringify(payload)
    );
  } catch {
    // Ignore cache write failures (private mode/storage limits).
  }
};

const sortUsersByPoints = (users) =>
  [...users].sort((a, b) => Number(b.userPoints || 0) - Number(a.userPoints || 0));

async function fetchLeaderboardFromApi() {
  const response = await apiFetch(LEADERBOARD_API_URL, { method: "GET" });
  if (!response.ok) {
    throw new Error("Unable to load leaderboard data.");
  }
  const payload = await response.json();
  if (!payload?.success || !Array.isArray(payload.users)) {
    throw new Error("Leaderboard response format is invalid.");
  }
  return sortUsersByPoints(payload.users);
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  usePageMetadata({
    title: "Leaderboard",
    description:
      "Track top Chess Puzzle Directory players and compare puzzle points across the community.",
  });

  useEffect(() => {
    let isMounted = true;

    const loadLeaderboard = async () => {
      const cached = readLeaderboardCache();
      const hasFreshCache =
        cached && Date.now() - cached.cachedAt < ONE_DAY_MS;

      if (hasFreshCache) {
        setUsers(sortUsersByPoints(cached.users));
        setLastUpdatedAt(cached.cachedAt);
        setIsLoading(false);
        return;
      }

      try {
        const freshUsers = await fetchLeaderboardFromApi();
        if (!isMounted) return;
        setUsers(freshUsers);
        setLastUpdatedAt(Date.now());
        setError("");
        writeLeaderboardCache(freshUsers);
      } catch (fetchError) {
        if (!isMounted) return;
        if (cached) {
          setUsers(sortUsersByPoints(cached.users));
          setLastUpdatedAt(cached.cachedAt);
          setError("Showing cached leaderboard data. Live update failed.");
        } else {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Something went wrong while loading leaderboard."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLeaderboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#101622] text-white">
      <main className="mx-auto w-full px-4 pb-12 pt-28 lg:w-[85%] xl:w-[80%]">
        <section className="border border-[#282e39] bg-gradient-to-b from-[#1a2340] to-[#151b2e] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <FiAward className="text-3xl text-yellow-400" />
                <h1 className="text-4xl font-black tracking-tight text-white">
                  Leaderboard
                </h1>
              </div>
              <p className="mt-2 text-sm text-[#9da6b9]">
                🎯 Ranked by puzzle points across the CPD community.
              </p>
            </div>
            <p className="inline-flex items-center gap-2 border border-[#2b3246] bg-[#0d1426] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[#9da6b9]">
              <FiClock />
              Updated {formatTimestamp(lastUpdatedAt)}
            </p>
          </div>

          {isLoading ? (
            <div className="mt-8 border border-dashed border-[#2b3246] bg-[#0d1426] p-8 text-sm text-[#9da6b9]">
              Loading leaderboard...
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-6 inline-flex items-center gap-2 border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-amber-200">
                  <FiRefreshCw />
                  {error}
                </div>
              )}

              <div className="mt-6 overflow-hidden border border-[#282e39]">
                <table className="min-w-full divide-y divide-[#282e39] text-left">

                  <tbody className="divide-y divide-[#242b3f] bg-[#11182c]">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-sm text-[#9da6b9]"
                        >
                          No leaderboard data found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => {
                        const rank = index + 1;
                        const medal = getRankMedal(rank);
                        const isTopThree = rank <= 3;
                        return (
                          <tr
                            key={user._id || `${user.username}-${index}`}
                            className={`transition ${getRowBgClass(rank)}`}
                          >
                            <td className={`px-4 py-4 text-sm font-bold ${isTopThree ? "text-white" : "text-[#9da6b9]"
                              }`}>
                              <span className="flex items-center gap-2">
                                {medal && <span className="text-xl">{medal}</span>}
                                <span>#{rank}</span>
                              </span>
                            </td>
                            <td className={`px-4 py-4 text-sm font-semibold ${isTopThree ? "text-white" : "text-gray-300"
                              }`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${rank === 1 ? "bg-yellow-500/40" : rank === 2 ? "bg-slate-400/40" : rank === 3 ? "bg-orange-500/40" : "bg-[#2b3246]"
                                  }`}>
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                {user.username}
                              </div>
                            </td>
                            <td className={`px-4 py-4 text-sm font-bold ${isTopThree ? "text-white" : "text-[#a9b7e6]"
                              }`}>
                              <div className="flex items-center gap-1">
                                <FiZap className={isTopThree ? "text-yellow-400" : "text-cyan-400"} />
                                {Number(user.userPoints || 0).toLocaleString()}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
