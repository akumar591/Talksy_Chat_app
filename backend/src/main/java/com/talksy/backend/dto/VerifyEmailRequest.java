package com.talksy.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyEmailRequest {
    @NotBlank(message = "Email required ❌")
    @Email(message = "Invalid email ❌")
    private String email;

    @NotBlank(message = "OTP required ❌")
    private String otp;
}