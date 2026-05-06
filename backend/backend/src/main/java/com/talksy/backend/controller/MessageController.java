package com.talksy.backend.controller;

import com.talksy.backend.entity.*;
import com.talksy.backend.payload.ApiResponse;
import com.talksy.backend.repository.MessageReactionRepository;
import com.talksy.backend.service.MessageService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final MessageReactionRepository messageReactionRepository;

    // ===============================
    // 🔐 GET CURRENT USER
    // ===============================
    private User getCurrentUser() {
        return (User) org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // ===============================
    // 🔥 SEND MESSAGE
    // ===============================
    @PostMapping
    public ResponseEntity<ApiResponse<?>> sendMessage(@RequestBody Map<String, Object> body) {

        try {

            User user = getCurrentUser();

            if (user == null) {
                return ResponseEntity.status(401)
                        .body(new ApiResponse<>(false, "Unauthorized", null));
            }

            Long conversationId =
                    Long.valueOf(body.get("conversationId").toString());

            String content =
                    body.get("content").toString();

            String type =
                    body.get("type") != null
                            ? body.get("type").toString()
                            : "TEXT";

            // 🔥 reply support
            Long replyToId =
                    body.get("replyToId") != null
                            ? Long.valueOf(body.get("replyToId").toString())
                            : null;

            Message message = messageService.sendMessage(
                    user.getId(),
                    conversationId,
                    content,
                    type,
                    replyToId
            );

            Map<String, Object> response = new HashMap<>();

            response.put("id", message.getId());
            response.put("content", content);
            response.put("type", message.getType());
            response.put("createdAt", message.getCreatedAt());
            response.put("senderId", message.getSender().getId());

            // 🔥 reply response
            if (message.getReplyTo() != null) {

                Map<String, Object> reply = new HashMap<>();

                reply.put("id", message.getReplyTo().getId());
                reply.put("content", message.getReplyTo().getContent());
                reply.put("senderId",
                        message.getReplyTo().getSender().getId());

                response.put("replyTo", reply);
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Message sent", response)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ===============================
    // 🔥 GET MESSAGES
    // ===============================
    @GetMapping("/{conversationId}")
    public ResponseEntity<ApiResponse<?>> getMessages(
            @PathVariable Long conversationId
    ) {

        try {

            User user = getCurrentUser();

            if (user == null) {
                return ResponseEntity.status(401)
                        .body(new ApiResponse<>(false, "Unauthorized", null));
            }

            List<Message> messages =
                    messageService.getMessages(user.getId(), conversationId);

            List<Map<String, Object>> response =
                    new ArrayList<>();

            for (Message m : messages) {

                Conversation c = m.getConversation();

                // 🔥 DELETE FOR ME
                if (c.getUser1().getId().equals(user.getId())
                        && m.isDeletedForUser1()) {
                    continue;
                }

                if (c.getUser2().getId().equals(user.getId())
                        && m.isDeletedForUser2()) {
                    continue;
                }

                Map<String, Object> map = new HashMap<>();

                map.put("id", m.getId());

                // 🔥 deleted for everyone
                if (m.isDeletedForEveryone()) {
                    map.put("content", "This message was deleted");
                } else {
                    map.put("content", m.getContent());
                }

                map.put("type", m.getType());
                map.put("createdAt", m.getCreatedAt());
                map.put("senderId", m.getSender().getId());
                map.put("isRead", m.isRead());

                // ===============================
                // 🔥 REPLY DATA
                // ===============================
                if (m.getReplyTo() != null) {

                    Map<String, Object> reply =
                            new HashMap<>();

                    reply.put("id", m.getReplyTo().getId());

                    if (m.getReplyTo().isDeletedForEveryone()) {
                        reply.put("content",
                                "This message was deleted");
                    } else {
                        reply.put("content",
                                m.getReplyTo().getContent());
                    }

                    reply.put("senderId",
                            m.getReplyTo().getSender().getId());

                    map.put("replyTo", reply);
                }

                // ===============================
                // 🔥 REACTIONS
                // ===============================
                List<Map<String, Object>> reactions =
                        new ArrayList<>();

                List<MessageReaction> reactionList =
                        messageReactionRepository.findByMessage(m);

                for (MessageReaction r : reactionList) {

                    Map<String, Object> rMap =
                            new HashMap<>();

                    rMap.put("userId",
                            r.getUser().getId());

                    rMap.put("emoji",
                            r.getEmoji());

                    reactions.add(rMap);
                }

                map.put("reactions", reactions);

                response.add(map);
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(true,
                            "Messages fetched",
                            response)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false,
                            e.getMessage(),
                            null));
        }
    }

    // ===============================
    // 🔥 MARK AS READ
    // ===============================
    @PutMapping("/read/{conversationId}")
    public ResponseEntity<ApiResponse<?>> markAsRead(
            @PathVariable Long conversationId
    ) {

        try {

            User user = getCurrentUser();

            if (user == null) {
                return ResponseEntity.status(401)
                        .body(new ApiResponse<>(false,
                                "Unauthorized",
                                null));
            }

            messageService.markAsRead(
                    user.getId(),
                    conversationId
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(true,
                            "Messages marked as read",
                            null)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false,
                            e.getMessage(),
                            null));
        }
    }

    // ===============================
    // 🔥 DELETE FOR EVERYONE
    // ===============================
    @DeleteMapping("/everyone/{messageId}")
    public ResponseEntity<ApiResponse<?>> deleteForEveryone(
            @PathVariable Long messageId
    ) {

        try {

            User user = getCurrentUser();

            messageService.deleteForEveryone(
                    user.getId(),
                    messageId
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(true,
                            "Message deleted for everyone",
                            null)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false,
                            e.getMessage(),
                            null));
        }
    }

    // ===============================
    // 🔥 DELETE FOR ME
    // ===============================
    @DeleteMapping("/me/{messageId}")
    public ResponseEntity<ApiResponse<?>> deleteForMe(
            @PathVariable Long messageId
    ) {

        try {

            User user = getCurrentUser();

            messageService.deleteForMe(
                    user.getId(),
                    messageId
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(true,
                            "Message deleted for you",
                            null)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false,
                            e.getMessage(),
                            null));
        }
    }

    // ===============================
    // 🔥 CLEAR CHAT
    // ===============================
    @DeleteMapping("/clear/{conversationId}")
    public ResponseEntity<ApiResponse<?>> clearChat(
            @PathVariable Long conversationId
    ) {

        try {

            User user = getCurrentUser();

            messageService.clearChat(
                    user.getId(),
                    conversationId
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(true,
                            "Chat cleared",
                            null)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false,
                            e.getMessage(),
                            null));
        }
    }

    // ===============================
    // 🔥 REACT TO MESSAGE
    // ===============================
    @PostMapping("/react")
    public ResponseEntity<ApiResponse<?>> reactToMessage(
            @RequestBody Map<String, Object> body
    ) {

        try {

            User user = getCurrentUser();

            if (user == null) {
                return ResponseEntity.status(401)
                        .body(new ApiResponse<>(false,
                                "Unauthorized",
                                null));
            }

            Long messageId =
                    Long.valueOf(body.get("messageId").toString());

            String emoji =
                    body.get("emoji").toString();

            messageService.reactToMessage(
                    user.getId(),
                    messageId,
                    emoji
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(true,
                            "Reaction updated",
                            null)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false,
                            e.getMessage(),
                            null));
        }
    }
}