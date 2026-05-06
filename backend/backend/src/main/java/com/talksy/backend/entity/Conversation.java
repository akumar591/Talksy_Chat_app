package com.talksy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "conversations",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user1_id", "user2_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 always smaller id user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    // 🔥 always larger id user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    // 🔥 last message (sidebar)
    private String lastMessage;

    private LocalDateTime lastMessageTime;

    // 🔥 unread count
    @Column(nullable = false)
    private Integer unreadCountUser1 = 0;

    @Column(nullable = false)
    private Integer unreadCountUser2 = 0;

    // 🕒 timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ===============================
    // 🔄 AUTO TIMESTAMP
    // ===============================
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (unreadCountUser1 == null) unreadCountUser1 = 0;
        if (unreadCountUser2 == null) unreadCountUser2 = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}