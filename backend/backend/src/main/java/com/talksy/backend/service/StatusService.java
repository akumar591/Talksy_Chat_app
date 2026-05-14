package com.talksy.backend.service;

import com.talksy.backend.dto.CreateStatusRequest;
import com.talksy.backend.dto.StatusResponse;
import com.talksy.backend.dto.StatusViewerResponse;

import com.talksy.backend.entity.*;

import com.talksy.backend.repository.*;

import com.talksy.backend.util.CryptoUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatusService {

    // ===============================
    // 🔥 REPOSITORIES
    // ===============================
    private final StatusRepository
            statusRepository;

    private final StatusViewRepository
            statusViewRepository;

    private final UserRepository
            userRepository;

    private final ConversationRepository
            conversationRepository;

    private final MessageRepository
            messageRepository;

    // ===============================
    // 🔥 CREATE STATUS
    // ===============================
    public StatusResponse createStatus(

            Long userId,

            CreateStatusRequest request
    ) {

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found ❌"
                                )
                        );

        Status status =
                Status.builder()

                        .user(user)

                        .mediaUrl(
                                request.getMediaUrl()
                        )

                        .type(
                                request.getType()
                        )

                        .caption(
                                request.getCaption()
                        )

                        .build();

        Status saved =
                statusRepository.save(status);

        return mapStatusResponse(
                saved,
                userId
        );
    }

    // ===============================
    // 🔥 MY STATUS
    // ===============================
    public List<StatusResponse>
    getMyStatuses(
            Long userId
    ) {

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found ❌"
                                )
                        );

        return statusRepository
                .findByUserOrderByCreatedAtDesc(
                        user
                )
                .stream()
                .filter(status ->
                        status.getExpiresAt()
                                .isAfter(
                                        LocalDateTime.now()
                                )
                )
                .map(status ->
                        mapStatusResponse(
                                status,
                                userId
                        )
                )
                .collect(Collectors.toList());
    }

    // ===============================
    // 🔥 GET VIEWERS
    // ===============================
    public List<StatusViewerResponse>
    getViewers(
            Long statusId
    ) {

        Status status =
                statusRepository
                        .findById(statusId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Status not found ❌"
                                )
                        );

        return statusViewRepository
                .findByStatus(status)
                .stream()
                .map(view ->

                        StatusViewerResponse
                                .builder()

                                .id(
                                        view.getViewer()
                                                .getId()
                                )

                                .name(
                                        view.getViewer()
                                                .getName()
                                )

                                .avatar(
                                        view.getViewer()
                                                .getAvatar()
                                )

                                .reaction(
                                        view.getReaction()
                                )

                                .viewedAt(
                                        view.getViewedAt()
                                )

                                .build()

                )
                .toList();
    }

    // ===============================
    // 🔥 STATUS FEED
    // ===============================
    public List<StatusResponse>
    getStatusFeed(
            Long userId
    ) {

        List<Status> statuses =
                statusRepository
                        .findByExpiresAtAfterOrderByCreatedAtDesc(
                                LocalDateTime.now()
                        );

        return statuses
                .stream()
                .filter(status ->
                        !status.getUser()
                                .getId()
                                .equals(userId)
                )
                .map(status ->
                        mapStatusResponse(
                                status,
                                userId
                        )
                )
                .collect(Collectors.toList());
    }

    // ===============================
    // 🔥 MARK VIEWED
    // ===============================
    public void markViewed(

            Long statusId,

            Long viewerId
    ) {

        Status status =
                statusRepository
                        .findById(statusId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Status not found ❌"
                                )
                        );

        User viewer =
                userRepository
                        .findById(viewerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Viewer not found ❌"
                                )
                        );

        boolean alreadyViewed =
                statusViewRepository
                        .findByStatusAndViewer(
                                status,
                                viewer
                        )
                        .isPresent();

        if (alreadyViewed)
            return;

        StatusView view =
                StatusView.builder()

                        .status(status)

                        .viewer(viewer)

                        .build();

        statusViewRepository.save(view);
    }

    // ===============================
    // 🔥 DELETE STATUS
    // ===============================
    @Transactional
    public void deleteStatus(

            Long statusId,

            Long userId
    ) {

        Status status =
                statusRepository
                        .findById(statusId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Status not found ❌"
                                )
                        );

        if (
                !status.getUser()
                        .getId()
                        .equals(userId)
        ) {

            throw new RuntimeException(
                    "Unauthorized ❌"
            );
        }

        statusViewRepository
                .deleteByStatus(status);

        statusRepository
                .delete(status);
    }

    // ===============================
    // 🔥 REACT TO STATUS
    // ===============================
    @Transactional
    public void reactToStatus(

            Long statusId,

            Long userId,

            String reaction
    ) {

        Status status =
                statusRepository
                        .findById(statusId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Status not found ❌"
                                )
                        );

        User viewer =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found ❌"
                                )
                        );

        StatusView statusView =
                statusViewRepository
                        .findTopByStatusAndViewerOrderByViewedAtDesc(
                                status,
                                viewer
                        )
                        .orElseGet(() ->

                                statusViewRepository.save(

                                        StatusView.builder()

                                                .status(status)

                                                .viewer(viewer)

                                                .build()
                                )
                        );

        statusView.setReaction(
                reaction
        );

        statusViewRepository.save(
                statusView
        );

        User owner =
                status.getUser();

        if (
                owner.getId()
                        .equals(userId)
        ) {

            return;
        }

        Optional<Conversation> existing =
                conversationRepository
                        .findByUser1AndUser2(
                                owner,
                                viewer
                        );

        if (existing.isEmpty()) {

            existing =
                    conversationRepository
                            .findByUser1AndUser2(
                                    viewer,
                                    owner
                            );
        }

        Conversation conversation;

        if (existing.isPresent()) {

            conversation =
                    existing.get();

        } else {

            conversation =
                    Conversation.builder()

                            .user1(owner)

                            .user2(viewer)

                            .isGroup(false)

                            .build();

            conversation =
                    conversationRepository
                            .save(conversation);
        }

        String text =
                reaction +
                        " reacted to your status";

        Message message =
                Message.builder()

                        .conversation(conversation)

                        .sender(viewer)

                        .content(
                                CryptoUtil.encrypt(
                                        text
                                )
                        )

                        .type("STATUS_REACTION")

                        // 🔥 STATUS DATA
                        .statusId(
                                status.getId()
                        )

                        .statusMedia(
                                status.getMediaUrl()
                        )

                        .statusType(
                                status.getType()
                                        .name()
                        )

                        .statusCaption(
                                status.getCaption()
                        )

                        .build();

        messageRepository.save(
                message
        );

        conversation.setLastMessage(
                text
        );

        conversation.setLastMessageTime(
                message.getCreatedAt()
        );

        if (
                conversation.getUser1()
                        .getId()
                        .equals(viewer.getId())
        ) {

            conversation.setUnreadCountUser2(
                    conversation.getUnreadCountUser2() + 1
            );

        } else {

            conversation.setUnreadCountUser1(
                    conversation.getUnreadCountUser1() + 1
            );
        }

        conversationRepository.save(
                conversation
        );
    }

    // ===============================
    // 🔥 REPLY TO STATUS
    // ===============================
    @Transactional
    public void replyToStatus(

            Long statusId,

            Long userId,

            String reply
    ) {

        Status status =
                statusRepository
                        .findById(statusId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Status not found ❌"
                                )
                        );

        User viewer =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found ❌"
                                )
                        );

        StatusView statusView =
                statusViewRepository
                        .findTopByStatusAndViewerOrderByViewedAtDesc(
                                status,
                                viewer
                        )
                        .orElseGet(() ->

                                statusViewRepository.save(

                                        StatusView.builder()

                                                .status(status)

                                                .viewer(viewer)

                                                .build()
                                )
                        );

        statusView.setReplyMessage(
                reply
        );

        statusViewRepository.save(
                statusView
        );

        User owner =
                status.getUser();

        if (
                owner.getId()
                        .equals(userId)
        ) {

            return;
        }

        Optional<Conversation> existing =
                conversationRepository
                        .findByUser1AndUser2(
                                owner,
                                viewer
                        );

        if (existing.isEmpty()) {

            existing =
                    conversationRepository
                            .findByUser1AndUser2(
                                    viewer,
                                    owner
                            );
        }

        Conversation conversation;

        if (existing.isPresent()) {

            conversation =
                    existing.get();

        } else {

            conversation =
                    Conversation.builder()

                            .user1(owner)

                            .user2(viewer)

                            .isGroup(false)

                            .build();

            conversation =
                    conversationRepository
                            .save(conversation);
        }

        String text =
                "Reply to your status: " +
                        reply;

        Message message =
                Message.builder()

                        .conversation(conversation)

                        .sender(viewer)

                        .content(
                                CryptoUtil.encrypt(
                                        text
                                )
                        )

                        .type("STATUS_REPLY")

                        // 🔥 STATUS DATA
                        .statusId(
                                status.getId()
                        )

                        .statusMedia(
                                status.getMediaUrl()
                        )

                        .statusType(
                                status.getType()
                                        .name()
                        )

                        .statusCaption(
                                status.getCaption()
                        )

                        .build();

        messageRepository.save(
                message
        );

        conversation.setLastMessage(
                text
        );

        conversation.setLastMessageTime(
                message.getCreatedAt()
        );

        if (
                conversation.getUser1()
                        .getId()
                        .equals(viewer.getId())
        ) {

            conversation.setUnreadCountUser2(
                    conversation.getUnreadCountUser2() + 1
            );

        } else {

            conversation.setUnreadCountUser1(
                    conversation.getUnreadCountUser1() + 1
            );
        }

        conversationRepository.save(
                conversation
        );
    }

    // ===============================
    // 🔥 MAP RESPONSE
    // ===============================
    private StatusResponse
    mapStatusResponse(

            Status status,

            Long currentUserId
    ) {

        List<StatusView> views =
                statusViewRepository
                        .findByStatus(status);

        boolean seen =
                views.stream()
                        .anyMatch(view ->
                                view.getViewer()
                                        .getId()
                                        .equals(currentUserId)
                        );

        List<StatusViewerResponse>
                viewers =
                views.stream()
                        .map(view ->

                                StatusViewerResponse
                                        .builder()

                                        .id(
                                                view.getViewer()
                                                        .getId()
                                        )

                                        .name(
                                                view.getViewer()
                                                        .getName()
                                        )

                                        .avatar(
                                                view.getViewer()
                                                        .getAvatar()
                                        )

                                        .reaction(
                                                view.getReaction()
                                        )

                                        .viewedAt(
                                                view.getViewedAt()
                                        )

                                        .build()

                        )
                        .collect(Collectors.toList());

        return StatusResponse
                .builder()

                .id(
                        status.getId()
                )

                .userId(
                        status.getUser()
                                .getId()
                )

                .name(
                        status.getUser()
                                .getName()
                )

                .avatar(
                        status.getUser()
                                .getAvatar()
                )

                .media(
                        status.getMediaUrl()
                )

                .type(
                        status.getType()
                )

                .caption(
                        status.getCaption()
                )

                .seen(seen)

                .views(viewers)

                .time(
                        formatTime(
                                status.getCreatedAt()
                        )
                )

                .createdAt(
                        status.getCreatedAt()
                )

                .build();
    }

    // ===============================
    // 🔥 FORMAT TIME
    // ===============================
    private String formatTime(
            LocalDateTime time
    ) {

        Duration duration =
                Duration.between(
                        time,
                        LocalDateTime.now()
                );

        long minutes =
                duration.toMinutes();

        long hours =
                duration.toHours();

        if (minutes < 1) {

            return "Just now";
        }

        if (minutes < 60) {

            return minutes +
                    " min ago";
        }

        if (hours < 24) {

            return hours +
                    " hr ago";
        }

        return "Yesterday";
    }
}