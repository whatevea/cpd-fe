import { Link } from "react-router-dom";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FiLock } from "react-icons/fi";
import useUserStore from "@/app/storage/userInfo";
import ChatMain from "@/app/components/Chat/ChatMain";

const benefitHighlights = [
  "Ping @ai for instant strategic guidance on any position.",
  "Crowdsource ideas by dropping puzzles, studies, or game links.",
  "Enjoy realtime delivery powered by Pusher with smart caching.",
];

export default function ChatPage() {
  const { isAuthenticated } = useUserStore();

  if (isAuthenticated) {
    return <ChatMain />;
  }

  return (
    <div className="min-h-screen bg-[#092327] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center text-white space-y-6 shadow-2xl">
        <div className="flex flex-col items-center gap-2">
          <FiLock className="text-4xl text-[#819d25]" />
          <h2 className="text-3xl font-bold">Login to join the conversation</h2>
          <p className="text-white/70 text-sm">
            Sign in with Google or Lichess to unlock the new realtime chat
            experience, AI replies, and profile-linked shoutouts.
          </p>
        </div>

        <div className="bg-black/20 border border-white/10 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <IoChatbubbleEllipses className="text-[#819d25]" />
            Why you&apos;ll love it
          </div>
          <ul className="text-sm text-white/80 space-y-2 list-disc list-inside">
            {benefitHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <Link
          to="/account"
          className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#819d25] to-[#9bd131] text-black font-semibold py-3 rounded-full hover:opacity-90 transition"
        >
          Go to login
        </Link>

        <p className="text-xs text-white/60">
          Heads up: chat is moderated and linked to your player profile for a
          safer community experience.
        </p>
      </div>
    </div>
  );
}
