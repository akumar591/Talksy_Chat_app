package com.talksy.backend.dto;

import lombok.*;

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class MessageReplyResponse {

    private Long id;

    private Long conversationId;

    private String content;

    private String type;

    private Long senderId;

    private String senderName;

    private String senderAvatar;

    private String senderRole;
}