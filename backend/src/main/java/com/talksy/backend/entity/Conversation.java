package com.talksy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    // ===============================
    // 🔥 ID
    // ===============================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===============================
    // 🔥 PRIVATE CHAT USERS
    // ===============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = true)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = true)
    private User user2;

    // ===============================
    // 🔥 GROUP SUPPORT
    // ===============================
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    // 🔥 identify conversation type
    @Column(nullable = false)
    private Boolean isGroup = false;

    // ===============================
    // 🔥 LAST MESSAGE
    // ===============================
    private String lastMessage;

    private LocalDateTime lastMessageTime;

    // ===============================
    // 🔥 PRIVATE CHAT UNREAD COUNTS
    // ===============================
    @Column(nullable = false)
    private Integer unreadCountUser1 = 0;

    @Column(nullable = false)
    private Integer unreadCountUser2 = 0;

    // ===============================
    // 🕒 TIMESTAMPS
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

        if (unreadCountUser1 == null) {
            unreadCountUser1 = 0;
        }

        if (unreadCountUser2 == null) {
            unreadCountUser2 = 0;
        }

        if (isGroup == null) {
            isGroup = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        this.updatedAt =
                LocalDateTime.now();
    }
}