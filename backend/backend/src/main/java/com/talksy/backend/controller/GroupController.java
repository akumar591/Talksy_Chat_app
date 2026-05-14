package com.talksy.backend.controller;

import com.talksy.backend.dto.CreateGroupRequest;
import com.talksy.backend.dto.GroupResponse;

import com.talksy.backend.entity.Group;
import com.talksy.backend.entity.User;

import com.talksy.backend.payload.ApiResponse;

import com.talksy.backend.security.CustomUserDetails;

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

    private final GroupService
            groupService;

    // ===============================
    // 🔥 CREATE GROUP
    // ===============================
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>>
    createGroup(

            @RequestBody
            CreateGroupRequest request,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        Group createdGroup =

                groupService.createGroup(

                        request,

                        currentUser.getId()
                );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Group created successfully ✅",

                        createdGroup
                )
        );
    }

    // ===============================
    // 🔥 GET MY GROUPS
    // ===============================
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<?>>
    getMyGroups(

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        List<GroupResponse> groups =

                groupService.getMyGroups(

                        currentUser.getId()
                );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Groups fetched successfully ✅",

                        groups
                )
        );
    }

    // ===============================
    // 🔥 GET SINGLE GROUP
    // ===============================
    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<?>>
    getGroupById(

            @PathVariable
            Long groupId
    ) {

        GroupResponse group =

                groupService.getGroupById(
                        groupId
                );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Group fetched successfully ✅",

                        group
                )
        );
    }

    // ===============================
    // 🔥 UPDATE GROUP
    // ONLY CREATOR
    // ===============================
    @PutMapping("/{groupId}")
    public ResponseEntity<ApiResponse<?>>
    updateGroup(

            @PathVariable
            Long groupId,

            @RequestBody
            CreateGroupRequest request,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        Group updatedGroup =

                groupService.updateGroup(

                        groupId,

                        request,

                        currentUser.getId()
                );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Group updated successfully ✅",

                        updatedGroup
                )
        );
    }

    // ===============================
    // 🔥 ADD MEMBER
    // CREATOR + ADMIN
    // ===============================
    @PostMapping("/{groupId}/add-member/{memberId}")
    public ResponseEntity<ApiResponse<?>>
    addMember(

            @PathVariable
            Long groupId,

            @PathVariable
            Long memberId,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        groupService.addMember(

                groupId,

                memberId,

                currentUser.getId()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Member added successfully ✅",

                        null
                )
        );
    }

    // ===============================
    // 🔥 REMOVE MEMBER
    // ===============================
    @DeleteMapping("/{groupId}/remove-member/{memberId}")
    public ResponseEntity<ApiResponse<?>>
    removeMember(

            @PathVariable
            Long groupId,

            @PathVariable
            Long memberId,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        groupService.removeMember(

                groupId,

                memberId,

                currentUser.getId()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Member removed successfully ✅",

                        null
                )
        );
    }

    // ===============================
    // 🔥 MAKE ADMIN
    // ONLY CREATOR
    // ===============================
    @PutMapping("/{groupId}/make-admin/{memberId}")
    public ResponseEntity<ApiResponse<?>>
    makeAdmin(

            @PathVariable
            Long groupId,

            @PathVariable
            Long memberId,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        groupService.makeAdmin(

                groupId,

                memberId,

                currentUser.getId()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "User promoted to admin ✅",

                        null
                )
        );
    }

    // ===============================
    // 🔥 REMOVE ADMIN
    // ONLY CREATOR
    // ===============================
    @PutMapping("/{groupId}/remove-admin/{memberId}")
    public ResponseEntity<ApiResponse<?>>
    removeAdmin(

            @PathVariable
            Long groupId,

            @PathVariable
            Long memberId,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        groupService.removeAdmin(

                groupId,

                memberId,

                currentUser.getId()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Admin removed successfully ✅",

                        null
                )
        );
    }

    // ===============================
    // 🔥 LEAVE GROUP
    // ===============================
    @DeleteMapping("/{groupId}/leave")
    public ResponseEntity<ApiResponse<?>>
    leaveGroup(

            @PathVariable
            Long groupId,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        groupService.leaveGroup(

                groupId,

                currentUser.getId()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Left group successfully ✅",

                        null
                )
        );
    }

    // ===============================
    // 🔥 DELETE GROUP
    // ONLY CREATOR
    // ===============================
    @DeleteMapping("/{groupId}")
    public ResponseEntity<ApiResponse<?>>
    deleteGroup(

            @PathVariable
            Long groupId,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        User currentUser =
                userDetails.getUser();

        groupService.deleteGroup(

                groupId,

                currentUser.getId()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Group deleted successfully ✅",

                        null
                )
        );
    }
}