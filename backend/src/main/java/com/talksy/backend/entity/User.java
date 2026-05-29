package com.talksy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    // ===============================
    // 🟢 ONLINE / ACTIVITY
    // ===============================
    @Column(nullable = false)
    private boolean online = false;

    // 🔥 last activity (important for presence logic)
    private LocalDateTime lastActiveAt;

    // 🟢 last seen (shown in UI)
    private LocalDateTime lastSeen;

    // ===============================
    // 🕒 TIMESTAMPS
    // ===============================
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ===============================
    // 🔄 AUTO TIMESTAMPS
    // ===============================
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        // default activity
        this.lastActiveAt = now;

        if (!this.online) {
            this.lastSeen = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ===============================
    // 🔥 HELPER METHODS
    // ===============================

    // 🟢 mark user online
    public void markOnline() {
        this.online = true;
        this.lastActiveAt = LocalDateTime.now();
    }

    // 🔴 mark user offline
    public void markOffline() {
        this.online = false;
        this.lastSeen = LocalDateTime.now();
    }
}