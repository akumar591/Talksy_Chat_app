package com.talksy.backend.repository;

import com.talksy.backend.entity.Conversation;
import com.talksy.backend.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // ===============================
    // 🔥 DELETE ALL MESSAGES
    // 🔥 BY CONVERSATION
    // ===============================
    @Modifying
    @Transactional
    void deleteByConversation(
            Conversation conversation
    );

        // ===============================
        // 🔥 REMOVE REPLY REFERENCES
        // ===============================
            @Modifying
            @Query("""
        
        UPDATE Message m
        
        SET m.replyTo = null
        
        WHERE m.replyTo.id = :messageId
        
        """)
            void clearReplyReferences(
                    @Param("messageId")
                    Long messageId
            );
}

