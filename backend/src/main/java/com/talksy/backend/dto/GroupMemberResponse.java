package com.talksy.backend.dto;

import com.talksy.backend.entity.GroupRole;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMemberResponse {

    // 🔥 membership id
    private Long id;

    // 🔥 actual user id
    private Long userId;

    private String name;

    private String avatar;

    private GroupRole role;
}