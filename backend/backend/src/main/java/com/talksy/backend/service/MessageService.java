package com.talksy.backend.service;

import com.talksy.backend.entity.*;
import com.talksy.backend.repository.*;

import com.talksy.backend.util.CryptoUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageReactionRepository messageReactionRepository;

    // ===============================
    // 🔥 SEND MESSAGE (ENCRYPTED + REPLY)
    // ===============================
    public Message sendMessage(Long senderId,
                               Long conversationId,
                               String content,
                               String type,
                               Long replyToId) {

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // 🔒 SECURITY CHECK
        if (!conversation.getUser1().getId().equals(senderId) &&
                !conversation.getUser2().getId().equals(senderId)) {
            throw new RuntimeException("You are not part of this conversation");
        }

        // ===============================
        // 🔥 REPLY MESSAGE SUPPORT
        // ===============================
        Message replyTo = null;

        if (replyToId != null) {

            replyTo = messageRepository.findById(replyToId)
                    .orElseThrow(() -> new RuntimeException("Reply message not found"));

            // 🔒 SECURITY
            if (!replyTo.getConversation().getId().equals(conversationId)) {
                throw new RuntimeException("Invalid reply message");
            }
        }

        // 🔐 ENCRYPT MESSAGE
        String encryptedContent = CryptoUtil.encrypt(content);

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(encryptedContent)
                .type(type != null ? type : "TEXT")
                .replyTo(replyTo)
                .build();

        Message saved = messageRepository.save(message);

        // 🔥 update conversation
        conversation.setLastMessage(content);
        conversation.setLastMessageTime(saved.getCreatedAt());

        if (conversation.getUser1().getId().equals(senderId)) {
            conversation.setUnreadCountUser2(
                    conversation.getUnreadCountUser2() + 1
            );
        } else {
            conversation.setUnreadCountUser1(
                    conversation.getUnreadCountUser1() + 1
            );
        }

        conversationRepository.save(conversation);

        return saved;
    }

    // ===============================
    // 🔥 GET MESSAGES (DECRYPTED)
    // ===============================
    public List<Message> getMessages(Long userId, Long conversationId) {

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // 🔒 SECURITY CHECK
        if (!conversation.getUser1().getId().equals(userId) &&
                !conversation.getUser2().getId().equals(userId)) {
            throw new RuntimeException("You are not part of this conversation");
        }

        List<Message> messages = messageRepository
                .findByConversationOrderByCreatedAtAsc(conversation);

        // 🔐 DECRYPT before sending
        for (Message m : messages) {

            if (!m.isDeletedForEveryone()) {

                try {
                    m.setContent(CryptoUtil.decrypt(m.getContent()));
                } catch (Exception e) {
                    // fallback for old plain-text messages
                    m.setContent(m.getContent());
                }
            }

            // 🔥 decrypt reply message too
            if (m.getReplyTo() != null &&
                    !m.getReplyTo().isDeletedForEveryone()) {

                try {
                    m.getReplyTo().setContent(
                            CryptoUtil.decrypt(m.getReplyTo().getContent())
                    );
                } catch (Exception e) {
                    m.getReplyTo().setContent(
                            m.getReplyTo().getContent()
                    );
                }
            }
        }

        return messages;
    }

    // ===============================
    // 🔥 MARK AS READ
    // ===============================
    public void markAsRead(Long userId, Long conversationId) {

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // 🔒 SECURITY CHECK
        if (!conversation.getUser1().getId().equals(userId) &&
                !conversation.getUser2().getId().equals(userId)) {
            throw new RuntimeException("You are not part of this conversation");
        }

        List<Message> messages = messageRepository
                .findByConversationAndIsReadFalseAndSender_IdNot(conversation, userId);

        for (Message m : messages) {
            m.setRead(true);
        }

        messageRepository.saveAll(messages);

        // 🔥 reset unread count
        if (conversation.getUser1().getId().equals(userId)) {
            conversation.setUnreadCountUser1(0);
        } else {
            conversation.setUnreadCountUser2(0);
        }

        conversationRepository.save(conversation);
    }

    // ===============================
    // 🔥 DELETE FOR EVERYONE
    // ===============================
    public void deleteForEveryone(Long userId, Long messageId) {

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // 🔒 only sender can unsend
        if (!message.getSender().getId().equals(userId)) {
            throw new RuntimeException("Only sender can delete for everyone");
        }

        message.setDeletedForEveryone(true);
        message.setContent("This message was deleted");

        messageRepository.save(message);
    }

    // ===============================
    // 🔥 DELETE FOR ME
    // ===============================
    public void deleteForMe(Long userId, Long messageId) {

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        Conversation conversation = message.getConversation();

        // 🔒 security check
        if (conversation.getUser1().getId().equals(userId)) {
            message.setDeletedForUser1(true);

        } else if (conversation.getUser2().getId().equals(userId)) {
            message.setDeletedForUser2(true);

        } else {
            throw new RuntimeException("Unauthorized");
        }

        messageRepository.save(message);
    }

    // ===============================
    // 🔥 CLEAR CHAT
    // ===============================
    public void clearChat(Long userId, Long conversationId) {

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        List<Message> messages = messageRepository
                .findByConversationOrderByCreatedAtAsc(conversation);

        for (Message m : messages) {

            if (conversation.getUser1().getId().equals(userId)) {
                m.setDeletedForUser1(true);

            } else {
                m.setDeletedForUser2(true);
            }
        }

        messageRepository.saveAll(messages);
    }

    // ===============================
    // 🔥 REACT TO MESSAGE
    // ===============================
    public void reactToMessage(Long userId, Long messageId, String emoji) {

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = message.getConversation();

        // 🔒 SECURITY
        if (!conversation.getUser1().getId().equals(userId) &&
                !conversation.getUser2().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        var existing = messageReactionRepository
                .findByMessageAndUser(message, user);

        if (existing.isPresent()) {

            MessageReaction reaction = existing.get();

            // 🔥 same emoji → remove
            if (reaction.getEmoji().equals(emoji)) {
                messageReactionRepository.delete(reaction);
                return;
            }

            // 🔥 update emoji
            reaction.setEmoji(emoji);
            messageReactionRepository.save(reaction);

        } else {

            // 🔥 new reaction
            MessageReaction reaction = MessageReaction.builder()
                    .message(message)
                    .user(user)
                    .emoji(emoji)
                    .build();

            messageReactionRepository.save(reaction);
        }
    }
}