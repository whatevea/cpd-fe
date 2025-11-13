import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import useUserStore from "@/app/storage/userInfo";
import { motion, AnimatePresence } from "framer-motion";
import { IoChatbubbleEllipses, IoWarningOutline } from "react-icons/io5";
import {
  FiChevronDown,
  FiAlertTriangle,
  FiWifiOff,
  FiRefreshCcw,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import ChatInput from "./ChatInput";
import { Centrifuge } from "centrifuge";
import MessageBubble from "./MessageBubble";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "@/app/utils/apiClient";

const MESSAGE_CHAR_LIMIT = 600;
const BACKGROUND_REFRESH_MS = 45_000;

const CONNECTION_META = {
  connected: {
    label: "Live updates on",
    tone: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  connecting: {
    label: "Connecting…",
    tone: "text-amber-200",
    dot: "bg-amber-300",
  },
  unavailable: {
    label: "Realtime temporarily unavailable",
    tone: "text-amber-200",
    dot: "bg-amber-400",
  },
  failed: {
    label: "Realtime connection failed",
    tone: "text-rose-300",
    dot: "bg-rose-500",
  },
  disconnected: {
    label: "Offline",
    tone: "text-rose-300",
    dot: "bg-rose-400",
  },
};

export default function Chat({ variant = "auto" }) {
  const location = useLocation();
  const { user, isAuthenticated, messages, setMessages, appendMessage } =
    useUserStore();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [connectionState, setConnectionState] = useState("disconnected"); // Initial state for Centrifugo
  const centrifugeRef = useRef(null);
  const subscriptionRef = useRef(null);
  const [meta, setMeta] = useState({
    hasMore: false,
    nextCursor: null,
    latestMessageId: messages[0]?._id || null,
  });
  const [isAutoscrollLocked, setIsAutoscrollLocked] = useState(false);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const channelRef = useRef(null);
  // This ref is used to prevent autoscroll when user scrolls up
  const autoScrollLockRef = useRef(false);

  const loggedInUserName = user?.user?.username;
  const loggedInUserId = user?.user?._id;
  const isFullPage =
    variant === "full" ||
    (variant === "auto" && location.pathname === "/chat");
  const isPanel = variant === "panel";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const buildSocketUrl = useCallback(() => {
    const raw = import.meta.env.VITE_CHAT_SERVER;
    if (!raw) return null;
    const trimmed = raw.endsWith("/") ? raw.slice(0, -1) : raw;
    const normalized = trimmed.startsWith("ws")
      ? trimmed
      : trimmed.replace(/^http/, "ws");
    return normalized.includes("/connection/")
      ? normalized
      : `${normalized}/connection/websocket`;
  }, []);

  const getCentrifugoAuthToken = useCallback(async () => {
    // For unauthenticated users, we can get a public token.
    // The backend should handle this and provide a token for a public channel.
    const response = await apiFetch("/api/chat/get_connection_token", {
      headers: {
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
      },
    });
    const data = await response.json();
    return data.token;
  }, [user?.token, isAuthenticated]);

  useEffect(() => {
    autoScrollLockRef.current = isAutoscrollLocked;
  }, [isAutoscrollLocked]);

  const handleScroll = () => {
    const element = chatBodyRef.current;
    if (!element) return;
    const isNearBottom =
      element.scrollHeight - (element.scrollTop + element.clientHeight) < 72;
    setIsAutoscrollLocked(!isNearBottom);
  };

  const fetchMessages = useCallback(
    async ({ cursor, silent } = {}) => {
      if (!cursor && !silent) {
        setIsFetching(true);
        setFetchError("");
      }
      if (cursor) {
        setIsFetchingOlder(true);
      }
      try {
        const response = await apiFetch(
          `/api/chat/getMessages${cursor ? `?before=${cursor}` : ""}`,
          {
            headers: {
              ...(user?.token && { Authorization: `Bearer ${user.token}` }),
              ...(meta.latestMessageId && !cursor
                ? { "If-None-Match": meta.latestMessageId }
                : {}),
            },
            cache: "no-store",
          }
        );

        if (response.status === 304) {
          return;
        }

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => null);
          throw new Error(
            errorPayload?.message || "Unable to load messages right now."
          );
        }

        const payload = await response.json();
        const incoming = Array.isArray(payload?.messages)
          ? payload.messages
          : [];

        setMessages(incoming, { mode: cursor ? "append" : "replace" });

        setMeta((prev) => ({
          hasMore: Boolean(payload?.meta?.hasMore),
          nextCursor: payload?.meta?.nextCursor || null,
          latestMessageId:
            !cursor && payload?.meta?.latestMessageId
              ? payload.meta.latestMessageId
              : prev.latestMessageId,
        }));

        if (!cursor && !autoScrollLockRef.current) {
          requestAnimationFrame(scrollToBottom);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        if (!cursor) {
          setFetchError(error.message || "Unable to load messages.");
        }
      } finally {
        if (!cursor && !silent) {
          setIsFetching(false);
        }
        if (cursor) {
          setIsFetchingOlder(false);
        }
      }
    },
    [user?.token, meta.latestMessageId, scrollToBottom, setMessages, isAuthenticated]
  );

  const sendMessage = async (event) => {
    event?.preventDefault();
    if (!newMessage.trim() || !user?.token || isLoading) return;

    setSubmitError("");
    setIsLoading(true);

    try {
      const response = await apiFetch("/api/chat/sendMessage", {
        method: "POST",
        body: JSON.stringify({ message: newMessage }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(
          errorPayload?.message || "Message failed to send. Please retry."
        );
      }

      setNewMessage("");
      if (autoScrollLockRef.current === true) {
        setIsAutoscrollLocked(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setSubmitError(error.message || "Unable to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const intervalId = setInterval(
      () => fetchMessages({ silent: true }),
      BACKGROUND_REFRESH_MS
    );

    const handleFocus = () => fetchMessages({ silent: true });
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchMessages]);

  // Setup Centrifugo realtime updates and connection state tracking
  useEffect(() => {
    if (!isAuthenticated) {
      // Ensure cleanup if user logs out or token is unavailable
      if (centrifugeRef.current) {
        centrifugeRef.current.disconnect();
        centrifugeRef.current = null;
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }

    const connectRealtime = async () => {
      setConnectionState("connecting");
      try {
        const token = await getCentrifugoAuthToken();
        if (!token) {
          setConnectionState("failed");
          return;
        }

        const socketUrl = buildSocketUrl();
        if (!socketUrl) {
          console.error("Centrifugo socket URL is not configured.");
          setConnectionState("failed");
          return;
        }

        const centrifuge = new Centrifuge(socketUrl, { token });
        centrifugeRef.current = centrifuge;

        centrifuge.on("connecting", () => setConnectionState("connecting"));
        centrifuge.on("connected", () => setConnectionState("connected"));
        centrifuge.on("disconnected", () => setConnectionState("disconnected"));
        centrifuge.on("error", (ctx) => {
          console.error("Centrifugo connection error", ctx);
          setConnectionState("failed");
        });

        const channel = isAuthenticated && loggedInUserId ? `chat:${loggedInUserId}` : "chat:public";

        const subscription = centrifuge.newSubscription(channel);
        subscriptionRef.current = subscription;

        subscription.on("publication", ({ data }) => {
          // Centrifugo sends the actual message data in `data` property of publication
          handleNewMessage(data);
        });
        subscription.on("error", (ctx) => {
          console.error("Centrifugo subscription error", ctx);
          setConnectionState("failed"); // Or a more specific subscription error state
        });
        subscription.subscribe();
        centrifuge.connect();
      } catch (error) {
        console.error("Unable to establish Centrifugo connection", error);
        setConnectionState("failed");
      }
    };

    connectRealtime();

    return () => {
      const handleNewMessage = (data) => {
        if (typeof data.user === "string") {
          const isCurrentUser = data.user === loggedInUserId;
          data.user = {
            _id: data.user,
            username: isCurrentUser
              ? loggedInUserName
              : data.username || "Unknown User",
          };
        }

        appendMessage(data); // Assuming data is the message object
        setMeta((prev) => ({
          ...prev,
          latestMessageId: data?._id || prev.latestMessageId,
        }));
      };

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      if (centrifugeRef.current) {
        centrifugeRef.current.disconnect();
        centrifugeRef.current = null;
      }
    };
  }, [
    isAuthenticated,
    user?.token,
    loggedInUserId,
    loggedInUserName,
    getCentrifugoAuthToken,
    buildSocketUrl,
    appendMessage,
    // handleNewMessage is defined inside this effect, so it doesn't need to be a dependency
  ]);

  useEffect(() => { // Auto-scroll effect
    if (!isAutoscrollLocked) {
      scrollToBottom();
    }
  }, [messages, isAutoscrollLocked, scrollToBottom]);

  useEffect(() => {
    if (messages[0]?._id) {
      setMeta((prev) =>
        prev.latestMessageId === messages[0]._id
          ? prev
          : { ...prev, latestMessageId: messages[0]._id }
      );
    }
  }, [messages]);

  const orderedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a?.createdAt || 0).getTime() -
        new Date(b?.createdAt || 0).getTime() // Sort ascending by createdAt
    );
  }, [messages]);

  const statusMeta =
    CONNECTION_META[connectionState] || CONNECTION_META.disconnected;

  const chatContent = (
    <>
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 ${statusMeta.dot}`} />
            <p className={`${statusMeta.tone} font-semibold uppercase`}>
              {statusMeta.label} {connectionState === "failed" && <IoWarningOutline className="inline-block ml-1 text-base" />}
            </p>
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <button
              className="inline-flex items-center gap-2 border border-[#2d3449] bg-[#161c2b] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-100 transition hover:bg-[#1f2638] disabled:opacity-40"
              onClick={() => fetchMessages()}
              disabled={isFetching}
            >
              <FiRefreshCcw className={isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
            <p className="hidden sm:block text-[10px] uppercase text-white/50 tracking-widest">
              Mention @ai for instant analysis
            </p>
          </div>
        </div>

        <div className="relative flex-1">
          <div
            ref={chatBodyRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto border border-[#282e39] bg-[#0d1422] p-4 space-y-4"
          >
            {fetchError ? (
              <div className="flex flex-col items-center justify-center text-center gap-3 py-10 text-white/70">
                <FiAlertTriangle className="text-3xl text-amber-300" />
                <div>
                  <p className="font-semibold mb-1">Unable to load chat</p>
                  <p className="text-sm text-white/60 max-w-xs">
                    {fetchError}
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-2 border border-[#2d3449] bg-[#161c2b] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-[#1f2638]"
                  onClick={() => fetchMessages()}
                >
                  <HiOutlineRefresh className="animate-spin" />
                  Try again
                </button>
              </div>
            ) : isFetching && !messages.length ? (
              <div className="flex justify-center items-center h-[60vh]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-[#819d25]"
                >
                  <HiOutlineRefresh className="w-8 h-8" />
                </motion.div>
              </div>
            ) : (
              <>
                {meta.hasMore && (
                  <button
                    disabled={isFetchingOlder}
                    onClick={() =>
                      fetchMessages({ cursor: meta.nextCursor || undefined })
                    }
                    className="w-full border border-[#2d3449] bg-[#11182c] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:bg-[#161b2a] disabled:opacity-50"
                  >
                    {isFetchingOlder ? "Loading older messages…" : "Load previous messages"}
                  </button>
                )}

                {orderedMessages.length === 0 ? (
                  <div className="text-center text-white/60 py-10">
                    <p className="font-semibold text-white">
                      Be the first to say hi 👋
                    </p>
                    <p className="text-sm mt-1">
                      Share a thought or type <span className="text-[#819d25]">@ai</span>{" "}
                      to ask the assistant.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {orderedMessages.map((msg, index) => (
                      <MessageBubble
                        key={msg._id || `${msg.createdAt}-${index}`}
                        message={msg}
                        loggedInUserName={loggedInUserName}
                        loggedInUserId={loggedInUserId}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {isAutoscrollLocked && (
            <button
              onClick={() => {
                setIsAutoscrollLocked(false);
                scrollToBottom();
              }}
              className="absolute left-0 right-0 bottom-24 mx-auto flex w-48 items-center justify-center border border-[#135bec] bg-[#135bec] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white"
            >
              Jump to latest
            </button>
          )}

          {connectionState === "disconnected" && (
            <div className="absolute inset-x-0 top-2 mx-auto flex w-fit items-center gap-1 border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-rose-200">
              <FiWifiOff />
              Realtime paused
            </div>
          )}
        </div>
      </div>

      <ChatInput
        onSubmit={sendMessage}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        isLoading={isLoading}
        maxLength={MESSAGE_CHAR_LIMIT}
        disabled={!isAuthenticated}
        errorMessage={submitError}
      />
    </>
  );

  if (isFullPage) {
    return (
      <div className="h-screen pt-10 p-4 bg-[#092327]">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <h1 className="text-2xl font-bold text-primary_white mb-4 flex items-center gap-2">
            <IoChatbubbleEllipses className="text-[#819d25]" />
            Chess Community Chat
          </h1>
          {chatContent}
        </div>
      </div>
    );
  }

  if (isPanel) {
    return (
      <div className="flex min-h-[620px] flex-col border border-[#282e39] bg-[#151b2e]">
        <div className="flex items-center justify-between border-b border-[#282e39] px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#8a96c9]">
              Community
            </p>
            <p className="text-lg font-semibold text-white">
              #general-discussion
            </p>
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 border border-[#2e3750] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8aa0ff] transition hover:border-[#135bec] hover:text-white"
          >
            <FiUsers className="text-base" />
            Full chat
          </Link>
        </div>
        <div className="flex flex-1 flex-col p-4">{chatContent}</div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-1 right-1 w-full max-w-sm border border-white/10 bg-black/70 backdrop-blur-lg shadow-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={isExpanded ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.95 }}
    >
      <motion.div
        className="cursor-pointer bg-black/70 backdrop-blur-lg p-4 flex items-center justify-between border-b border-white/10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <IoChatbubbleEllipses className="text-2xl text-[#819d25]" />
          <h2 className="text-lg font-semibold text-primary_white">
            Chess Chat
          </h2>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-2 w-6 bg-[#819d25]"
          />
        </div>
        <motion.div animate={{ rotate: isExpanded ? 0 : 180 }}>
          <FiChevronDown className="text-xl text-white" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "500px", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col"
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
