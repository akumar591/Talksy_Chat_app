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

    private Long id;

    private String name;

    private String about;

    private String avatar;

    // 🔥 creator
    private Long createdById;

    private String createdByName;

    private String createdByAvatar;

    // 🔥 members
    private int memberCount;

    private List<GroupMemberResponse> members;

    // 🔥 timestamps
    private LocalDateTime createdAt;
}