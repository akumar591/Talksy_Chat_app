package com.talksy.backend.dto;

import com.talksy.backend.entity.StatusType;

import lombok.*;

import java.time.LocalDateTime;

import java.util.List;

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class StatusResponse {

    // ===============================
    // 🔥 STATUS ID
    // ===============================
    private Long id;

    // ===============================
    // 🔥 USER
    // ===============================
    private Long userId;

    private String name;

    private String avatar;

    // ===============================
    // 🔥 MEDIA
    // ===============================
    private String media;

    private StatusType type;

    private String caption;

    // ===============================
    // 🔥 VIEW
    // ===============================
    private boolean seen;

    private List<StatusViewerResponse> views;

    // ===============================
    // 🔥 TIME
    // ===============================
    private String time;

    private LocalDateTime createdAt;
}