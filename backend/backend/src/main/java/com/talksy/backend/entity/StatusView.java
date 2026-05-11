package com.talksy.backend.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "status_views")

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder
public class StatusView {

    // ===============================
    // 🔥 ID
    // ===============================
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    // ===============================
    // 🔥 STATUS
    // ===============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "status_id",
            nullable = false
    )
    private Status status;

    // ===============================
    // 🔥 VIEWER
    // ===============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "viewer_id",
            nullable = false
    )
    private User viewer;

    // ===============================
    // 🔥 REACTION
    // ===============================
    private String reaction;

    // ===============================
    // 🔥 REPLY MESSAGE
    // ===============================
    @Column(
            columnDefinition = "TEXT"
    )
    private String replyMessage;

    // ===============================
    // 🔥 VIEWED TIME
    // ===============================
    private LocalDateTime viewedAt;

    // ===============================
    // 🔄 AUTO TIME
    // ===============================
    @PrePersist
    protected void onCreate() {

        if (viewedAt == null) {

            viewedAt =
                    LocalDateTime.now();
        }
    }
}