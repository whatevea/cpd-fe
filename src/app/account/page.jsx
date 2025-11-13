import useUserStore from "../storage/userInfo";
import { FcGoogle } from "react-icons/fc";
import { redirectToApi } from "@/app/utils/apiClient";

export default function Account() {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full p-6 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Welcome to CPD</h2>
            <p className="mt-2 text-gray-400">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => redirectToApi("/api/login_google")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </button>

            <button
              onClick={() => redirectToApi("/api/login_lichess")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <img
                src="/media/lichesslogo.svg"
                alt="Lichess"
                width={20}
                height={20}
                className="invert"
              />
              Sign in with Lichess
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>Choose your preferred login method to access all features</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold">Account Dashboard</h1>
      {/* Add authenticated user content here */}
    </div>
  );
}
