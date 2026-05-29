package com.talksy.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDTO {

    private Long id;
    private String name;
    private String avatar;
    private String bio;
    private String phone;

    private boolean online;
    private LocalDateTime lastSeen;
}