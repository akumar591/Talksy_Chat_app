package com.talksy.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class MessageResponse {

    // ===============================
    // 🔥 MESSAGE
    // ===============================
    private Long id;

    private Long conversationId;

    private String content;

    private String type;

    private LocalDateTime createdAt;

    // ===============================
    // 🔥 SENDER
    // ===============================
    private Long senderId;

    private String senderName;

    private String senderAvatar;

    // 🔥 MEMBER / ADMIN / CREATOR
    private String senderRole;

    // ===============================
    // 🔥 CHAT TYPE
    // ===============================
    private Boolean isGroup;

    private Boolean isRead;

    private Long receiverId;

    // ===============================
    // 🔥 DELETE
    // ===============================
    private Boolean deletedForEveryone;

    // ===============================
    // 🔥 STATUS
    // ===============================
    private Long statusId;

    private String statusMedia;

    private String statusType;

    private String statusCaption;

    // ===============================
    // 🔥 REPLY
    // ===============================
    private MessageReplyResponse replyTo;

    // ===============================
    // 🔥 REACTIONS
    // ===============================
    private List<MessageReactionResponse>
            reactions;
}