package com.talksy.backend.controller;

import com.talksy.backend.dto.CreateGroupRequest;
import com.talksy.backend.dto.GroupResponse;
import com.talksy.backend.entity.Group;
import com.talksy.backend.entity.User;
import com.talksy.backend.service.GroupService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    // ===============================
    // 🔥 CREATE GROUP
    // ===============================
    @PostMapping("/create")
    public ResponseEntity<?> createGroup(

            @RequestBody
            CreateGroupRequest request,

            @AuthenticationPrincipal
            User currentUser
    ) {

        Group createdGroup =
                groupService.createGroup(
                        request,
                        currentUser.getId()
                );

        return ResponseEntity.ok(
                createdGroup
        );
    }

    // ===============================
    // 🔥 GET MY GROUPS
    // ===============================
    @GetMapping("/my")
    public ResponseEntity<?> getMyGroups(

            @AuthenticationPrincipal
            User currentUser
    ) {

        List<GroupResponse> groups =
                groupService.getMyGroups(
                        currentUser.getId()
                );

        return ResponseEntity.ok(
                groups
        );
    }

    // ===============================
    // 🔥 GET SINGLE GROUP
    // ===============================
    @GetMapping("/{groupId}")
    public ResponseEntity<?> getGroupById(

            @PathVariable
            Long groupId
    ) {

        GroupResponse group =
                groupService.getGroupById(
                        groupId
                );

        return ResponseEntity.ok(
                group
        );
    }

    // ===============================
    // 🔥 UPDATE GROUP
    // ONLY CREATOR
    // ===============================
    @PutMapping("/{groupId}")
    public ResponseEntity<?> updateGroup(

            @PathVariable
            Long groupId,

            @RequestBody
            CreateGroupRequest request,

            @AuthenticationPrincipal
            User currentUser
    ) {

        Group updatedGroup =
                groupService.updateGroup(
                        groupId,
                        request,
                        currentUser.getId()
                );

        return ResponseEntity.ok(
                updatedGroup
        );
    }

    // ===============================
    // 🔥 ADD MEMBER
    // CREATOR + ADMIN
    // ===============================
    @PostMapping("/{groupId}/add-member/{memberId}")
    public ResponseEntity<?> addMember(

            @PathVariable
            Long groupId,

            @PathVariable
            Long memberId,

            @AuthenticationPrincipal
            User currentUser
    ) {

        groupService.addMember(
                groupId,
                memberId,
                currentUser.getId()
        );

        return ResponseEntity.ok(
                "Member added successfully"
        );
    }

    // ===============================
    // 🔥 REMOVE MEMBER
    // ===============================
    @DeleteMapping("/{groupId}/remove-member/{memberId}")
    public ResponseEntity<?> removeMember(

            @PathVariable
            Long groupId,

            @PathVariable
            Long memberId,

            @AuthenticationPrincipal
            User currentUser
    ) {

        groupService.removeMember(
                groupId,
                memberId,
                currentUser.getId()
        );

        return ResponseEntity.ok(
                "Member removed successfully"
        );
    }

    // ===============================
    // 🔥 MAKE ADMIN
    // ONLY CREATOR
    // ===============================
    @PutMapping("/{groupId}/make-admin/{memberId}")
    public ResponseEntity<?> makeAdmin(

            @PathVariable
            Long groupId,

            @PathVariable
            Long memberId,

            @AuthenticationPrincipal
            User currentUser
    ) {

        groupService.makeAdmin(
                groupId,
                memberId,
                currentUser.getId()
        );

        return ResponseEntity.ok(
                "User promoted to admin"
        );
    }

    // ===============================
    // 🔥 REMOVE ADMIN
    // ONLY CREATOR
    // ===============================
    @PutMapping("/{groupId}/remove-admin/{memberId}")
    public ResponseEntity<?> removeAdmin(

            @PathVariable
            Long groupId,

            @PathVariable
            Long memberId,

            @AuthenticationPrincipal
            User currentUser
    ) {

        groupService.removeAdmin(
                groupId,
                memberId,
                currentUser.getId()
        );

        return ResponseEntity.ok(
                "Admin removed successfully"
        );
    }

    // ===============================
    // 🔥 LEAVE GROUP
    // ===============================
    @DeleteMapping("/{groupId}/leave")
    public ResponseEntity<?> leaveGroup(

            @PathVariable
            Long groupId,

            @AuthenticationPrincipal
            User currentUser
    ) {

        groupService.leaveGroup(
                groupId,
                currentUser.getId()
        );

        return ResponseEntity.ok(
                "Left group successfully"
        );
    }

    // ===============================
    // 🔥 DELETE GROUP
    // ONLY CREATOR
    // ===============================
    @DeleteMapping("/{groupId}")
    public ResponseEntity<?> deleteGroup(

            @PathVariable
            Long groupId,

            @AuthenticationPrincipal
            User currentUser
    ) {

        groupService.deleteGroup(
                groupId,
                currentUser.getId()
        );

        return ResponseEntity.ok(
                "Group deleted successfully"
        );
    }
}