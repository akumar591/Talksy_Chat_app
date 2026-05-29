package com.talksy.backend.repository;

import com.talksy.backend.entity.Conversation;
import com.talksy.backend.entity.Group;
import com.talksy.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ConversationRepository
        extends JpaRepository<Conversation, Long> {

    // ===============================
    // 🔥 PRIVATE CHAT
    // ===============================
    Optional<Conversation> findByUser1AndUser2(
            User user1,
            User user2
    );

    // ===============================
    // 🔥 SIDEBAR
    // ===============================
    List<Conversation> findByUser1(
            User user
    );

    List<Conversation> findByUser2(
            User user
    );

    // ===============================
    // 🔥 GROUP CONVERSATION
    // ===============================
    Optional<Conversation> findByGroup(
            Group group
    );
}