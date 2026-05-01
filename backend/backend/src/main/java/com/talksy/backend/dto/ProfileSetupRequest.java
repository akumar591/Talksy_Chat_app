package com.talksy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileSetupRequest {

    @NotBlank(message = "Phone is required ❌")
    private String phone;

    @NotBlank(message = "Name is required ❌")
    private String name;

    private String bio;

    private String avatar;
}