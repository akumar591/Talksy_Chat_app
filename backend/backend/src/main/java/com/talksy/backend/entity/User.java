package com.talksy.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 📱 unique identity
    @Column(unique = true, nullable = false)
    private String phone;

    // 📧 optional but unique
    @Column(unique = true)
    private String email;

    // 👤 profile
    @Column(length = 50)
    private String name;

    @Column(length = 200)
    private String bio;

    // 🖼️ profile image URL
    private String avatar;

    // ✅ verification flags
    @Column(nullable = false)
    private boolean phoneVerified = false;

    @Column(nullable = false)
    private boolean emailVerified = false;

    // 🟢 last active
    private LocalDateTime lastSeen;

    // 🕒 timestamps
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ===============================
    // 🔄 AUTO TIMESTAMPS
    // ===============================
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}