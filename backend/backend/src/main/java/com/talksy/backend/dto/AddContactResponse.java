package com.talksy.backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddContactResponse {

    private boolean exists;
    private String message;

    private Long id;
    private String name;
    private String phone;

    private String avatar;
    private String bio;

    private boolean blocked;
}