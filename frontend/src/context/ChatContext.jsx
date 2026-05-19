import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";

import API from "../api/axios";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  // ===============================
  // 🔥 STATES
  // ===============================
  const [contacts, setContacts] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);

  const [conversation, setConversation] = useState(null);

  const [messages, setMessages] = useState([]);

  const [replyTo, setReplyTo] = useState(null);

  const [loading, setLoading] = useState(false);

  const [sending, setSending] = useState(false);

  const [sidebarLoading, setSidebarLoading] = useState(false);

  const [hasFetchedContacts, setHasFetchedContacts] = useState(false);

  // 🔥 FILTER
  const [activeFilter, setActiveFilter] = useState("All");

  // ===============================
  // 🔥 CACHED MEDIA DATA
  // ===============================

  const mediaMessages = useMemo(() => {

    return messages.filter(
      (msg) =>
        (
          msg.type === "IMAGE" ||
          msg.type === "VIDEO"
        ) &&
        msg.content
    );

  }, [messages]);

  const imageMessages = useMemo(() => {

    return messages.filter(
      (msg) =>
        msg.type === "IMAGE" &&
        msg.content
    );

  }, [messages]);

  const videoMessages = useMemo(() => {

    return messages.filter(
      (msg) =>
        msg.type === "VIDEO" &&
        msg.content
    );

  }, [messages]);

  const fileMessages = useMemo(() => {

    return messages.filter(
      (msg) =>
        msg.type === "FILE" &&
        msg.content
    );

  }, [messages]);

  const pdfMessages = useMemo(() => {

    return messages.filter(
      (msg) =>
        msg.type === "FILE" &&
        msg.content &&
        msg.content
          .toLowerCase()
          .includes(".pdf")
    );

  }, [messages]);

  const profileMedia = useMemo(() => {

    return mediaMessages
      .slice()
      .reverse();

  }, [mediaMessages]);

  // ===============================
  // 🔥 LOCKS
  // ===============================
  const messageFetchLock = useRef(false);

  const sendLock = useRef(false);

  // ===============================
  // 🔥 AUTO FETCH AFTER REFRESH
  // ===============================
  useEffect(() => {

    if (conversation?.id) {

      fetchMessages(
        conversation.id
      );
    }

  }, [conversation?.id]);

  // ===============================
  // 🔥 GET CURRENT USER
  // ===============================
  const getCurrentUserId = () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      return Number(user?.id);

    } catch {

      return null;
    }
  };

  // ===============================
  // 🚫 BLOCK / UNBLOCK CONTACT
  // ===============================
  const toggleBlockContact =
    useCallback(async (contactId) => {

      try {

        const res =
          await API.put(
            `/contacts/${contactId}/block`
          );

        const updated =
          res?.data?.data;

        setContacts((prev) =>
          prev.map((c) =>
            c.id === contactId
              ? {
                ...c,
                blocked:
                  updated.blocked,
              }
              : c
          )
        );

        setSelectedChat((prev) =>
          prev?.id === contactId
            ? {
              ...prev,
              blocked:
                updated.blocked,
            }
            : prev
        );

        toast.success(
          updated.blocked
            ? "Contact blocked"
            : "Contact unblocked"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to update contact"
        );
      }

    }, []);

  // ===============================
  // ❌ DELETE CONTACT
  // ===============================
  const deleteContact =
    useCallback(async (contactId) => {

      try {

        await API.delete(
          `/contacts/${contactId}`
        );

        setContacts((prev) =>
          prev.filter(
            (c) =>
              c.id !== contactId
          )
        );

        toast.success(
          "Contact deleted"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Delete failed"
        );
      }

    }, []);

  // ===============================
  // 🔥 FETCH CONTACTS
  // ===============================
  const fetchContacts =
    useCallback(async () => {

      try {

        if (sidebarLoading)
          return;

        setSidebarLoading(true);

        const res =
          await API.get(
            "/contacts"
          );

        const data =
          res?.data?.data || [];

        const mapped =
          data.map(
            (
              item,
              index
            ) => ({
              id:
                item.contactUser
                  ?.id ||
                item.contactId ||
                item.userId ||
                item.id ||
                index + 1,

              name:
                item.contactUser
                  ?.name ||
                item.name ||
                "Unknown",

              avatar:
                item.contactUser
                  ?.avatar ||
                item.avatar ||
                "",

              bio:
                item.contactUser
                  ?.bio ||
                item.bio ||
                "",

              phone:
                item.contactUser
                  ?.phone ||
                item.phone ||
                "",

              blocked:
                item.blocked ||
                false,

              online:
                item.contactUser
                  ?.online ||
                item.online ||
                false,

              lastSeen:
                item.contactUser
                  ?.lastSeen ||
                item.lastSeen ||
                null,

              conversationId:
                item.conversationId ||
                null,

              unreadCount:
                item.unreadCount ||
                0,

              lastMessage:
                item.lastMessage
                  ?.trim() || "",

              lastMessageTime:
                item.lastMessageTime ||
                null,

              isGroup: false,
            })
          );

        mapped.sort(
          (a, b) => {

            if (
              !a.lastMessageTime
            )
              return 1;

            if (
              !b.lastMessageTime
            )
              return -1;

            return (
              new Date(
                b.lastMessageTime
              ) -
              new Date(
                a.lastMessageTime
              )
            );
          }
        );

        setContacts(mapped);

        setHasFetchedContacts(
          true
        );

      } catch (err) {

        console.log(err);

        if (
          err?.response
            ?.status !== 401
        ) {

          toast.error(
            "Failed to load contacts"
          );
        }

      } finally {

        setSidebarLoading(
          false
        );
      }

    }, [sidebarLoading]);

  // ===============================
  // 🔥 OPEN PRIVATE CONVERSATION
  // ===============================
  const openConversation =
    useCallback(async (contact) => {

      try {

        setLoading(true);

        const res =
          await API.post(
            `/conversations/${contact.id}`
          );

        const conversationData =
          res?.data?.data;

        if (
          !conversationData
        ) {

          throw new Error(
            "Conversation failed"
          );
        }

        const updatedChat = {
          ...contact,
          conversationId:
            conversationData.id,
        };

        setSelectedChat(
          updatedChat
        );

        setConversation(
          conversationData
        );

        setMessages([]);

        // 🔥 SAVE ACTIVE CHAT
        localStorage.setItem(
          "activeChat",
          JSON.stringify(
            updatedChat
          )
        );

        await markAsRead(
          conversationData.id
        );

        return conversationData;

      } catch (err) {

        console.log(err);

        if (
          err?.response
            ?.status !== 401
        ) {

          toast.error(
            "Failed to open chat"
          );
        }

        return null;

      } finally {

        setLoading(false);
      }

    }, []);

  // ===============================
  // 🔥 FETCH MESSAGES
  // ===============================
  const fetchMessages =
    useCallback(async (conversationId) => {

      try {

        if (!conversationId) {

          return;
        }

        const res =
          await API.get(
            `/messages/${conversationId}`
          );

        const data =
          res?.data?.data || [];

        const mapped =
          data.map((msg) => ({
            id: msg.id,

            content:
              msg.content || "",

            type:
              msg.type ||
              "TEXT",

            senderId: Number(
              msg.senderId
            ),

            senderName:
              msg.senderName ||
              "",

            senderAvatar:
              msg.senderAvatar ||
              "",

            createdAt:
              msg.createdAt,

            isRead:
              msg.isRead ||
              false,

            deleted:
              msg.deleted ||
              false,

            reactions:
              msg.reactions ||
              [],

            statusId:
              msg.statusId ||
              null,

            statusMedia:
              msg.statusMedia ||
              "",

            statusType:
              msg.statusType ||
              "",

            statusCaption:
              msg.statusCaption ||
              "",

            replyTo:
              msg.replyTo
                ? {
                  id:
                    msg.replyTo
                      .id,

                  content:
                    msg.replyTo
                      .content,
                }
                : null,
          }));

        mapped.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );

        setMessages(mapped);

      } catch (err) {

        console.log(err);

        // 🔥 TOKEN INVALID
        if (
          err?.response
            ?.status === 401
        ) {

          resetChatState();

          return;
        }

        toast.error(
          "Failed to load messages"
        );

      }

    }, []);

  // ===============================
  // 🔥 UPLOAD CHAT MEDIA
  // ===============================
  const uploadChatMedia =
    useCallback(async (file) => {

      try {

        if (!file)
          return null;

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "type",
          "chat"
        );

        const res =
          await API.post(
            "/file/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        return (
          res?.data?.data ||
          null
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Upload failed"
        );

        return null;
      }

    }, []);

  // ===============================
  // 🔥 SEND MESSAGE
  // ===============================
  const sendMessage =
    useCallback(
      async ({
        conversationId,
        content,
        type = "TEXT",

        statusId = null,
        statusMedia = "",
        statusType = "",
        statusCaption = "",
      }) => {

        try {

          if (
            (
              type === "TEXT" &&
              !content?.trim()
            ) ||

            sendLock.current
          ) {

            return;
          }

          sendLock.current =
            true;

          setSending(true);

          const currentUserId =
            getCurrentUserId();

          const tempId =
            `temp-${Date.now()}`;

          const optimisticMessage =
          {
            id: tempId,

            content,

            type,

            senderId:
              currentUserId,

            createdAt:
              new Date().toISOString(),

            isRead: false,

            deleted: false,

            reactions: [],

            statusId,
            statusMedia,
            statusType,
            statusCaption,

            replyTo: replyTo
              ? {
                id:
                  replyTo.id,

                content:
                  "Replying...",
              }
              : null,
          };

          setMessages((prev) => [
            ...prev,
            optimisticMessage,
          ]);

          const payload = {
            conversationId,
            content,
            type,

            statusId,
            statusMedia,
            statusType,
            statusCaption,
          };

          if (replyTo?.id) {

            payload.replyToId =
              replyTo.id;
          }

          const res =
            await API.post(
              "/messages",
              payload
            );

          const realMessage =
            res?.data?.data;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? {
                  ...realMessage,

                  senderId:
                    Number(
                      realMessage.senderId
                    ),

                  senderName:
                    realMessage.senderName ||
                    "",

                  senderAvatar:
                    realMessage.senderAvatar ||
                    "",

                  reactions:
                    realMessage.reactions ||
                    [],

                  statusId:
                    realMessage.statusId ||
                    null,

                  statusMedia:
                    realMessage.statusMedia ||
                    "",

                  statusType:
                    realMessage.statusType ||
                    "",

                  statusCaption:
                    realMessage.statusCaption ||
                    "",

                  replyTo:
                    realMessage.replyTo
                      ? {
                        id:
                          realMessage
                            .replyTo
                            .id,

                        content:
                          realMessage
                            .replyTo
                            .content,
                      }
                      : null,
                }
                : m
            )
          );

          setContacts((prev) =>
            prev.map((c) =>
              c.conversationId ===
                conversationId
                ? {
                  ...c,

                  lastMessage:
                    type ===
                      "IMAGE"
                      ? "📷 Photo"
                      : type ===
                        "VIDEO"
                        ? "🎥 Video"
                        : type ===
                          "FILE"
                          ? "📄 File"
                          : content,

                  lastMessageTime:
                    new Date().toISOString(),
                }
                : c
            )
          );

          setReplyTo(null);

        } catch (err) {

          console.log(err);

          toast.error(
            "Failed to send message"
          );

          setMessages((prev) =>
            prev.filter(
              (m) =>
                !String(
                  m.id
                ).startsWith(
                  "temp-"
                )
            )
          );

        } finally {

          sendLock.current =
            false;

          setSending(false);
        }

      },
      [replyTo]
    );

  // ===============================
  // 🔥 REACT TO MESSAGE
  // ===============================
  const reactToMessage =
    useCallback(
      async (
        messageId,
        emoji
      ) => {

        try {

          // ✅ BACKEND API
          await API.post(
            "/messages/react",
            {
              messageId,

              emoji: emoji,
            }
          );

          // ✅ UPDATE LOCAL STATE
          setMessages((prev) =>
            prev.map((m) => {

              if (
                m.id !== messageId
              ) {

                return m;
              }

              const existing =
                m.reactions?.find(
                  (r) =>
                    r.isMe
                );

              let updated = [
                ...(m.reactions ||
                  []),
              ];

              // ✅ REMOVE SAME REACTION
              if (
                existing &&
                existing.emoji ===
                emoji
              ) {

                updated =
                  updated.filter(
                    (r) =>
                      !r.isMe
                  );

              }

              // ✅ UPDATE REACTION
              else if (
                existing
              ) {

                updated =
                  updated.map(
                    (r) =>
                      r.isMe
                        ? {
                          ...r,
                          emoji,
                        }
                        : r
                  );

              }

              // ✅ ADD NEW REACTION
              else {

                updated.push({
                  id: Date.now(),
                  emoji,
                  isMe: true,
                });
              }

              return {
                ...m,
                reactions:
                  updated,
              };
            })
          );

        } catch (err) {

          console.log(err);

          toast.error(
            "Reaction failed"
          );
        }

      },
      []
    );

  // ===============================
  // 🔥 DELETE FOR ME
  // ===============================
  const deleteForMe =
    useCallback(
      async (messageId) => {

        try {

          await API.delete(
            `/messages/me/${messageId}`
          );

          setMessages((prev) =>
            prev.filter(
              (m) =>
                m.id !==
                messageId
            )
          );

        } catch (err) {

          console.log(err);

          toast.error(
            "Delete failed"
          );
        }

      },
      []
    );

  // ===============================
  // 🔥 DELETE FOR EVERYONE
  // ===============================
  const deleteForEveryone =
    useCallback(
      async (messageId) => {

        try {

          await API.delete(
            `/messages/everyone/${messageId}`
          );

          setMessages((prev) =>
            prev.map((m) =>
              m.id ===
                messageId
                ? {
                  ...m,

                  content:
                    "This message was deleted",

                  deleted: true,
                }
                : m
            )
          );

        } catch (err) {

          console.log(err);

          toast.error(
            "Delete failed"
          );
        }

      },
      []
    );

  // ===============================
  // 🔥 CLEAR CHAT
  // ===============================
  const clearChat =
    useCallback(
      async (
        conversationId
      ) => {

        try {

          await API.delete(
            `/messages/clear/${conversationId}`
          );

          setMessages([]);

          toast.success(
            "Chat cleared"
          );

        } catch (err) {

          console.log(err);

          toast.error(
            "Failed to clear chat"
          );
        }

      },
      []
    );

  // ===============================
  // 🔥 MARK AS READ
  // ===============================
  const markAsRead =
    useCallback(
      async (
        conversationId
      ) => {

        try {

          await API.put(
            `/messages/read/${conversationId}`
          );

          setMessages((prev) =>
            prev.map((m) => ({
              ...m,
              isRead: true,
            }))
          );

          setContacts((prev) =>
            prev.map((c) =>
              c.conversationId ===
                conversationId
                ? {
                  ...c,
                  unreadCount: 0,
                }
                : c
            )
          );

        } catch (err) {

          console.log(err);
        }

      },
      []
    );

  // ===============================
  // 🔥 REFRESH CURRENT CHAT
  // ===============================
  const refreshCurrentChat =
    useCallback(
      async () => {

        if (
          conversation?.id
        ) {

          await fetchMessages(
            conversation.id
          );
        }

      },
      [
        conversation,
        fetchMessages,
      ]
    );

  // ===============================
  // 🔥 RESET CHAT
  // ===============================
  const resetChatState =
    () => {

      localStorage.removeItem(
        "activeChat"
      );

      sendLock.current =
        false;

      setSelectedChat(
        null
      );

      setConversation(
        null
      );

      setMessages([]);

      setReplyTo(null);
    };

  return (
    <ChatContext.Provider
      value={{
        contacts,
        selectedChat,
        conversation,
        messages,
        replyTo,
        loading,
        sending,
        sidebarLoading,
        hasFetchedContacts,

        mediaMessages,
        imageMessages,
        videoMessages,
        fileMessages,
        pdfMessages,
        profileMedia,

        activeFilter,
        setActiveFilter,

        setReplyTo,
        setSelectedChat,
        setMessages,
        setConversation,

        fetchContacts,
        openConversation,

        fetchMessages,
        uploadChatMedia,
        sendMessage,
        reactToMessage,
        deleteForMe,
        deleteForEveryone,

        clearChat,

        toggleBlockContact,
        deleteContact,

        markAsRead,

        refreshCurrentChat,

        resetChatState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat =
  () => useContext(ChatContext);