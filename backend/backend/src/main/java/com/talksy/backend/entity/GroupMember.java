package com.talksy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "group_members",

        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "group_id",
                                "user_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMember {

    // ===============================
    // 🔥 ID
    // ===============================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===============================
    // 🔥 GROUP
    // ===============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    // ===============================
    // 🔥 USER
    // ===============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // ===============================
    // 🔥 ROLE
    // ===============================
    @Enumerated(EnumType.STRING)
    private GroupRole role;

    // ===============================
    // 🕒 JOINED TIME
    // ===============================
    private LocalDateTime joinedAt;

    // ===============================
    // 🔄 AUTO TIME
    // ===============================
    @PrePersist
    protected void onCreate() {

        this.joinedAt =
                LocalDateTime.now();
    }
}