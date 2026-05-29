package com.talksy.backend.repository;

import com.talksy.backend.entity.Group;
import com.talksy.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository
        extends JpaRepository<Group, Long> {

    // ===============================
    // 🔥 GROUPS CREATED BY USER
    // ===============================
    List<Group> findByCreatedBy(
            User user
    );

    // ===============================
    // 🔥 SEARCH GROUPS
    // ===============================
    List<Group> findByNameContainingIgnoreCase(
            String keyword
    );
}