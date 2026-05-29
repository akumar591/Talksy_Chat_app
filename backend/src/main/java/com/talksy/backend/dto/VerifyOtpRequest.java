package com.talksy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyOtpRequest {

    @NotBlank(message = "Phone required ❌")
    private String phone;

    @NotBlank(message = "OTP required ❌")
    private String otp;
}