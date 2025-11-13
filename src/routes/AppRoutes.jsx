import { Routes, Route } from "react-router-dom";
import HomePage from "@/app/page";
import ChatPage from "@/app/chat/page";
import MixTacticsPage from "@/app/(games)/mix-tactics/page";
import BlindTacticsPage from "@/app/(games)/blind-tactics/page";
import GuessTheSquarePage from "@/app/(games)/guess-the-square/page";
import ZeroSumGamePage from "@/app/(games)/zero-sum-game/page";
import AccountPage from "@/app/account/page";
import GoogleLoginPage from "@/app/login/google/page";
import LichessLoginPage from "@/app/login/lichess/page";
import OnboardingPage from "@/app/login/onboarding/page";
import ProfilePage from "@/app/profile/page";
import { gamesList } from "@/app/constants/gameConfig";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#092327] text-white">
    <div className="text-center space-y-4 px-4">
      <p className="text-5xl font-bold text-[#819d25]">404</p>
      <p className="text-lg">The move you tried is off the board.</p>
    </div>
  </div>
);

const gameComponents = {
  "mix-tactics": MixTacticsPage,
  "blind-tactics": BlindTacticsPage,
  "guess-the-square": GuessTheSquarePage,
  "zero-sum-game": ZeroSumGamePage,
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/chat" element={<ChatPage />} />
    {gamesList.map((game) => {
      const Component = gameComponents[game.slug];
      if (!Component) return null;
      return (
        <Route
          key={game.slug}
          path={game.path}
          element={<Component />}
        />
      );
    })}
    <Route path="/account" element={<AccountPage />} />
    <Route path="/login/google" element={<GoogleLoginPage />} />
    <Route path="/login/lichess" element={<LichessLoginPage />} />
    <Route path="/login/onboarding" element={<OnboardingPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
