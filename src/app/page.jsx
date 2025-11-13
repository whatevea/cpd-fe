import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { MdOutlineGridView } from "react-icons/md";
import { IoExtensionPuzzle } from "react-icons/io5";
import { FaEye, FaBrain, FaCalculator } from "react-icons/fa";
import { TbSparkles } from "react-icons/tb";
import ChatSidebar from "@/app/components/Chat/ChatSidebar";
import { gamesList } from "@/app/constants/gameConfig";

const categories = ["All", "Standard", "Atypical"];

const tagIconMap = {
  visualisation: FaEye,
  memory: FaBrain,
  intuition: TbSparkles,
  math: FaCalculator,
};

const tagLabel = (label) => label.toLowerCase();

const TagIconChip = ({ label }) => {
  const Icon = tagIconMap[tagLabel(label)] || IoExtensionPuzzle;
  return (
    <span
      className="group relative flex size-9 items-center justify-center border border-[#282e39] bg-[#151b2e] text-gray-300 transition hover:border-[#135bec] hover:text-white"
    >
      <Icon className="text-base" />
      <span className="pointer-events-none absolute -bottom-8 bg-black/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white opacity-0 transition group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
};

const GameCard = ({ game }) => (
  <Link to={game.path} className="block">
    <motion.article
      whileHover={{ y: -2 }}
      className="flex h-full flex-col border border-[#282e39] bg-[#151b2e] p-5 shadow-[0_10px_40px_rgba(2,4,14,0.45)] transition hover:border-[#3c4a6b]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>

          <h3 className="text-xl font-semibold text-white">
            {game.title}
          </h3>
        </div>
        <span className="border border-[#2b3246] bg-[#0d1426] p-2 text-gray-400">
          <MdOutlineGridView className="text-xl" />
        </span>
      </div>

      <div className="mt-4 border border-[#282e39] bg-black/30">
        <img
          src={game.coverPhoto}
          alt={game.title}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      </div>

      <p className="mt-4 text-sm text-gray-300">
        {game.cardDescription}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {game.tags.map((tag) => (
          <TagIconChip key={`${game.slug}-${tag}`} label={tag} />
        ))}
      </div>
    </motion.article>
  </Link>
);

const EmptyState = () => (
  <div className="border border-dashed border-[#282e39] bg-[#151c2d] p-12 text-center">
    <p className="text-2xl font-semibold text-white">
      No puzzles found
    </p>
    <p className="mt-2 text-white/60">
      Try a different search term or switch categories to explore more
      modes.
    </p>
  </div>
);

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredGames = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return gamesList.filter((game) => {
      const matchesCategory =
        activeCategory === "All" || game.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        game.title.toLowerCase().includes(normalizedSearch) ||
        game.cardDescription.toLowerCase().includes(normalizedSearch) ||
        game.tags.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch)
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#101622] text-white">
      <main className="mx-auto flex w-full flex-col gap-8 px-4 pb-12 pt-28 lg:grid lg:w-[90%] lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:px-0 xl:w-[80%]">
        <section className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-4xl font-black tracking-tight text-white">
              Puzzle Library
            </h1>
            <div className="w-full max-w-sm border border-[#282e39] bg-[#1c1f27]">
              <label className="flex items-center">
                <span className="px-4 text-[#9da6b9]">
                  <FiSearch />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search puzzles"
                  className="h-11 w-full bg-transparent text-sm text-white placeholder:text-[#9da6b9] focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 border-b border-[#282e39]">
            <div className="flex gap-8">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`pb-3 pt-4 text-sm font-bold tracking-[0.03em] transition ${isActive
                      ? "border-b-[3px] border-[#135bec] text-white"
                      : "border-b-[3px] border-transparent text-gray-400 hover:text-white"
                      }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            {filteredGames.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredGames.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="w-full lg:col-start-2 lg:row-start-1">
          <ChatSidebar />
        </aside>
      </main>
    </div>
  );
}
