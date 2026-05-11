package com.talksy.backend.service;

import com.talksy.backend.dto.CreateGroupRequest;
import com.talksy.backend.dto.GroupMemberResponse;
import com.talksy.backend.dto.GroupResponse;

import com.talksy.backend.entity.*;

import com.talksy.backend.repository.ConversationRepository;
import com.talksy.backend.repository.GroupMemberRepository;
import com.talksy.backend.repository.GroupRepository;
import com.talksy.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository
            groupRepository;

    private final GroupMemberRepository
            groupMemberRepository;

    private final UserRepository
            userRepository;

    // 🔥 NEW
    private final ConversationRepository
            conversationRepository;

    // ===============================
    // 🔥 CREATE GROUP
    // ===============================
    public Group createGroup(
            CreateGroupRequest request,
            Long currentUserId
    ) {

        User creator =
                getUserOrThrow(currentUserId);

        // 🔥 CREATE GROUP
        Group group = Group.builder()

                .name(request.getName())

                .about(request.getAbout())

                .avatar(request.getAvatar())

                .createdBy(creator)

                .build();

        Group savedGroup =
                groupRepository.save(group);

        // ===============================
        // 🔥 CREATE GROUP CONVERSATION
        // ===============================
        Conversation conversation =
                Conversation.builder()

                        .group(savedGroup)

                        .isGroup(true)

                        .build();

        conversationRepository.save(
                conversation
        );

        // 🔥 CREATOR = ADMIN
        GroupMember creatorMember =
                GroupMember.builder()

                        .group(savedGroup)

                        .user(creator)

                        .role(GroupRole.ADMIN)

                        .build();

        groupMemberRepository.save(
                creatorMember
        );

        // 🔥 ADD MEMBERS
        List<Long> memberIds =
                request.getMembers();

        if (memberIds != null) {

            for (Long memberId : memberIds) {

                // ❌ skip creator duplicate
                if (memberId.equals(currentUserId)) {
                    continue;
                }

                User member =
                        getUserOrThrow(memberId);

                // 🔥 role
                GroupRole role =
                        request.getAdmins() != null
                                &&
                                request.getAdmins()
                                        .contains(memberId)

                                ? GroupRole.ADMIN

                                : GroupRole.MEMBER;

                GroupMember groupMember =
                        GroupMember.builder()

                                .group(savedGroup)

                                .user(member)

                                .role(role)

                                .build();

                groupMemberRepository.save(
                        groupMember
                );
            }
        }

        return savedGroup;
    }

    // ===============================
    // 🔥 GET MY GROUPS
    // ===============================
    public List<GroupResponse> getMyGroups(
            Long currentUserId
    ) {

        User currentUser =
                getUserOrThrow(currentUserId);

        List<GroupMember> memberships =
                groupMemberRepository.findByUser(
                        currentUser
                );

        return memberships
                .stream()
                .map(GroupMember::getGroup)
                .map(this::convertToResponse)
                .toList();
    }

    // ===============================
    // 🔥 GET GROUP BY ID
    // ===============================
    public GroupResponse getGroupById(
            Long groupId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        return convertToResponse(group);
    }

    // ===============================
    // 🔥 UPDATE GROUP
    // ONLY CREATOR
    // ===============================
    public Group updateGroup(
            Long groupId,
            CreateGroupRequest request,
            Long currentUserId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        if (
                !group.getCreatedBy()
                        .getId()
                        .equals(currentUserId)
        ) {

            throw new RuntimeException(
                    "Only creator can update group"
            );
        }

        group.setName(
                request.getName()
        );

        group.setAbout(
                request.getAbout()
        );

        group.setAvatar(
                request.getAvatar()
        );

        return groupRepository.save(group);
    }

    // ===============================
    // 🔥 ADD MEMBER
    // ===============================
    public void addMember(
            Long groupId,
            Long memberId,
            Long currentUserId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        if (
                !isCreator(group, currentUserId)
                        &&
                        !isAdmin(group, currentUserId)
        ) {

            throw new RuntimeException(
                    "Only admin can add members"
            );
        }

        User member =
                getUserOrThrow(memberId);

        boolean exists =
                groupMemberRepository
                        .findByGroupAndUser(
                                group,
                                member
                        )
                        .isPresent();

        if (exists) {

            throw new RuntimeException(
                    "User already exists in group"
            );
        }

        GroupMember groupMember =
                GroupMember.builder()

                        .group(group)

                        .user(member)

                        .role(GroupRole.MEMBER)

                        .build();

        groupMemberRepository.save(
                groupMember
        );
    }

    // ===============================
    // 🔥 REMOVE MEMBER
    // ===============================
    public void removeMember(
            Long groupId,
            Long memberId,
            Long currentUserId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        User targetUser =
                getUserOrThrow(memberId);

        GroupMember targetMember =
                groupMemberRepository
                        .findByGroupAndUser(
                                group,
                                targetUser
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Member not found"
                                )
                        );

        if (isCreator(group, currentUserId)) {

            if (
                    targetUser.getId().equals(
                            currentUserId
                    )
            ) {

                throw new RuntimeException(
                        "Creator cannot remove self"
                );
            }

            groupMemberRepository
                    .delete(targetMember);

            return;
        }

        if (isAdmin(group, currentUserId)) {

            if (
                    targetMember.getRole()
                            == GroupRole.ADMIN
            ) {

                throw new RuntimeException(
                        "Admin cannot remove another admin"
                );
            }

            groupMemberRepository
                    .delete(targetMember);

            return;
        }

        throw new RuntimeException(
                "Not allowed"
        );
    }

    // ===============================
    // 🔥 MAKE ADMIN
    // ===============================
    public void makeAdmin(
            Long groupId,
            Long memberId,
            Long currentUserId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        if (
                !isCreator(group, currentUserId)
        ) {

            throw new RuntimeException(
                    "Only creator can assign admin"
            );
        }

        User user =
                getUserOrThrow(memberId);

        GroupMember member =
                groupMemberRepository
                        .findByGroupAndUser(
                                group,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Member not found"
                                )
                        );

        member.setRole(
                GroupRole.ADMIN
        );

        groupMemberRepository.save(member);
    }

    // ===============================
    // 🔥 REMOVE ADMIN
    // ===============================
    public void removeAdmin(
            Long groupId,
            Long memberId,
            Long currentUserId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        if (
                !isCreator(group, currentUserId)
        ) {

            throw new RuntimeException(
                    "Only creator can remove admin"
            );
        }

        User user =
                getUserOrThrow(memberId);

        if (
                user.getId().equals(
                        group.getCreatedBy().getId()
                )
        ) {

            throw new RuntimeException(
                    "Cannot remove creator admin"
            );
        }

        GroupMember member =
                groupMemberRepository
                        .findByGroupAndUser(
                                group,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Member not found"
                                )
                        );

        member.setRole(
                GroupRole.MEMBER
        );

        groupMemberRepository.save(member);
    }

    // ===============================
    // 🔥 DELETE GROUP
    // ===============================
    public void deleteGroup(
            Long groupId,
            Long currentUserId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        if (
                !isCreator(group, currentUserId)
        ) {

            throw new RuntimeException(
                    "Only creator can delete group"
            );
        }

        groupRepository.delete(group);
    }

    // ===============================
    // 🔥 LEAVE GROUP
    // ===============================
    public void leaveGroup(
            Long groupId,
            Long currentUserId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        if (
                isCreator(group, currentUserId)
        ) {

            throw new RuntimeException(
                    "Creator cannot leave group"
            );
        }

        User user =
                getUserOrThrow(currentUserId);

        GroupMember member =
                groupMemberRepository
                        .findByGroupAndUser(
                                group,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Member not found"
                                )
                        );

        groupMemberRepository.delete(member);
    }

    // ===============================
    // 🔥 HELPERS
    // ===============================
    private Group getGroupOrThrow(
            Long groupId
    ) {

        return groupRepository
                .findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Group not found"
                        )
                );
    }

    private User getUserOrThrow(
            Long userId
    ) {

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }

    // ===============================
    // 🔥 ROLE CHECKS
    // ===============================
    private boolean isCreator(
            Group group,
            Long userId
    ) {

        return group.getCreatedBy()
                .getId()
                .equals(userId);
    }

    private boolean isAdmin(
            Group group,
            Long userId
    ) {

        User user =
                getUserOrThrow(userId);

        return groupMemberRepository
                .findByGroupAndUser(
                        group,
                        user
                )
                .map(member ->
                        member.getRole()
                                == GroupRole.ADMIN
                )
                .orElse(false);
    }

    // ===============================
// 🔥 CONVERT TO DTO
// ===============================
    private GroupResponse convertToResponse(
            Group group
    ) {

        List<GroupMember> groupMembers =
                groupMemberRepository.findByGroup(
                        group
                );

        List<GroupMemberResponse> members =

                groupMembers.stream()

                        .map(member ->

                                GroupMemberResponse.builder()

                                        .id(
                                                member.getUser()
                                                        .getId()
                                        )

                                        .name(
                                                member.getUser()
                                                        .getName()
                                        )

                                        .avatar(
                                                member.getUser()
                                                        .getAvatar()
                                        )

                                        .role(
                                                member.getRole()
                                        )

                                        .build()
                        )

                        .collect(Collectors.toList());

        // ===============================
        // 🔥 GET GROUP CONVERSATION
        // ===============================
        Conversation conversation =
                conversationRepository
                        .findByGroup(group)
                        .orElse(null);

        return GroupResponse.builder()

                .id(group.getId())

                .name(group.getName())

                .about(group.getAbout())

                .avatar(group.getAvatar())

                // 🔥 NEW
                .conversationId(
                        conversation != null
                                ? conversation.getId()
                                : null
                )

                .createdById(
                        group.getCreatedBy()
                                .getId()
                )

                .createdByName(
                        group.getCreatedBy()
                                .getName()
                )

                .createdByAvatar(
                        group.getCreatedBy()
                                .getAvatar()
                )

                .memberCount(
                        members.size()
                )

                .members(
                        members
                )

                .createdAt(
                        group.getCreatedAt()
                )

                .build();
    }
}