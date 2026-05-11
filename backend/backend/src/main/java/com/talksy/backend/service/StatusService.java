package com.talksy.backend.service;

import com.talksy.backend.dto.CreateStatusRequest;
import com.talksy.backend.dto.StatusResponse;
import com.talksy.backend.dto.StatusViewerResponse;

import com.talksy.backend.entity.*;

import com.talksy.backend.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

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

        statusRepository.delete(status);
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