package com.talksy.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateGroupRequest {

    // ===============================
    // 🔥 GROUP INFO
    // ===============================
    private String name;

    private String about;

    private String avatar;

    // ===============================
    // 🔥 MEMBERS
    // ===============================
    private List<Long> members;

    // ===============================
    // 🔥 ADMINS
    // ===============================
    private List<Long> admins;
}