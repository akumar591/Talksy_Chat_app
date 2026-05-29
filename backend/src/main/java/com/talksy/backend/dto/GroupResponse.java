package com.talksy.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupResponse {

    // ===============================
    // 🔥 GROUP ID
    // ===============================
    private Long id;

    // ===============================
    // 🔥 GROUP INFO
    // ===============================
    private String name;

    private String about;

    private String avatar;

    // ===============================
    // 🔥 CONVERSATION ID
    // ===============================
    private Long conversationId;

    // ===============================
    // 🔥 CREATOR
    // ===============================
    private Long createdById;

    private String createdByName;

    private String createdByAvatar;

    // ===============================
    // 🔥 MEMBERS
    // ===============================
    private int memberCount;

    private List<GroupMemberResponse> members;

    // ===============================
    // 🕒 TIMESTAMPS
    // ===============================
    private LocalDateTime createdAt;
}