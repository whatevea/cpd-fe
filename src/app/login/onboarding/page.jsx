import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/app/storage/userInfo";
import { apiFetch } from "@/app/utils/apiClient";

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUserName } = useUserStore();

  if (!user?.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Please log in before completing onboarding.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/updateusername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      updateUserName(username);
      setIsCompleted(true);
      setLoading(false);
    } catch (err) {
      setError("Failed to update username");
      setLoading(false);
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Choose your username to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={5}
                maxLength={20}
                pattern="^[a-zA-Z0-9_]+$"
                title="Username can only contain letters, numbers, and underscores"
                disabled={isCompleted}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {isCompleted && (
            <div className="text-green-500 text-sm text-center">
              Username updated successfully!
            </div>
          )}

          {isCompleted ? (
            <button
              type="button"
              onClick={handleNavigateHome}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Go to Homepage
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Username"}
              </button>
              <button
                className=" group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNavigateHome}
              >
                Skip (keep default)
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
