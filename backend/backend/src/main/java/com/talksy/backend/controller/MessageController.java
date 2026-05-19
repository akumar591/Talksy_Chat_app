package com.talksy.backend.controller;

import com.talksy.backend.entity.*;
import com.talksy.backend.payload.ApiResponse;

import com.talksy.backend.repository.MessageReactionRepository;

import com.talksy.backend.security.CustomUserDetails;

import com.talksy.backend.service.MessageService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/messages")

@RequiredArgsConstructor
public class MessageController {

    private final MessageService
            messageService;

    private final MessageReactionRepository
            messageReactionRepository;

    // ===============================
    // 🔐 GET CURRENT USER
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
    // 🔥 SEND MESSAGE
    // ===============================
    @PostMapping
    public ResponseEntity<ApiResponse<?>>
    sendMessage(

            @RequestBody
            Map<String, Object> body
    ) {

        try {

            User user =
                    getCurrentUser();

            Long conversationId =

                    Long.valueOf(

                            body.get(
                                    "conversationId"
                            ).toString()
                    );

            String content =

                    body.get(
                            "content"
                    ).toString();

            String type =

                    body.get("type") != null

                            ?

                            body.get("type")
                                    .toString()

                            :

                            "TEXT";

            // 🔥 REPLY SUPPORT
            Long replyToId =

                    body.get("replyToId") != null

                            ?

                            Long.valueOf(

                                    body.get(
                                            "replyToId"
                                    ).toString()
                            )

                            :

                            null;

            Message message =

                    messageService.sendMessage(

                            user.getId(),

                            conversationId,

                            content,

                            type,

                            replyToId,

                            // 🔥 NEW
                            body.get("statusId") != null
                                    ?
                                    Long.valueOf(
                                            body.get("statusId").toString()
                                    )
                                    :
                                    null,

                            body.get("statusMedia") != null
                                    ?
                                    body.get("statusMedia").toString()
                                    :
                                    null,

                            body.get("statusType") != null
                                    ?
                                    body.get("statusType").toString()
                                    :
                                    null,

                            body.get("statusCaption") != null
                                    ?
                                    body.get("statusCaption").toString()
                                    :
                                    null
                    );
            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "id",
                    message.getId()
            );

            response.put(
                    "content",
                    content
            );

            response.put(
                    "type",
                    message.getType()
            );

            response.put(
                    "createdAt",
                    message.getCreatedAt()
            );

            response.put(
                    "senderId",
                    message.getSender()
                            .getId()
            );

            response.put(
                    "senderName",
                    message.getSender()
                            .getName()
            );

            response.put(
                    "senderAvatar",
                    message.getSender()
                            .getAvatar()
            );

            response.put(
                    "isGroup",
                    message.getConversation()
                            .getIsGroup()
            );

            // ===============================
            // 🔥 STATUS PREVIEW DATA
            // ===============================
            response.put(
                    "statusId",
                    message.getStatusId()
            );

            response.put(
                    "statusMedia",
                    message.getStatusMedia()
            );

            response.put(
                    "statusType",
                    message.getStatusType()
            );

            response.put(
                    "statusCaption",
                    message.getStatusCaption()
            );

            // 🔥 REPLY DATA
            if (message.getReplyTo() != null) {

                Map<String, Object> reply =
                        new HashMap<>();

                reply.put(
                        "id",
                        message.getReplyTo()
                                .getId()
                );

                reply.put(
                        "content",
                        message.getReplyTo()
                                .getContent()
                );

                reply.put(
                        "senderId",
                        message.getReplyTo()
                                .getSender()
                                .getId()
                );

                reply.put(
                        "senderName",
                        message.getReplyTo()
                                .getSender()
                                .getName()
                );

                response.put(
                        "replyTo",
                        reply
                );
            }

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Message sent ✅",

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

    // ===============================
    // 🔥 GET MESSAGES
    // ===============================
    @GetMapping("/{conversationId}")
    public ResponseEntity<ApiResponse<?>>
    getMessages(

            @PathVariable
            Long conversationId
    ) {

        try {

            User user =
                    getCurrentUser();

            List<Message> messages =

                    messageService.getMessages(

                            user.getId(),

                            conversationId
                    );

            List<Map<String, Object>>
                    response =
                    new ArrayList<>();

            for (Message m : messages) {

                Conversation c =
                        m.getConversation();

                // ===============================
                // 🔥 PRIVATE CHAT DELETE LOGIC
                // ===============================
                if (!Boolean.TRUE.equals(
                        c.getIsGroup()
                )) {

                    if (

                            c.getUser1() != null

                                    &&

                                    c.getUser1()
                                            .getId()
                                            .equals(
                                                    user.getId()
                                            )

                                    &&

                                    m.isDeletedForUser1()

                    ) {

                        continue;
                    }

                    if (

                            c.getUser2() != null

                                    &&

                                    c.getUser2()
                                            .getId()
                                            .equals(
                                                    user.getId()
                                            )

                                    &&

                                    m.isDeletedForUser2()

                    ) {

                        continue;
                    }
                }

                Map<String, Object> map =
                        new HashMap<>();

                map.put(
                        "id",
                        m.getId()
                );

                // 🔥 DELETED
                if (m.isDeletedForEveryone()) {

                    map.put(
                            "content",
                            "This message was deleted"
                    );

                } else {

                    map.put(
                            "content",
                            m.getContent()
                    );
                }

                map.put(
                        "type",
                        m.getType()
                );

                map.put(
                        "createdAt",
                        m.getCreatedAt()
                );

                map.put(
                        "senderId",
                        m.getSender()
                                .getId()
                );

                map.put(
                        "senderName",
                        m.getSender()
                                .getName()
                );

                map.put(
                        "senderAvatar",
                        m.getSender()
                                .getAvatar()
                );

                map.put(
                        "isRead",
                        m.isRead()
                );

                map.put(
                        "isGroup",
                        c.getIsGroup()
                );

                // ===============================
                // 🔥 STATUS PREVIEW DATA
                // ===============================
                map.put(
                        "statusId",
                        m.getStatusId()
                );

                map.put(
                        "statusMedia",
                        m.getStatusMedia()
                );

                map.put(
                        "statusType",
                        m.getStatusType()
                );

                map.put(
                        "statusCaption",
                        m.getStatusCaption()
                );

                // ===============================
                // 🔥 REPLY DATA
                // ===============================
                if (m.getReplyTo() != null) {

                    Map<String, Object> reply =
                            new HashMap<>();

                    reply.put(
                            "id",
                            m.getReplyTo()
                                    .getId()
                    );

                    if (

                            m.getReplyTo()
                                    .isDeletedForEveryone()

                    ) {

                        reply.put(
                                "content",
                                "This message was deleted"
                        );

                    } else {

                        reply.put(
                                "content",
                                m.getReplyTo()
                                        .getContent()
                        );
                    }

                    reply.put(
                            "senderId",
                            m.getReplyTo()
                                    .getSender()
                                    .getId()
                    );

                    reply.put(
                            "senderName",
                            m.getReplyTo()
                                    .getSender()
                                    .getName()
                    );

                    map.put(
                            "replyTo",
                            reply
                    );
                }

                // ===============================
                // 🔥 REACTIONS
                // ===============================
                List<Map<String, Object>>
                        reactions =
                        new ArrayList<>();

                List<MessageReaction>
                        reactionList =

                        messageReactionRepository
                                .findByMessage(m);

                for (MessageReaction r : reactionList) {

                    Map<String, Object> rMap =
                            new HashMap<>();

                    rMap.put(
                            "userId",
                            r.getUser()
                                    .getId()
                    );

                    rMap.put(
                            "emoji",
                            r.getEmoji()
                    );

                    reactions.add(rMap);
                }

                map.put(
                        "reactions",
                        reactions
                );

                response.add(map);
            }

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Messages fetched ✅",

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

    // ===============================
    // 🔥 REACT TO MESSAGE
    // ===============================
    @PostMapping("/react")
    public ResponseEntity<ApiResponse<?>>
    reactToMessage(

            @RequestBody
            Map<String, Object> body
    ) {

        try {

            User user =
                    getCurrentUser();

            Long messageId =

                    Long.valueOf(
                            body.get(
                                    "messageId"
                            ).toString()
                    );

            String emoji =

                    body.get(
                            "emoji"
                    ).toString();

            messageService.reactToMessage(

                    user.getId(),
                    messageId,
                    emoji
            );

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Reaction updated ✅",

                            null
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

    // ===============================
    // 🔥 GET MEDIA MESSAGES
    // ===============================
    @GetMapping("/media/{conversationId}")
    public ResponseEntity<ApiResponse<?>>
    getMediaMessages(

            @PathVariable
            Long conversationId
    ) {

        try {

            User user =
                    getCurrentUser();

            List<Message> messages =

                    messageService.getMediaMessages(

                            user.getId(),

                            conversationId
                    );

            List<Map<String, Object>>
                    response =
                    new ArrayList<>();

            for (Message m : messages) {

                Map<String, Object> map =
                        new HashMap<>();

                map.put(
                        "id",
                        m.getId()
                );

                map.put(
                        "content",
                        m.getContent()
                );

                map.put(
                        "type",
                        m.getType()
                );

                map.put(
                        "createdAt",
                        m.getCreatedAt()
                );

                map.put(
                        "senderId",
                        m.getSender()
                                .getId()
                );

                map.put(
                        "senderName",
                        m.getSender()
                                .getName()
                );

                map.put(
                        "senderAvatar",
                        m.getSender()
                                .getAvatar()
                );

                response.add(map);
            }

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Media messages fetched ✅",

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

    // ===============================
    // 🔥 MARK AS READ
    // ===============================
    @PutMapping("/read/{conversationId}")
    public ResponseEntity<ApiResponse<?>>
    markAsRead(

            @PathVariable
            Long conversationId
    ) {

        try {

            User user =
                    getCurrentUser();

            messageService.markAsRead(

                    user.getId(),

                    conversationId
            );

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Messages marked as read ✅",

                            null
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

    // ===============================
    // 🔥 DELETE FOR EVERYONE
    // ===============================
    @DeleteMapping("/everyone/{messageId}")
    public ResponseEntity<ApiResponse<?>>
    deleteForEveryone(

            @PathVariable
            Long messageId
    ) {

        try {

            User user =
                    getCurrentUser();

            messageService.deleteForEveryone(

                    user.getId(),

                    messageId
            );

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Message deleted for everyone ✅",

                            null
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