package com.talksy.backend.repository;

import com.talksy.backend.entity.Status;
import com.talksy.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StatusRepository
        extends JpaRepository<Status, Long> {

    // ===============================
    // 🔥 MY STATUS
    // ===============================
    List<Status>
    findByUserOrderByCreatedAtDesc(
            User user
    );

    // ===============================
    // 🔥 ACTIVE STATUS
    // ===============================
    List<Status>
    findByExpiresAtAfterOrderByCreatedAtDesc(
            LocalDateTime now
    );

    // ===============================
    // 🔥 CONTACT STATUS
    // ===============================
    List<Status>
    findByUserInAndExpiresAtAfterOrderByCreatedAtDesc(
            List<User> users,
            LocalDateTime now
    );
}