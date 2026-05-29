package com.talksy.backend.controller;
import com.talksy.backend.entity.*;
import com.talksy.backend.payload.ApiResponse;
import com.talksy.backend.security.CustomUserDetails;
import com.talksy.backend.service.MessageService;
import com.talksy.backend.dto.MessageResponse;
import com.talksy.backend.mapper.MessageMapper;
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

    private final MessageMapper
            messageMapper;

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

            // ===============================
            // 🔥 DTO RESPONSE
            // ===============================
            MessageResponse response =

                    messageMapper
                            .toResponse(message);

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
            User user = getCurrentUser();
            List<Message> messages =
                    messageService.getMessages(
                            user.getId(),
                            conversationId
                    );
            List<MessageResponse>
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

                // ===============================
                // 🔥 DTO RESPONSE
                // ===============================
                MessageResponse dto =

                        messageMapper
                                .toResponse(m);

                response.add(dto);
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

            List<MessageResponse>
                    response =
                    new ArrayList<>();

            for (Message m : messages) {
                // ===============================
                // 🔥 DTO RESPONSE
                // ===============================
                MessageResponse dto =

                        messageMapper
                                .toResponse(m);

                response.add(dto);
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

    // ===============================
    // 🔥 DELETE FOR ME
    // ===============================
    @DeleteMapping("/me/{messageId}")
    public ResponseEntity<ApiResponse<?>>
    deleteForMe(

            @PathVariable
            Long messageId
    ) {

        try {

            User user =
                    getCurrentUser();

            messageService.deleteForMe(

                    user.getId(),

                    messageId
            );

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Message deleted for me ✅",

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
// 🔥 CLEAR CHAT
// ===============================
    @DeleteMapping("/clear/{conversationId}")
    public ResponseEntity<ApiResponse<?>>
    clearChat(

            @PathVariable
            Long conversationId
    ) {

        try {

            User user =
                    getCurrentUser();

            messageService.clearChat(

                    user.getId(),

                    conversationId
            );

            return ResponseEntity.ok(

                    new ApiResponse<>(

                            true,

                            "Chat cleared ✅",

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