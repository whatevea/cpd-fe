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
  FiUsers,
} from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import ChatInput from "./ChatInput";
import { Centrifuge } from "centrifuge";
import MessageBubble from "./MessageBubble";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "@/app/utils/apiClient";
import ChatHeader from "./ChatHeader";
const MESSAGE_CHAR_LIMIT = 600;
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
  const latestMessageIdRef = useRef(messages[0]?._id || null);
  const hasFetchedInitialMessagesRef = useRef(false);
  const [isAutoscrollLocked, setIsAutoscrollLocked] = useState(false);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
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
    const response = await apiFetch("/api/chat/get_connection_token", {
      headers: {
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
      },
    });
    const data = await response.json();
    return data.token;
  }, [user?.token]);

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

  const handleNewMessage = useCallback(
    (data) => {
      if (!data) return;

      const normalizedMessage =
        typeof data.user === "string"
          ? {
            ...data,
            user: {
              _id: data.user,
              username:
                data.user === loggedInUserId
                  ? loggedInUserName
                  : data.username || "Unknown User",
            },
          }
          : data;

      appendMessage(normalizedMessage);
      setMeta((prev) => {
        const nextLatestId =
          normalizedMessage?._id ||
          normalizedMessage?.tempId ||
          normalizedMessage?.createdAt ||
          prev.latestMessageId;

        if (!nextLatestId || prev.latestMessageId === nextLatestId) {
          return prev;
        }

        latestMessageIdRef.current = nextLatestId;
        return { ...prev, latestMessageId: nextLatestId };
      });
    },
    [appendMessage, loggedInUserId, loggedInUserName]
  );

  const tearDownRealtime = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    if (centrifugeRef.current) {
      centrifugeRef.current.disconnect();
      centrifugeRef.current = null;
    }
  }, []);

  const fetchMessages = useCallback(
    async ({ cursor } = {}) => {
      if (!cursor) {
        setIsFetching(true);
        setFetchError("");
      }
      if (cursor) {
        setIsFetchingOlder(true);
      }
      try {
        const headers = {
          ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        };
        const latestMessageId = latestMessageIdRef.current;
        if (!cursor && latestMessageId) {
          headers["If-None-Match"] = latestMessageId;
        }

        const response = await apiFetch(
          `/api/chat/getMessages${cursor ? `?before=${cursor}` : ""}`,
          {
            headers,
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

        setMeta((prev) => {
          const hasMore = Boolean(payload?.meta?.hasMore);
          const nextCursor = payload?.meta?.nextCursor || null;
          const latestFromPayload =
            !cursor && payload?.meta?.latestMessageId
              ? payload.meta.latestMessageId
              : prev.latestMessageId;

          if (!cursor && payload?.meta?.latestMessageId) {
            latestMessageIdRef.current = payload.meta.latestMessageId;
          }

          if (
            prev.hasMore === hasMore &&
            prev.nextCursor === nextCursor &&
            prev.latestMessageId === latestFromPayload
          ) {
            return prev;
          }

          return {
            hasMore,
            nextCursor,
            latestMessageId: latestFromPayload,
          };
        });

        if (!cursor && !autoScrollLockRef.current) {
          requestAnimationFrame(scrollToBottom);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        if (!cursor) {
          setFetchError(error.message || "Unable to load messages.");
        }
      } finally {
        if (!cursor) {
          setIsFetching(false);
        }
        if (cursor) {
          setIsFetchingOlder(false);
        }
      }
    },
    [user?.token, scrollToBottom, setMessages]
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
    if (hasFetchedInitialMessagesRef.current) return;
    hasFetchedInitialMessagesRef.current = true;
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    let cancelled = false;
    tearDownRealtime();

    const connectRealtime = async () => {
      setConnectionState("connecting");
      try {
        const token = await getCentrifugoAuthToken();
        if (!token) {
          if (!cancelled) {
            setConnectionState("failed");
          }
          return;
        }

        const socketUrl = buildSocketUrl();
        if (!socketUrl) {
          console.error("Centrifugo socket URL is not configured.");
          if (!cancelled) {
            setConnectionState("failed");
          }
          return;
        }

        const channel = import.meta.env.VITE_CENTRIFUGO_CHAT_NAMESPACE;
        if (!channel) {
          console.error("Centrifugo chat namespace is not configured.");
          if (!cancelled) {
            setConnectionState("failed");
          }
          return;
        }

        const centrifuge = new Centrifuge(socketUrl, { token });
        centrifugeRef.current = centrifuge;

        centrifuge.on("connecting", () => {
          if (!cancelled) {
            setConnectionState("connecting");
          }
        });
        centrifuge.on("connected", () => {
          if (!cancelled) {
            setConnectionState("connected");
          }
        });
        centrifuge.on("disconnected", () => {
          if (!cancelled) {
            setConnectionState("disconnected");
          }
        });
        centrifuge.on("error", (ctx) => {
          if (cancelled) return;
          console.error("Centrifugo connection error", ctx);
          setConnectionState("failed");
        });

        const subscription = centrifuge.newSubscription(channel);
        subscriptionRef.current = subscription;

        subscription.on("publication", ({ data }) => {
          if (!cancelled) {
            handleNewMessage(data);
          }
        });
        subscription.on("error", (ctx) => {
          if (cancelled) return;
          console.error("Centrifugo subscription error", ctx);
          setConnectionState("failed");
        });
        subscription.subscribe();
        centrifuge.connect();
      } catch (error) {
        if (cancelled) return;
        console.error("Unable to establish Centrifugo connection", error);
        setConnectionState("failed");
      }
    };

    connectRealtime();

    return () => {
      cancelled = true;
      tearDownRealtime();
    };
  }, [
    isAuthenticated,
    getCentrifugoAuthToken,
    buildSocketUrl,
    handleNewMessage,
    tearDownRealtime,
  ]);

  useEffect(() => { // Auto-scroll effect
    if (!isAutoscrollLocked) {
      scrollToBottom();
    }
  }, [messages, isAutoscrollLocked, scrollToBottom]);

  useEffect(() => {
    const newestId = messages[0]?._id || null;
    latestMessageIdRef.current = newestId;
    setMeta((prev) =>
      prev.latestMessageId === newestId
        ? prev
        : { ...prev, latestMessageId: newestId }
    );
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

  const chatContainerClasses = [
    "flex flex-1 min-h-0 flex-col overflow-hidden",
    isFullPage || isPanel ? "max-h-screen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const chatContent = (
    <div className={chatContainerClasses}>

      <ChatHeader
        statusMeta={statusMeta}
        connectionState={connectionState}
        showFullChatCTA={!isFullPage}
      />

      <div className="flex flex-1 min-h-0 flex-col bg-[#050c19]">
        <div className="flex-1 min-h-0 overflow-hidden p-4 overflow-y-auto">
          <div className="relative h-full">
            <div
              ref={chatBodyRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto border border-[#282e39] bg-[#0d1422] p-4 space-y-4"
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
      </div>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="h-screen bg-[#092327] p-4 pt-10">
        <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden border border-[#1a283a] bg-[#030915]/90 shadow-2xl">
          {chatContent}
        </div>
      </div>
    );
  }

  if (isPanel) {
    return (
      <div className="flex h-full max-h-screen flex-col border border-[#282e39] bg-[#151b2e]">
        {chatContent}
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
