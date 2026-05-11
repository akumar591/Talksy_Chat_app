package com.talksy.backend.dto;

import com.talksy.backend.entity.StatusType;

import lombok.*;

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class CreateStatusRequest {

    // ===============================
    // 🔥 MEDIA URL
    // ===============================
    private String mediaUrl;

    // ===============================
    // 🔥 TYPE
    // ===============================
    private StatusType type;

    // ===============================
    // 🔥 CAPTION
    // ===============================
    private String caption;
}