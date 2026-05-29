package com.talksy.backend.repository;

import com.talksy.backend.entity.Status;
import com.talksy.backend.entity.StatusView;
import com.talksy.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StatusViewRepository
        extends JpaRepository<StatusView, Long> {

    // ===============================
    // 🔥 STATUS VIEWS
    // ===============================
    List<StatusView>
    findByStatus(
            Status status
    );

    // ===============================
    // 🔥 CHECK VIEWED
    // ===============================
    Optional<StatusView>
    findByStatusAndViewer(
            Status status,
            User viewer
    );

    // ===============================
    // 🔥 DELETE ALL STATUS VIEWS
    // ===============================
    void deleteByStatus(
            Status status
    );

    // ===============================
    // 🔥 LATEST VIEW
    // ===============================
    Optional<StatusView>
    findTopByStatusAndViewerOrderByViewedAtDesc(
            Status status,
            User viewer
    );

    // ===============================
    // 🔥 UNIQUE VIEW COUNT
    // ===============================
    long countDistinctByStatus(
            Status status
    );
}