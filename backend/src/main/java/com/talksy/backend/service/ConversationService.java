package com.talksy.backend.service;

import com.talksy.backend.entity.Conversation;
import com.talksy.backend.entity.User;
import com.talksy.backend.repository.ConversationRepository;
import com.talksy.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    // ===============================
    // 🔥 GET OR CREATE CONVERSATION
    // ===============================
    public Conversation getOrCreateConversation(
            Long currentUserId,
            Long otherUserId
    ) {

        if (currentUserId.equals(otherUserId)) {
            throw new RuntimeException(
                    "You cannot chat with yourself"
            );
        }

        // 🔥 fetch users
        User userA = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        User userB = userRepository.findById(otherUserId)
                .orElseThrow(() ->
                        new RuntimeException("Other user not found"));

        // 🔥 SORT USERS
        User user1 =
                userA.getId() < userB.getId()
                        ? userA
                        : userB;

        User user2 =
                userA.getId() < userB.getId()
                        ? userB
                        : userA;

        // 🔍 existing conversation
        Optional<Conversation> existing =
                conversationRepository
                        .findByUser1AndUser2(user1, user2);

        if (existing.isPresent()) {
            return existing.get();
        }

        // 🆕 create
        Conversation conversation =
                Conversation.builder()
                        .user1(user1)
                        .user2(user2)
                        .build();

        return conversationRepository.save(conversation);
    }

    // ===============================
    // 🔥 GET CONVERSATION IF EXISTS
    // ===============================
    public Conversation getConversationIfExists(
            Long currentUserId,
            Long otherUserId
    ) {

        User userA = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        User userB = userRepository.findById(otherUserId)
                .orElseThrow(() ->
                        new RuntimeException("Other user not found"));

        // 🔥 SORT USERS
        User user1 =
                userA.getId() < userB.getId()
                        ? userA
                        : userB;

        User user2 =
                userA.getId() < userB.getId()
                        ? userB
                        : userA;

        return conversationRepository
                .findByUser1AndUser2(user1, user2)
                .orElse(null);
    }
}