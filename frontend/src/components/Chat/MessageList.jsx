import { useAuth } from "../../context/AuthContext";

import MessageBubble from "./MessageBubble";

import { motion } from "framer-motion";

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

  // 🔥 CHAT STYLE
  currentChatStyle,

  // 🔥 BUBBLE COLOR
  currentBubbleColor,

  // 🔥 VIEWER
  setViewerOpen,
  setViewerMedia,
  setViewerIndex,
}) => {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar px-4 py-4 space-y-4">
      {groupedMessages.map((msg) => {
        const isMe = Number(msg.senderId) === Number(user?.id);

        const actionMessage = msg.type === "MEDIA_GROUP" ? msg.medias[0] : msg;

        return (
          <motion.div
            key={msg.id}
            initial={{
              opacity: 0,
              y: 14,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
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
              currentChatStyle={currentChatStyle}
              currentBubbleColor={currentBubbleColor}
            />
          </motion.div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
