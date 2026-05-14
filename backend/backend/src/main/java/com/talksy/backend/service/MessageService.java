package com.talksy.backend.service;

import com.talksy.backend.entity.*;
import com.talksy.backend.repository.*;
import com.talksy.backend.util.CryptoUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageReactionRepository messageReactionRepository;
    private final ContactRepository contactRepository;

    // 🔥 NEW
    private final GroupMemberRepository groupMemberRepository;

    // ===============================
    // 🔥 SEND MESSAGE
    // ===============================
    public Message sendMessage(
            Long senderId,
            Long conversationId,
            String content,
            String type,
            Long replyToId,

            // 🔥 NEW
            Long statusId,
            String statusMedia,
            String statusType,
            String statusCaption
    ) {

        User sender = userRepository.findById(senderId)
                .orElseThrow(() ->
                        new RuntimeException("Sender not found"));

        Conversation conversation =
                conversationRepository.findById(conversationId)
                        .orElseThrow(() ->
                                new RuntimeException("Conversation not found"));

        // ===============================
        // 🔥 GROUP CHAT
        // ===============================
        if (Boolean.TRUE.equals(conversation.getIsGroup())) {

            Group group = conversation.getGroup();

            boolean isMember =
                    groupMemberRepository
                            .findByGroupAndUser(
                                    group,
                                    sender
                            )
                            .isPresent();

            if (!isMember) {

                throw new RuntimeException(
                        "You are not a member of this group"
                );
            }

        }

        // ===============================
        // 🔥 PRIVATE CHAT
        // ===============================
        else {

            // 🔒 SECURITY CHECK
            if (
                    !conversation.getUser1()
                            .getId()
                            .equals(senderId)

                            &&

                            !conversation.getUser2()
                                    .getId()
                                    .equals(senderId)
            ) {

                throw new RuntimeException(
                        "You are not part of this conversation"
                );
            }

            // ===============================
            // 🚫 BLOCK CHECK
            // ===============================
            Long receiverId;

            if (
                    conversation.getUser1()
                            .getId()
                            .equals(senderId)
            ) {

                receiverId =
                        conversation.getUser2()
                                .getId();

            } else {

                receiverId =
                        conversation.getUser1()
                                .getId();
            }

            Optional<Contact> senderContact =
                    contactRepository
                            .findByUserIdAndContactUser_Id(
                                    senderId,
                                    receiverId
                            );

            Optional<Contact> receiverContact =
                    contactRepository
                            .findByUserIdAndContactUser_Id(
                                    receiverId,
                                    senderId
                            );

            boolean blocked =
                    senderContact
                            .map(Contact::isBlocked)
                            .orElse(false)

                            ||

                            receiverContact
                                    .map(Contact::isBlocked)
                                    .orElse(false);

            if (blocked) {

                throw new RuntimeException(
                        "Messaging not allowed"
                );
            }
        }

        // ===============================
        // 🔥 REPLY SUPPORT
        // ===============================
        Message replyTo = null;

        if (replyToId != null) {

            replyTo = messageRepository
                    .findById(replyToId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Reply message not found"
                            ));

            if (
                    !replyTo.getConversation()
                            .getId()
                            .equals(conversationId)
            ) {

                throw new RuntimeException(
                        "Invalid reply message"
                );
            }
        }

        // ===============================
        // 🔐 ENCRYPT
        // ===============================
        String encryptedContent =
                CryptoUtil.encrypt(content);

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(encryptedContent)
                .type(type != null ? type : "TEXT")
                .replyTo(replyTo)

                // 🔥 STATUS SUPPORT
                .statusId(statusId)
                .statusMedia(statusMedia)
                .statusType(statusType)
                .statusCaption(statusCaption)

                .build();
        Message saved =
                messageRepository.save(message);

        // ===============================
        // 🔥 UPDATE CONVERSATION
        // ===============================
        conversation.setLastMessage(content);

        conversation.setLastMessageTime(
                saved.getCreatedAt()
        );

        // 🔥 PRIVATE UNREAD
        if (!Boolean.TRUE.equals(conversation.getIsGroup())) {

            if (
                    conversation.getUser1()
                            .getId()
                            .equals(senderId)
            ) {

                conversation.setUnreadCountUser2(
                        conversation.getUnreadCountUser2() + 1
                );

            } else {

                conversation.setUnreadCountUser1(
                        conversation.getUnreadCountUser1() + 1
                );
            }
        }

        conversationRepository.save(conversation);

// ===============================
// 🔐 DECRYPT CURRENT MESSAGE
// ===============================
        try {

            saved.setContent(
                    CryptoUtil.decrypt(
                            saved.getContent()
                    )
            );

        } catch (Exception e) {

            saved.setContent(
                    saved.getContent()
            );
        }

// ===============================
// 🔐 DECRYPT REPLY MESSAGE
// ===============================
        if (
                saved.getReplyTo() != null

                        &&

                        saved.getReplyTo()
                                .getContent() != null
        ) {

            try {

                saved.getReplyTo().setContent(

                        CryptoUtil.decrypt(

                                saved.getReplyTo()
                                        .getContent()
                        )
                );

            } catch (Exception e) {

                saved.getReplyTo().setContent(

                        saved.getReplyTo()
                                .getContent()
                );
            }
        }

        return saved;
    }

    // ===============================
    // 🔥 GET MESSAGES
    // ===============================
    public List<Message> getMessages(
            Long userId,
            Long conversationId
    ) {

        Conversation conversation =
                conversationRepository.findById(conversationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conversation not found"
                                ));

        // ===============================
        // 🔥 GROUP SECURITY
        // ===============================
        if (Boolean.TRUE.equals(conversation.getIsGroup())) {

            User user =
                    userRepository.findById(userId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    ));

            boolean isMember =
                    groupMemberRepository
                            .findByGroupAndUser(
                                    conversation.getGroup(),
                                    user
                            )
                            .isPresent();

            if (!isMember) {

                throw new RuntimeException(
                        "You are not a member of this group"
                );
            }
        }

        // ===============================
        // 🔥 PRIVATE SECURITY
        // ===============================
        else {

            if (
                    !conversation.getUser1()
                            .getId()
                            .equals(userId)

                            &&

                            !conversation.getUser2()
                                    .getId()
                                    .equals(userId)
            ) {

                throw new RuntimeException(
                        "You are not part of this conversation"
                );
            }
        }

        List<Message> messages =
                messageRepository
                        .findByConversationOrderByCreatedAtAsc(
                                conversation
                        );

        // ===============================
        // 🔐 DECRYPT
        // ===============================
        for (Message m : messages) {

            if (!m.isDeletedForEveryone()) {

                try {

                    m.setContent(
                            CryptoUtil.decrypt(
                                    m.getContent()
                            )
                    );

                } catch (Exception e) {

                    m.setContent(
                            m.getContent()
                    );
                }
            }

            // 🔥 reply decrypt
            if (
                    m.getReplyTo() != null

                            &&

                            !m.getReplyTo()
                                    .isDeletedForEveryone()
            ) {

                try {

                    m.getReplyTo().setContent(
                            CryptoUtil.decrypt(
                                    m.getReplyTo()
                                            .getContent()
                            )
                    );

                } catch (Exception e) {

                    m.getReplyTo().setContent(
                            m.getReplyTo()
                                    .getContent()
                    );
                }
            }
        }

        return messages;
    }

    // ===============================
    // 🔥 MARK AS READ
    // ===============================
    public void markAsRead(
            Long userId,
            Long conversationId
    ) {

        Conversation conversation =
                conversationRepository.findById(conversationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conversation not found"
                                ));

        // 🔥 GROUP CHAT
        if (Boolean.TRUE.equals(conversation.getIsGroup())) {

            return;
        }

        // 🔥 PRIVATE CHAT
        if (
                !conversation.getUser1()
                        .getId()
                        .equals(userId)

                        &&

                        !conversation.getUser2()
                                .getId()
                                .equals(userId)
        ) {

            throw new RuntimeException(
                    "You are not part of this conversation"
            );
        }

        List<Message> messages =
                messageRepository
                        .findByConversationAndIsReadFalseAndSender_IdNot(
                                conversation,
                                userId
                        );

        for (Message m : messages) {

            m.setRead(true);
        }

        messageRepository.saveAll(messages);

        if (
                conversation.getUser1()
                        .getId()
                        .equals(userId)
        ) {

            conversation.setUnreadCountUser1(0);

        } else {

            conversation.setUnreadCountUser2(0);
        }

        conversationRepository.save(conversation);
    }

    // ===============================
    // 🔥 DELETE FOR EVERYONE
    // ===============================
    public void deleteForEveryone(
            Long userId,
            Long messageId
    ) {

        Message message =
                messageRepository.findById(messageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Message not found"
                                ));

        if (
                !message.getSender()
                        .getId()
                        .equals(userId)
        ) {

            throw new RuntimeException(
                    "Only sender can delete for everyone"
            );
        }

        message.setDeletedForEveryone(true);

        message.setContent(
                "This message was deleted"
        );

        messageRepository.save(message);
    }

    // ===============================
    // 🔥 DELETE FOR ME
    // ===============================
    public void deleteForMe(
            Long userId,
            Long messageId
    ) {

        Message message =
                messageRepository.findById(messageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Message not found"
                                ));

        Conversation conversation =
                message.getConversation();

        // 🔥 GROUP CHAT
        if (Boolean.TRUE.equals(conversation.getIsGroup())) {

            return;
        }

        // 🔥 PRIVATE CHAT
        if (
                conversation.getUser1()
                        .getId()
                        .equals(userId)
        ) {

            message.setDeletedForUser1(true);

        } else if (

                conversation.getUser2()
                        .getId()
                        .equals(userId)
        ) {

            message.setDeletedForUser2(true);

        } else {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        messageRepository.save(message);
    }

    // ===============================
    // 🔥 CLEAR CHAT
    // ===============================
    public void clearChat(
            Long userId,
            Long conversationId
    ) {

        Conversation conversation =
                conversationRepository.findById(conversationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conversation not found"
                                ));

        // 🔥 GROUP CHAT
        if (Boolean.TRUE.equals(conversation.getIsGroup())) {

            return;
        }

        List<Message> messages =
                messageRepository
                        .findByConversationOrderByCreatedAtAsc(
                                conversation
                        );

        for (Message m : messages) {

            if (
                    conversation.getUser1()
                            .getId()
                            .equals(userId)
            ) {

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
    public void reactToMessage(
            Long userId,
            Long messageId,
            String emoji
    ) {

        Message message =
                messageRepository.findById(messageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Message not found"
                                ));

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Conversation conversation =
                message.getConversation();

        // ===============================
        // 🔥 GROUP SECURITY
        // ===============================
        if (Boolean.TRUE.equals(conversation.getIsGroup())) {

            boolean isMember =
                    groupMemberRepository
                            .findByGroupAndUser(
                                    conversation.getGroup(),
                                    user
                            )
                            .isPresent();

            if (!isMember) {

                throw new RuntimeException(
                        "Unauthorized"
                );
            }
        }

        // ===============================
        // 🔥 PRIVATE SECURITY
        // ===============================
        else {

            if (
                    !conversation.getUser1()
                            .getId()
                            .equals(userId)

                            &&

                            !conversation.getUser2()
                                    .getId()
                                    .equals(userId)
            ) {

                throw new RuntimeException(
                        "Unauthorized"
                );
            }
        }

        var existing =
                messageReactionRepository
                        .findByMessageAndUser(
                                message,
                                user
                        );

        if (existing.isPresent()) {

            MessageReaction reaction =
                    existing.get();

            // 🔥 same emoji remove
            if (
                    reaction.getEmoji()
                            .equals(emoji)
            ) {

                messageReactionRepository.delete(
                        reaction
                );

                return;
            }

            // 🔥 update emoji
            reaction.setEmoji(emoji);

            messageReactionRepository.save(
                    reaction
            );

        } else {

            MessageReaction reaction =
                    MessageReaction.builder()
                            .message(message)
                            .user(user)
                            .emoji(emoji)
                            .build();

            messageReactionRepository.save(
                    reaction
            );
        }
    }
}