package com.talksy.backend.service;

import com.talksy.backend.dto.CreateGroupRequest;
import com.talksy.backend.dto.GroupMemberResponse;
import com.talksy.backend.dto.GroupResponse;

import com.talksy.backend.entity.*;

import com.talksy.backend.repository.ConversationRepository;
import com.talksy.backend.repository.GroupMemberRepository;
import com.talksy.backend.repository.GroupRepository;
import com.talksy.backend.repository.UserRepository;
import com.talksy.backend.repository.MessageRepository;
import com.talksy.backend.repository.MessageReactionRepository;

import com.talksy.backend.util.CryptoUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    private final MessageRepository
            messageRepository;

    private final MessageReactionRepository
            messageReactionRepository;

    private final CloudinaryService
            cloudinaryService;

    private final ObjectMapper
            objectMapper;

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
// ONLY GROUP MEMBER
// ===============================
    public GroupResponse getGroupById(

            Long groupId,

            Long currentUserId
    ) {

        Group group =
                getGroupOrThrow(groupId);

        User currentUser =
                getUserOrThrow(currentUserId);

        boolean isMember =

                groupMemberRepository
                        .findByGroupAndUser(

                                group,

                                currentUser
                        )
                        .isPresent();

        if (!isMember) {

            throw new RuntimeException(
                    "Access denied"
            );
        }

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

        String newAvatar =
                request.getAvatar();

        String oldAvatar =
                group.getAvatar();

// ===============================
// 🔥 DELETE OLD AVATAR
// ===============================
        if (

                oldAvatar != null

                        &&

                        !oldAvatar.isBlank()

                        &&

                        (
                                newAvatar == null

                                        ||

                                        !oldAvatar.equals(newAvatar)
                        )

        ) {

            String publicId =

                    cloudinaryService
                            .extractPublicId(
                                    oldAvatar
                            );

            cloudinaryService.deleteFile(

                    publicId,

                    "image"
            );
        }

        // ===============================
        // 🔥 UPDATE AVATAR
        // ===============================
        if (

                newAvatar == null

                        ||

                        newAvatar.isBlank()

        ) {

            group.setAvatar(null);

        } else {

            group.setAvatar(newAvatar);
        }

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
    @Transactional
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

        // ===============================
        // 🔥 DELETE CONVERSATION FIRST
        // ===============================
        conversationRepository
                .findByGroup(group)
                .ifPresent(conversation -> {

                    // 🔥 GET ALL MESSAGES
                    List<Message> messages =
                            messageRepository
                                    .findByConversationOrderByCreatedAtAsc(
                                            conversation
                                    );

                    // 🔥 DELETE REACTIONS + MEDIA
                    for (Message message : messages) {

                        // ===============================
                        // 🔥 REMOVE REPLY REFERENCES
                        // ===============================
                        messageRepository
                                .clearReplyReferences(
                                        message.getId()
                                );

                        // ===============================
                        // 🔥 DELETE REACTIONS
                        // ===============================
                        messageReactionRepository
                                .deleteByMessage(message);

                        // ===============================
                        // 🔥 DELETE MEDIA
                        // ===============================
                        if (

                                message.getType() != null

                                        &&

                                        List.of(

                                                "IMAGE",

                                                "VIDEO",

                                                "FILE",

                                                "MEDIA_GROUP"

                                        ).contains(

                                                message.getType()
                                        )

                                        &&

                                        message.getContent() != null

                        ) {

                            try {

                                String mediaUrl;

                                try {

                                    mediaUrl =
                                            CryptoUtil.decrypt(
                                                    message.getContent()
                                            );

                                } catch (Exception e) {

                                    mediaUrl =
                                            message.getContent();
                                }

                                String resourceType;

                                if (

                                        message.getType()
                                                .equalsIgnoreCase("VIDEO")

                                ) {

                                    resourceType = "video";

                                } else if (

                                        message.getType()
                                                .equalsIgnoreCase("FILE")

                                ) {

                                    resourceType = "raw";

                                } else {

                                    resourceType = "image";
                                }

                                // ===============================
                                // 🔥 MEDIA GROUP
                                // ===============================
                                if (

                                        message.getType()
                                                .equalsIgnoreCase("MEDIA_GROUP")

                                ) {

                                    try {

                                        List<String> mediaUrls =

                                                objectMapper.readValue(

                                                        mediaUrl,

                                                        new TypeReference<List<String>>() {}
                                                );

                                        for (String url : mediaUrls) {

                                            String publicId =

                                                    cloudinaryService
                                                            .extractPublicId(url);

                                            cloudinaryService.deleteFile(

                                                    publicId,

                                                    "image"
                                            );
                                        }

                                    } catch (Exception e) {

                                        e.printStackTrace();
                                    }

                                } else {

                                    String publicId =

                                            cloudinaryService
                                                    .extractPublicId(
                                                            mediaUrl
                                                    );

                                    cloudinaryService.deleteFile(

                                            publicId,

                                            resourceType
                                    );
                                }

                            } catch (Exception e) {

                                e.printStackTrace();
                            }
                        }
                    }

                    // 🔥 DELETE ALL MESSAGES
                    messageRepository
                            .deleteByConversation(
                                    conversation
                            );

                // 🔥 DELETE CONVERSATION
                    conversationRepository
                            .delete(conversation);
                });

        // ===============================
        // 🔥 DELETE MEMBERS
        // ===============================
        List<GroupMember> members =
                groupMemberRepository
                        .findByGroup(group);

        groupMemberRepository
                .deleteAll(members);

        // ===============================
        // 🔥 DELETE GROUP AVATAR
        // ===============================
        if (

                group.getAvatar() != null

                        &&

                        !group.getAvatar().isBlank()

        ) {

            String publicId =

                    cloudinaryService
                            .extractPublicId(
                                    group.getAvatar()
                            );

            cloudinaryService.deleteFile(

                    publicId,

                    "image"
            );
        }

        // ===============================
        // 🔥 DELETE GROUP
        // ===============================
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

                                        // 🔥 membership id
                                        .id(
                                                member.getId()
                                        )

                                        // 🔥 actual user id
                                        .userId(
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