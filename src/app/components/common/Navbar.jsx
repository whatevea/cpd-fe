import { Link } from "react-router-dom";
import { useState } from "react";
import {
  IoMenuOutline,
  IoCloseOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import useUserStore from "@/app/storage/userInfo";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, clearUser } = useUserStore();

  const navLinks = [
    { label: "Puzzles", to: "/" },
    { label: "Leaderboard", to: "/profile" },
    { label: "Learn", to: "/mix-tactics" },
    { label: "Community", to: "/chat" },
  ];

  const handleLogout = () => {
    clearUser();
    setIsProfileOpen(false);
  };

  const NavItem = ({ to, children }) => (
    <Link to={to} onClick={() => setIsOpen(false)}>
      <motion.div
        whileHover={{ y: -2 }}
        className="px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-gray-300 transition hover:text-white"
      >
        {children}
      </motion.div>
    </Link>
  );

  const MobileNavItem = ({ to, children }) => (
    <Link to={to} onClick={() => setIsOpen(false)}>
      <motion.div
        whileHover={{ x: 4 }}
        className="border-b border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-300"
      >
        {children}
      </motion.div>
    </Link>
  );

  return (
    <motion.nav className="fixed top-0 left-0 z-50 w-full border-b border-[#282e39] bg-[#101622]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 lg:w-[85%] xl:w-[80%]">
        <div className="flex h-20 items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center bg-[#135bec] text-lg font-black text-white">
              CP
            </div>
            <div>
              <p className="text-white text-lg font-semibold tracking-tight leading-none">
                Chess Puzzles
              </p>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                Training Lab
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <NavItem key={link.label} to={link.to}>
                {link.label}
              </NavItem>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ y: -1 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-4 border border-[#2a3146] bg-[#161b2a] px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.3em] text-white"
                >
                  <div className="text-left">
                    <p className="text-sm font-semibold tracking-wide text-white">
                      {user.user.username}
                    </p>
                    <p className="text-xs text-gray-400">Account</p>
                  </div>
                  <div className="text-xs font-semibold text-[#a6b1d5]">
                    {user.user.userPoints} pts
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-48 border border-[#282e39] bg-[#11182c] text-sm text-gray-200"
                    >
                      <Link to="/profile">
                        <div className="flex items-center justify-between border-b border-[#1d2438] px-4 py-3 hover:bg-[#1a2236]">
                          <span>Settings</span>
                          <IoSettingsOutline />
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#1a2236]"
                      >
                        <span>Logout</span>
                        <IoLogOutOutline />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/account">
                <motion.button
                  whileHover={{ y: -1 }}
                  className="border border-[#2a3146] bg-[#135bec] px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-white"
                >
                  Sign In
                </motion.button>
              </Link>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden border border-[#2a3146] p-2 text-white"
          >
            {isOpen ? (
              <IoCloseOutline className="h-6 w-6" />
            ) : (
              <IoMenuOutline className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#282e39] bg-[#0b111f]"
          >
            <div className="px-4 py-4">
              {isAuthenticated && (
                <div className="border border-[#282e39] bg-[#101622] px-4 py-3 text-white">
                  <p className="text-sm font-semibold">{user.user.username}</p>
                  <p className="text-xs text-gray-400">
                    {user.user.userPoints} pts
                  </p>
                </div>
              )}

              <div className="mt-4 space-y-0">
                {navLinks.map((link) => (
                  <MobileNavItem key={link.label} to={link.to}>
                    {link.label}
                  </MobileNavItem>
                ))}
              </div>

              <div className="mt-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full border border-[#282e39] bg-[#161b2a] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/account">
                    <button className="w-full border border-[#2a3146] bg-[#135bec] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
