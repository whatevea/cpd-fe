import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import localforage from "localforage";

const STORAGE_NAME = "cpd2_app";
const STORAGE_STORE = "user_store";
const STORAGE_KEY = "user_store_state";

const UserStoreContext = createContext(null);

const storage = localforage.createInstance({
  name: STORAGE_NAME,
  storeName: STORAGE_STORE,
  description: "User session data and cached chat messages",
});

const MAX_CACHED_MESSAGES = 150;

const createInitialState = () => ({
  user: { user: null, userPoints: 0 },
  messages: [],
  isAuthenticated: false,
});

function useUserStoreState() {
  const [state, setState] = useState(createInitialState());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const saved = await storage.getItem(STORAGE_KEY);

        if (saved && !cancelled) {
          setState((prev) => ({
            ...prev,
            ...saved,
            messages: clampMessages(
              dedupeMessages(Array.isArray(saved.messages) ? saved.messages : [])
            ),
          }));
        }
      } catch (error) {
        console.error("Failed to hydrate user store", error);
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    storage.setItem(STORAGE_KEY, state).catch((error) => {
      console.error("Failed to persist user store", error);
    });
  }, [state, isHydrated]);

  const appendMessage = useCallback((message) => {
    setState((prev) => ({
      ...prev,
      messages: clampMessages(
        dedupeMessages([message, ...(prev.messages || [])])
      ),
    }));
  }, []);

  const setMessages = useCallback((messages, options = { mode: "replace" }) => {
    const incoming = Array.isArray(messages) ? messages : [];

    setState((prev) => {
      const merged =
        options?.mode === "append"
          ? [...(prev.messages || []), ...incoming]
          : incoming;

      return {
        ...prev,
        messages: clampMessages(dedupeMessages(merged)),
      };
    });
  }, []);

  const setUser = useCallback((userData) => {
    setState((prev) => ({
      ...prev,
      user: userData,
      isAuthenticated: Boolean(userData),
    }));
  }, []);

  const clearUser = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: null,
      isAuthenticated: false,
    }));
  }, []);

  const updateUser = useCallback((updates) => {
    setState((prev) => ({
      ...prev,
      user: { ...(prev.user || {}), ...updates },
    }));
  }, []);

  const updateGamePoints = useCallback((points) => {
    setState((prev) => {
      const currentUser = prev.user || {};
      const nestedUser = currentUser.user || {};

      return {
        ...prev,
        user: {
          ...currentUser,
          user: {
            ...nestedUser,
            userPoints: points,
          },
        },
      };
    });
  }, []);

  const updateUserName = useCallback((name) => {
    setState((prev) => {
      const currentUser = prev.user || {};
      const nestedUser = currentUser.user || {};

      return {
        ...prev,
        user: {
          ...currentUser,
          user: {
            ...nestedUser,
            username: name,
          },
        },
      };
    });
  }, []);

  return useMemo(
    () => ({
      ...state,
      isHydrated,
      appendMessage,
      setMessages,
      setUser,
      clearUser,
      updateUser,
      updateGamePoints,
      updateUserName,
    }),
    [
      state,
      isHydrated,
      appendMessage,
      setMessages,
      setUser,
      clearUser,
      updateUser,
      updateGamePoints,
      updateUserName,
    ]
  );
}

export function UserStoreProvider({ children }) {
  const value = useUserStoreState();

  return (
    <UserStoreContext.Provider value={value}>
      {children}
    </UserStoreContext.Provider>
  );
}

export default function useUserStore() {
  const context = useContext(UserStoreContext);

  if (context === null) {
    throw new Error("useUserStore must be used within a UserStoreProvider");
  }

  return context;
}

const normalizeMessage = (message) => {
  if (!message || typeof message !== "object") return null;
  const normalized = { ...message };

  if (!normalized.createdAt) {
    normalized.createdAt = new Date().toISOString();
  }

  return normalized;
};



const getMessageKey = (message) =>
  message?._id || message?.tempId || message?.createdAt;

const dedupeMessages = (list = []) => {
  const seen = new Set();
  const normalized = [];

  list.forEach((item) => {
    const normalizedItem = normalizeMessage(item);
    if (!normalizedItem) return;
    const key = getMessageKey(normalizedItem);
    if (key && seen.has(key)) return;
    if (key) {
      seen.add(key);
    }
    normalized.push(normalizedItem);
  });

  return normalized.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const clampMessages = (list) => list.slice(0, MAX_CACHED_MESSAGES);

// {
//   "user": {
//     "_id": "678ca5e9a8ea85bca01866ac",
//     "username": "mgcsandip",
//     "oauthProvider": "lichess",
//     "preferences": {
//       "theme": "light",
//       "sound": "on",
//       "language": "en"
//     },
//     "lichessUsername": "mgcsandip",
//     "userAuthencityScore": 67,
//     "userPoints": 560,
//     "createdAt": "2025-01-19T07:12:41.122Z",
//     "updatedAt": "2025-01-24T17:57:11.528Z",
//     "__v": 0,
//     "hash": "",
//     "lastGameType": "",
//     "pointsIncPerDay": 5
//   },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGNhNWU5YThlYTg1YmNhMDE4NjZhYyIsInVzZXJuYW1lIjoibWdjc2FuZGlwIiwibGljaGVzc1VzZXJuYW1lIjoibWdjc2FuZGlwIiwiaWF0IjoxNzM3NzgxOTA1LCJleHAiOjE3MzgzODY3MDV9.OrhuwwJv-VihlXf_C8hLA7Mf6TMd28pWX6NXuaKNkK4"
// }
