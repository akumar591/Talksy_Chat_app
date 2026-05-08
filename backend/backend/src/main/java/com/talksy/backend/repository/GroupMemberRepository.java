package com.talksy.backend.repository;

import com.talksy.backend.entity.Group;
import com.talksy.backend.entity.GroupMember;
import com.talksy.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository
        extends JpaRepository<GroupMember, Long> {

    // 🔥 all members of group
    List<GroupMember> findByGroup(Group group);

    // 🔥 all groups of user
    List<GroupMember> findByUser(User user);

    // 🔥 check member exists
    Optional<GroupMember> findByGroupAndUser(
            Group group,
            User user
    );

    // 🔥 remove member
    void deleteByGroupAndUser(
            Group group,
            User user
    );
}