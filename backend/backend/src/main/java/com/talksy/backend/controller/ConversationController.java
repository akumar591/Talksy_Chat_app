package com.talksy.backend.controller;

import com.talksy.backend.entity.Conversation;
import com.talksy.backend.entity.User;

import com.talksy.backend.payload.ApiResponse;

import com.talksy.backend.security.CustomUserDetails;

import com.talksy.backend.service.ConversationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")

@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService
            conversationService;

    // ===============================
    // 🔐 GET LOGGED-IN USER
    // ===============================
    private User getCurrentUser() {

        Object principal =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        // 🔥 CUSTOM USER DETAILS
        if (principal instanceof CustomUserDetails userDetails) {

            return userDetails.getUser();
        }

        throw new RuntimeException(
                "Unauthorized user ❌"
        );
    }

    // ===============================
    // 🔥 OPEN / CREATE CHAT
    // ===============================
    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<?>>
    openChat(

            @PathVariable
            Long userId
    ) {

        try {

            User currentUser =
                    getCurrentUser();

            // ❌ UNAUTHORIZED
            if (currentUser == null) {

                return ResponseEntity
                        .status(401)
                        .body(

                                new ApiResponse<>(

                                        false,

                                        "Unauthorized ❌",

                                        null
                                )
                        );
            }

            // ❌ SELF CHAT
            if (

                    currentUser.getId()
                            .equals(userId)

            ) {

                return ResponseEntity
                        .badRequest()
                        .body(

                                new ApiResponse<>(

                                        false,

                                        "You cannot chat with yourself ❌",

                                        null
                                )
                        );
            }

            // 🔥 GET OR CREATE
            Conversation conversation =

                    conversationService
                            .getOrCreateConversation(

                                    currentUser.getId(),

                                    userId
                            );

            if (conversation == null) {

                return ResponseEntity
                        .status(500)
                        .body(

                                new ApiResponse<>(

                                        false,

                                        "Failed to create conversation ❌",

                                        null
                                )
                        );
            }

            // 🔥 FIND OTHER USER
            User otherUser =

                    conversation.getUser1()
                            .getId()
                            .equals(
                                    currentUser.getId()
                            )

                            ?

                            conversation.getUser2()

                            :

                            conversation.getUser1();

            // 🔥 SAFE RESPONSE
            Map<String, Object>
                    response =
                    new HashMap<>();

            response.put(
                    "id",
                    conversation.getId()
            );

            response.put(
                    "userId",
                    otherUser.getId()
            );

            response.put(
                    "name",
                    otherUser.getName()
            );

            response.put(
                    "avatar",
                    otherUser.getAvatar()
            );

            response.put(
                    "online",
                    otherUser.isOnline()
            );

            response.put(
                    "lastSeen",
                    otherUser.getLastSeen()
            );

            response.put(
                    "lastMessage",
                    conversation.getLastMessage()
            );

            Integer unreadCount =

                    conversation.getUser1()
                            .getId()
                            .equals(
                                    currentUser.getId()
                            )

                            ?

                            conversation.getUnreadCountUser1()

                            :

                            conversation.getUnreadCountUser2();

            response.put(
                    "unreadCount",
                    unreadCount
            );

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Conversation ready ✅",

                            response
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(

                            new ApiResponse<>(

                                    false,

                                    e.getMessage(),

                                    null
                            )
                    );
        }
    }
}