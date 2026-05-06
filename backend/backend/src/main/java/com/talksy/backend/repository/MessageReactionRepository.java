package com.talksy.backend.repository;

import com.talksy.backend.entity.Message;
import com.talksy.backend.entity.MessageReaction;
import com.talksy.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {

    // 🔥 check if user already reacted
    Optional<MessageReaction> findByMessageAndUser(Message message, User user);

    // 🔥 get all reactions of a message
    List<MessageReaction> findByMessage(Message message);
}