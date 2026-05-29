package com.talksy.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(
        name = "otp",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"identifier", "type"})
        }
)
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 📱 phone OR 📧 email
    @Column(nullable = false)
    private String identifier;

    // 🔥 differentiate between PHONE & EMAIL
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpType type;

    // 🔐 hashed OTP
    @Column(nullable = false)
    private String otp;

    // ⏰ expiry time (5 min)
    @Column(nullable = false)
    private LocalDateTime expiryTime;

    // 🔥 brute-force protection
    @Column(nullable = false)
    private int attempts = 0;

    // 🔥 resend cooldown tracking
    @Column(name = "last_sent_at")
    private LocalDateTime lastSentAt;

    // ✅ OPTIONAL (future tracking / analytics)
    @Column(nullable = false)
    private boolean verified = false;
}