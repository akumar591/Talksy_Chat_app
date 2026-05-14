package com.talksy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")

// 🔥 IMPORTANT
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class Message {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    // ===============================
    // 🔥 CONVERSATION
    // ===============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;

    // ===============================
    // 🔥 SENDER
    // ===============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "sender_id",
            nullable = false
    )
    private User sender;

    // ===============================
    // 🔥 MESSAGE CONTENT
    // ===============================
    @Column(columnDefinition = "TEXT")
    private String content;

    // ===============================
    // 🔥 TYPE
    // ===============================
    // TEXT / IMAGE / VIDEO / FILE / VOICE
    private String type;

    // ===============================
    // 🔥 REPLY SUPPORT
    // ===============================
    // 🔥 CHANGED TO EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reply_to_id")
    private Message replyTo;

    // ===============================
    // 🔥 STATUS REPLY SUPPORT
    // ===============================
    private Long statusId;

    @Column(columnDefinition = "TEXT")
    private String statusMedia;

    private String statusType;

    @Column(columnDefinition = "TEXT")
    private String statusCaption;

    // ===============================
    // 🔥 READ STATUS
    // ===============================
    private boolean isRead = false;

    // ===============================
    // 🔥 DELETE SYSTEM
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

        this.createdAt =
                LocalDateTime.now();
    }
}