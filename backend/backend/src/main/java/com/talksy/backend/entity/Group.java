package com.talksy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {

    // ===============================
    // 🔥 ID
    // ===============================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===============================
    // 🔥 GROUP INFO
    // ===============================
    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String about;

    // 🖼️ group image
    private String avatar;

    // ===============================
    // 🔥 CREATOR
    // ===============================
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    private User createdBy;

    // ===============================
    // 🔥 MEMBERS
    // ===============================
    @OneToMany(
            mappedBy = "group",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<GroupMember> members;

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

        LocalDateTime now =
                LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {

        this.updatedAt =
                LocalDateTime.now();
    }
}