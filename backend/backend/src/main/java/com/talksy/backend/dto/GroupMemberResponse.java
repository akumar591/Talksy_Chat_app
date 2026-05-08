package com.talksy.backend.dto;

import com.talksy.backend.entity.GroupRole;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMemberResponse {

    private Long id;

    private String name;

    private String avatar;

    private GroupRole role;
}