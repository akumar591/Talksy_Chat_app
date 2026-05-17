import { useAuth } from "../../context/AuthContext";

import MessageBubble from "./MessageBubble";

const MessageList = ({
  groupedMessages,

  chat,

  messagesEndRef,

  activeMessageId,
  setActiveMessageId,

  reactionMsgId,
  setReactionMsgId,

  messageMenuId,
  setMessageMenuId,

  // 🔥 VIEWER
  setViewerOpen,
  setViewerMedia,
  setViewerIndex,
}) => {

  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar px-4 py-4 space-y-4">

      {groupedMessages.map((msg) => {

        const isMe =
          Number(msg.senderId) ===
          Number(user?.id);

        const actionMessage =
          msg.type === "MEDIA_GROUP"
            ? msg.medias[0]
            : msg;

        return (
          <div
            key={msg.id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >

            <div className="flex items-end gap-2 max-w-full">

              {/* 🔥 GROUP AVATAR */}
              {chat?.isGroup && !isMe && (
                <img
                  src={
                    msg.senderAvatar ||
                    "https://i.pravatar.cc/150?img=3"
                  }
                  alt={msg.senderName}
                  loading="lazy"
                  className="w-8 h-8 rounded-full object-cover mb-1 shrink-0"
                />
              )}

              <MessageBubble
                msg={msg}

                isMe={isMe}

                actionMessage={actionMessage}

                activeMessageId={activeMessageId}
                setActiveMessageId={setActiveMessageId}

                reactionMsgId={reactionMsgId}
                setReactionMsgId={setReactionMsgId}

                messageMenuId={messageMenuId}
                setMessageMenuId={setMessageMenuId}

                // 🔥 VIEWER
                setViewerOpen={setViewerOpen}

                setViewerMedia={setViewerMedia}

                setViewerIndex={setViewerIndex}
              />

            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef} />

    </div>
  );
};

export default MessageList;