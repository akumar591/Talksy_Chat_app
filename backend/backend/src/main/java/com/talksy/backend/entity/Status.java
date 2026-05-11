package com.talksy.backend.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "statuses")

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class Status {

    // ===============================
    // 🔥 ID
    // ===============================
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    // ===============================
    // 🔥 STATUS OWNER
    // ===============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    // ===============================
    // 🔥 MEDIA
    // ===============================
    @Column(
            columnDefinition = "TEXT"
    )
    private String mediaUrl;

    // ===============================
    // 🔥 TYPE
    // ===============================
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusType type;

    // ===============================
    // 🔥 CAPTION
    // ===============================
    @Column(
            columnDefinition = "TEXT"
    )
    private String caption;

    // ===============================
    // 🔥 EXPIRE TIME
    // ===============================
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // ===============================
    // 🔥 TIMESTAMPS
    // ===============================
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ===============================
    // 🔄 AUTO TIMESTAMP
    // ===============================
    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        this.createdAt = now;

        this.updatedAt = now;

        // 🔥 AUTO EXPIRE
        if (this.expiresAt == null) {

            this.expiresAt =
                    now.plusHours(24);
        }
    }

    @PreUpdate
    protected void onUpdate() {

        this.updatedAt =
                LocalDateTime.now();
    }
}