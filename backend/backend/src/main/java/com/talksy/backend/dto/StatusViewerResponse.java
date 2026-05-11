package com.talksy.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class StatusViewerResponse {

    // ===============================
    // 🔥 USER
    // ===============================
    private Long id;

    private String name;

    private String avatar;

    // ===============================
    // 🔥 REACTION
    // ===============================
    private String reaction;

    // ===============================
    // 🔥 VIEWED TIME
    // ===============================
    private LocalDateTime viewedAt;
}