import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

import API from "../api/axios";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  // ===============================
  // 🔥 STATES
  // ===============================
  const [contacts, setContacts] =
    useState([]);

  const [selectedChat, setSelectedChat] =
    useState(null);

  const [conversation, setConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [replyTo, setReplyTo] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [sidebarLoading, setSidebarLoading] =
    useState(false);

  const [hasFetchedContacts, setHasFetchedContacts] =
    useState(false);

  // ===============================
  // 🔥 LOCKS
  // ===============================
  const messageFetchLock =
    useRef(false);

  const sendLock =
    useRef(false);

  // ===============================
  // 🔥 GET CURRENT USER
  // ===============================
  const getCurrentUserId = () => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      return Number(user?.id);

    } catch {

      return null;
    }
  };

  // ===============================
  // 🔥 FETCH CONTACTS
  // ===============================
  const fetchContacts = useCallback(async () => {

    try {

      if (sidebarLoading) return;

      setSidebarLoading(true);

      const res =
        await API.get("/contacts");

      const data =
        res?.data?.data || [];

      const mapped =
        data.map((item, index) => ({

          id:
            item.contactUser?.id ||
            item.contactId ||
            item.userId ||
            item.id ||
            index + 1,

          name:
            item.contactUser?.name ||
            item.name ||
            "Unknown",

          avatar:
            item.contactUser?.avatar ||
            item.avatar ||
            "",

          bio:
            item.contactUser?.bio ||
            item.bio ||
            "",

          phone:
            item.contactUser?.phone ||
            item.phone ||
            "",

          online:
            item.contactUser?.online ||
            item.online ||
            false,

          lastSeen:
            item.contactUser?.lastSeen ||
            item.lastSeen ||
            null,

          conversationId:
            item.conversationId || null,

          unreadCount:
            item.unreadCount || 0,

          lastMessage:
            item.lastMessage?.trim() || "",

          lastMessageTime:
            item.lastMessageTime || null,
        }));

      // 🔥 latest sort
      mapped.sort((a, b) => {

        if (!a.lastMessageTime) return 1;

        if (!b.lastMessageTime) return -1;

        return (
          new Date(b.lastMessageTime) -
          new Date(a.lastMessageTime)
        );
      });

      setContacts(mapped);

      setHasFetchedContacts(true);

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load contacts"
      );

    } finally {

      setSidebarLoading(false);
    }

  }, [sidebarLoading]);

  // ===============================
  // 🔥 OPEN CONVERSATION
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

        if (!conversationData) {

          throw new Error(
            "Conversation failed"
          );
        }

        const updatedChat = {

          ...contact,

          conversationId:
            conversationData.id,
        };

        setSelectedChat(updatedChat);

        setConversation(conversationData);

        // 🔥 fetch messages
        await fetchMessages(
          conversationData.id
        );

        // 🔥 mark as read
        await markAsRead(
          conversationData.id
        );

        return conversationData;

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to open chat"
        );

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

        if (
          !conversationId ||
          messageFetchLock.current
        ) return;

        messageFetchLock.current = true;

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
              msg.type || "TEXT",

            senderId:
              Number(msg.senderId),

            createdAt:
              msg.createdAt,

            isRead:
              msg.isRead || false,

            deleted:
              msg.deleted || false,

            reactions:
              msg.reactions || [],

            replyTo:
              msg.replyTo
                ? {
                    id: msg.replyTo.id,
                    content:
                      msg.replyTo.content,
                  }
                : null,
          }));

        // 🔥 strict order
        mapped.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );

        setMessages(mapped);

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to load messages"
        );

      } finally {

        messageFetchLock.current = false;
      }

    }, []);

  // ===============================
  // 🔥 SEND MESSAGE
  // ===============================
  const sendMessage =
    useCallback(async ({
      conversationId,
      content,
      type = "TEXT",
    }) => {

      try {

        if (
          !content?.trim() ||
          sendLock.current
        ) return;

        sendLock.current = true;

        setSending(true);

        const currentUserId =
          getCurrentUserId();

        // 🔥 optimistic id
        const tempId =
          `temp-${Date.now()}`;

        const optimisticMessage = {

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

          replyTo:
            replyTo
              ? {
                  id: replyTo.id,
                  content:
                    replyTo.content,
                }
              : null,
        };

        // 🔥 optimistic add
        setMessages((prev) => [

          ...prev,

          optimisticMessage,
        ]);

        const payload = {

          conversationId,

          content,

          type,
        };

        // 🔥 reply
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

        // 🔥 replace optimistic
        setMessages((prev) =>
          prev.map((m) =>

            m.id === tempId
              ? {

                  ...realMessage,

                  senderId:
                    Number(
                      realMessage.senderId
                    ),

                  reactions:
                    realMessage.reactions || [],

                  replyTo:
                    realMessage.replyTo
                      ? {
                          id:
                            realMessage.replyTo.id,
                          content:
                            realMessage.replyTo.content,
                        }
                      : null,
                }
              : m
          )
        );

        // 🔥 sidebar update
        setContacts((prev) =>
          prev.map((c) =>

            c.conversationId ===
            conversationId

              ? {

                  ...c,

                  lastMessage:
                    content,

                  lastMessageTime:
                    new Date().toISOString(),
                }

              : c
          )
        );

        // 🔥 clear reply
        setReplyTo(null);

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to send message"
        );

        // 🔥 rollback
        setMessages((prev) =>
          prev.filter(
            (m) =>
              !String(m.id)
                .startsWith("temp-")
          )
        );

      } finally {

        sendLock.current = false;

        setSending(false);
      }

    }, [replyTo]);

  // ===============================
  // 🔥 REACT TO MESSAGE
  // ===============================
  const reactToMessage =
    useCallback(async (
      messageId,
      emoji
    ) => {

      try {

        await API.post(
          "/messages/react",
          {
            messageId,
            emoji,
          }
        );

        setMessages((prev) =>

          prev.map((m) => {

            if (
              m.id !== messageId
            ) return m;

            const existing =
              m.reactions?.find(
                (r) => r.isMe
              );

            let updated =
              [...(m.reactions || [])];

            // 🔥 remove
            if (
              existing &&
              existing.emoji === emoji
            ) {

              updated =
                updated.filter(
                  (r) => !r.isMe
                );
            }

            // 🔥 update
            else if (existing) {

              updated =
                updated.map((r) =>

                  r.isMe
                    ? {
                        ...r,
                        emoji,
                      }
                    : r
                );
            }

            // 🔥 add
            else {

              updated.push({

                id: Date.now(),

                emoji,

                isMe: true,
              });
            }

            return {

              ...m,

              reactions: updated,
            };
          })
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Reaction failed"
        );
      }

    }, []);

  // ===============================
  // 🔥 DELETE FOR ME
  // ===============================
  const deleteForMe =
    useCallback(async (
      messageId
    ) => {

      try {

        await API.delete(
          `/messages/me/${messageId}`
        );

        setMessages((prev) =>

          prev.filter(
            (m) =>
              m.id !== messageId
          )
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Delete failed"
        );
      }

    }, []);

  // ===============================
  // 🔥 DELETE FOR EVERYONE
  // ===============================
  const deleteForEveryone =
    useCallback(async (
      messageId
    ) => {

      try {

        await API.delete(
          `/messages/everyone/${messageId}`
        );

        setMessages((prev) =>

          prev.map((m) =>

            m.id === messageId

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

    }, []);

  // ===============================
  // 🔥 CLEAR CHAT
  // ===============================
  const clearChat =
    useCallback(async (
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

    }, []);

  // ===============================
  // 🔥 MARK AS READ
  // ===============================
  const markAsRead =
    useCallback(async (
      conversationId
    ) => {

      try {

        await API.put(
          `/messages/read/${conversationId}`
        );

        // 🔥 local
        setMessages((prev) =>

          prev.map((m) => ({

            ...m,

            isRead: true,
          }))
        );

        // 🔥 unread clear
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

    }, []);

  // ===============================
  // 🔥 REFRESH CURRENT CHAT
  // ===============================
  const refreshCurrentChat =
    useCallback(async () => {

      if (conversation?.id) {

        await fetchMessages(
          conversation.id
        );
      }

    }, [
      conversation,
      fetchMessages,
    ]);

  // ===============================
  // 🔥 RESET CHAT
  // ===============================
  const resetChatState = () => {

    setSelectedChat(null);

    setConversation(null);

    setMessages([]);

    setReplyTo(null);
  };

  return (
    <ChatContext.Provider
      value={{

        // 🔥 states
        contacts,
        selectedChat,
        conversation,
        messages,
        replyTo,
        loading,
        sending,
        sidebarLoading,
        hasFetchedContacts,

        // 🔥 setters
        setReplyTo,
        setSelectedChat,
        setMessages,

        // 🔥 sidebar
        fetchContacts,
        openConversation,

        // 🔥 messages
        fetchMessages,
        sendMessage,
        reactToMessage,
        deleteForMe,
        deleteForEveryone,
        clearChat,
        markAsRead,

        // 🔥 refresh
        refreshCurrentChat,

        // 🔥 reset
        resetChatState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () =>
  useContext(ChatContext);