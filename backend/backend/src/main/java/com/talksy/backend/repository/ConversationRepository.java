package com.talksy.backend.repository;

import com.talksy.backend.entity.Conversation;
import com.talksy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // 🔥 find specific conversation between 2 users
    Optional<Conversation> findByUser1AndUser2(User user1, User user2);

    // 🔥 sidebar: user1 side
    List<Conversation> findByUser1(User user);

    // 🔥 sidebar: user2 side
    List<Conversation> findByUser2(User user);
}