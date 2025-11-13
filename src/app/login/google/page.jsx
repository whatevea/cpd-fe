import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import userStore from "@/app/storage/userInfo";
import { apiFetch } from "@/app/utils/apiClient";

export default function Page() {
  const navigate = useNavigate();
  const { setUser } = userStore();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [loadingState, setLoadingState] = useState("verifying");

  useEffect(() => {
    const verify_auth = async () => {
      if (!code) {
        setLoadingState("error");
        return;
      }

      try {
        const response = await apiFetch(`/api/login_google/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });
        const data = await response.json();

        if (data.success) {
          console.log("data", data);
          const userStoreData = { user: data.user, token: data.token };
          setUser(userStoreData);
          setLoadingState("success");

          // Short delay to show success message before redirecting
          setTimeout(() => {
            const target = data.isNew ? "/login/onboarding" : "/";
            navigate(target);
          }, 1500);
        } else {
          setLoadingState("error");
        }
      } catch (error) {
        console.error("Google auth error:", error);
        setLoadingState("error");
      }
    };
    
    verify_auth();
  }, [code, setUser, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Chess Zero</h1>

        {loadingState === "verifying" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
            <p className="text-xl">Authenticating with Google...</p>
            <p className="text-sm text-gray-400 mt-2">
              Please wait while we verify your Google credentials
            </p>
          </>
        )}

        {loadingState === "success" && (
          <>
            <div className="flex justify-center mb-6 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-xl text-green-400">Google Login Successful!</p>
            <p className="text-sm text-gray-400 mt-2">
              Redirecting you to the dashboard...
            </p>
          </>
        )}

        {loadingState === "error" && (
          <>
            <div className="flex justify-center mb-6 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-xl text-red-400">Google Authentication Failed</p>
            <p className="text-sm text-gray-400 mt-2">
              Unable to authenticate with Google. Please try again.
            </p>
            <button
              onClick={() => navigate("/account")}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
