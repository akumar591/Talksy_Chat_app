package com.talksy.backend.mapper;

import com.talksy.backend.dto.*;

import com.talksy.backend.entity.*;

import com.talksy.backend.repository.GroupMemberRepository;
import com.talksy.backend.repository.MessageReactionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MessageMapper {

    private final MessageReactionRepository
            messageReactionRepository;

    private final GroupMemberRepository
            groupMemberRepository;

    // ===============================
    // 🔥 MESSAGE → RESPONSE
    // ===============================
    public MessageResponse toResponse(
            Message message
    ) {

        Conversation conversation =
                message.getConversation();

        // ===============================
        // 🔥 SENDER ROLE
        // ===============================
        String senderRole = null;

        // 🔥 ONLY GROUP
        if (Boolean.TRUE.equals(
                conversation.getIsGroup()
        )) {

            Group group =
                    conversation.getGroup();

            GroupMember member =

                    groupMemberRepository
                            .findByGroupAndUser(

                                    group,

                                    message.getSender()
                            )
                            .orElse(null);

            if (member != null) {

                // 🔥 CREATOR
                if (

                        group.getCreatedBy()
                                .getId()
                                .equals(

                                        message.getSender()
                                                .getId()
                                )
                ) {

                    senderRole =
                            "CREATOR";
                }

                // 🔥 ADMIN
                else if (

                        member.getRole() ==
                                GroupRole.ADMIN
                ) {

                    senderRole =
                            "ADMIN";
                }

                // 🔥 MEMBER
                else {

                    senderRole =
                            "MEMBER";
                }
            }
        }

        // ===============================
        // 🔥 REACTIONS
        // ===============================
        List<MessageReactionResponse>
                reactions =

                messageReactionRepository
                        .findByMessage(message)

                        .stream()

                        .map(r ->

                                MessageReactionResponse
                                        .builder()

                                        .userId(
                                                r.getUser()
                                                        .getId()
                                        )

                                        .emoji(
                                                r.getEmoji()
                                        )

                                        .build()
                        )

                        .toList();

        // ===============================
        // 🔥 REPLY
        // ===============================
        MessageReplyResponse reply =
                null;

        if (message.getReplyTo() != null) {

            Message replyMessage =
                    message.getReplyTo();

            String replyRole =
                    null;

            // 🔥 GROUP ROLE
            if (Boolean.TRUE.equals(
                    conversation.getIsGroup()
            )) {

                GroupMember member =

                        groupMemberRepository
                                .findByGroupAndUser(

                                        conversation
                                                .getGroup(),

                                        replyMessage
                                                .getSender()
                                )
                                .orElse(null);

                if (member != null) {

                    if (

                            conversation
                                    .getGroup()

                                    .getCreatedBy()

                                    .getId()

                                    .equals(

                                            replyMessage
                                                    .getSender()
                                                    .getId()
                                    )
                    ) {

                        replyRole =
                                "CREATOR";
                    }

                    else if (

                            member.getRole()
                                    ==
                                    GroupRole.ADMIN
                    ) {

                        replyRole =
                                "ADMIN";
                    }

                    else {

                        replyRole =
                                "MEMBER";
                    }
                }
            }

            reply =

                    MessageReplyResponse
                            .builder()

                            .id(
                                    replyMessage.getId()
                            )

                            .conversationId(

                                    replyMessage
                                            .getConversation()
                                            .getId()
                            )

                            .content(

                                    replyMessage
                                            .isDeletedForEveryone()

                                            ?

                                            "This message was deleted"

                                            :

                                            replyMessage
                                                    .getContent()
                            )

                            .type(
                                    replyMessage.getType()
                            )

                            .senderId(

                                    replyMessage
                                            .getSender()
                                            .getId()
                            )

                            .senderName(

                                    replyMessage
                                            .getSender()
                                            .getName()
                            )

                            .senderAvatar(

                                    replyMessage
                                            .getSender()
                                            .getAvatar()
                            )

                            .senderRole(
                                    replyRole
                            )

                            .build();
        }

        // ===============================
        // 🔥 MAIN RESPONSE
        // ===============================
        return MessageResponse
                .builder()

                .id(
                        message.getId()
                )

                .conversationId(

                        conversation.getId()
                )

                .content(

                        message
                                .isDeletedForEveryone()

                                ?

                                "This message was deleted"

                                :

                                message.getContent()
                )

                .type(
                        message.getType()
                )

                .createdAt(
                        message.getCreatedAt()
                )

                .senderId(

                        message.getSender()
                                .getId()
                )

                .senderName(

                        message.getSender()
                                .getName()
                )

                .senderAvatar(

                        message.getSender()
                                .getAvatar()
                )

                .senderRole(
                        senderRole
                )

                .isGroup(
                        conversation.getIsGroup()
                )

                .isRead(
                        message.isRead()
                )

                .receiverId(

                        !Boolean.TRUE.equals(
                                conversation.getIsGroup()
                        )

                                &&

                                conversation.getUser1() != null

                                &&

                                conversation.getUser2() != null

                                ?

                                conversation.getUser1()
                                        .getId()
                                        .equals(
                                                message.getSender()
                                                        .getId()
                                        )

                                        ?

                                        conversation.getUser2()
                                                .getId()

                                        :

                                        conversation.getUser1()
                                                .getId()

                                :

                                null
                )

                .deletedForEveryone(
                        message.isDeletedForEveryone()
                )

                // 🔥 STATUS
                .statusId(
                        message.getStatusId()
                )

                .statusMedia(
                        message.getStatusMedia()
                )

                .statusType(
                        message.getStatusType()
                )

                .statusCaption(
                        message.getStatusCaption()
                )

                // 🔥 REPLY
                .replyTo(reply)

                // 🔥 REACTIONS
                .reactions(reactions)

                .build();
    }
}