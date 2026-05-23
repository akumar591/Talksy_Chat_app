package com.talksy.backend.dto;

import lombok.*;

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class MessageReactionResponse {

    private Long userId;

    private String emoji;
}