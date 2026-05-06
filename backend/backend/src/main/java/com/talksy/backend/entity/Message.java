package com.talksy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 Conversation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    // 🔥 Sender
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // 🔥 Message content (encrypted store hoga)
    @Column(columnDefinition = "TEXT")
    private String content;

    // 🔥 Type (TEXT / IMAGE / VIDEO / FILE / VOICE)
    private String type;

    // 🔥 Reply support
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    private Message replyTo;

    // 🔥 Read status
    private boolean isRead = false;

    // ===============================
    // 🔥 DELETE SYSTEM (IMPORTANT)
    // ===============================

    // ❌ delete for everyone
    private boolean deletedForEveryone = false;

    // ❌ delete for user1
    private boolean deletedForUser1 = false;

    // ❌ delete for user2
    private boolean deletedForUser2 = false;

    // ===============================
    // ⏱️ TIMESTAMP
    // ===============================
    private LocalDateTime createdAt;

    // ===============================
    // ⏱️ AUTO TIME
    // ===============================
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}