package com.talksy.backend.controller;

import com.talksy.backend.entity.Conversation;
import com.talksy.backend.entity.User;
import com.talksy.backend.payload.ApiResponse;
import com.talksy.backend.service.ConversationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    // 🔐 get logged-in user
    private User getCurrentUser() {
        return (User) org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // ===============================
    // 🔥 OPEN / CREATE CHAT (FINAL)
    // ===============================
    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<?>> openChat(@PathVariable Long userId) {

        try {
            User currentUser = getCurrentUser();

            // ❌ Unauthorized
            if (currentUser == null) {
                return ResponseEntity.status(401)
                        .body(new ApiResponse<>(false, "Unauthorized", null));
            }

            // ❌ Self chat
            if (currentUser.getId().equals(userId)) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "You cannot chat with yourself", null));
            }

            // 🔥 Get/Create conversation
            Conversation conversation =
                    conversationService.getOrCreateConversation(currentUser.getId(), userId);

            if (conversation == null) {
                return ResponseEntity.status(500)
                        .body(new ApiResponse<>(false, "Failed to create conversation", null));
            }

            // 🔥 Find other user
            User otherUser = conversation.getUser1().getId().equals(currentUser.getId())
                    ? conversation.getUser2()
                    : conversation.getUser1();

            // 🔥 SAFE RESPONSE (NO Map.of)
            Map<String, Object> response = new HashMap<>();

            response.put("id", conversation.getId());
            response.put("userId", otherUser.getId());
            response.put("name", otherUser.getName());
            response.put("avatar", otherUser.getAvatar());
            response.put("online", otherUser.isOnline());
            response.put("lastSeen", otherUser.getLastSeen());
            response.put("lastMessage", conversation.getLastMessage());

            Integer unreadCount = conversation.getUser1().getId().equals(currentUser.getId())
                    ? conversation.getUnreadCountUser1()
                    : conversation.getUnreadCountUser2();

            response.put("unreadCount", unreadCount);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Conversation ready", response)
            );

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 debug

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}