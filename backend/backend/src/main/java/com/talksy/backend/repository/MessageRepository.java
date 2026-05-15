package com.talksy.backend.repository;

import com.talksy.backend.entity.Conversation;
import com.talksy.backend.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository
        extends JpaRepository<Message, Long> {

    // ===============================
    // 🔥 GET ALL MESSAGES (CHAT HISTORY)
    // ===============================
    List<Message>
    findByConversationOrderByCreatedAtAsc(
            Conversation conversation
    );

    // ===============================
    // 🔥 GET UNREAD MESSAGES
    // ===============================
    List<Message>
    findByConversationAndIsReadFalse(
            Conversation conversation
    );

    // ===============================
    // 🔥 GET UNREAD MESSAGES
    // 🔥 (EXCLUDE SENDER)
    // ===============================
    List<Message>
    findByConversationAndIsReadFalseAndSender_IdNot(

            Conversation conversation,

            Long senderId
    );

    // ===============================
    // 🔥 GET MEDIA MESSAGES
    // ===============================
    List<Message>
    findByConversationAndTypeInOrderByCreatedAtDesc(

            Conversation conversation,

            List<String> types
    );
}