package com.talksy.backend.controller;

import com.talksy.backend.dto.CreateStatusRequest;
import com.talksy.backend.dto.StatusResponse;
import com.talksy.backend.dto.StatusViewerResponse;

import com.talksy.backend.payload.ApiResponse;

import com.talksy.backend.security.CustomUserDetails;

import com.talksy.backend.service.StatusService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/status")

@RequiredArgsConstructor
public class StatusController {

    // ===============================
    // 🔥 SERVICE
    // ===============================
    private final StatusService
            statusService;

    // ===============================
    // 🔥 CREATE STATUS
    // ===============================
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>>
    createStatus(

            @AuthenticationPrincipal
            CustomUserDetails userDetails,

            @RequestBody
            CreateStatusRequest request
    ) {

        StatusResponse response =
                statusService.createStatus(

                        userDetails.getUser()
                                .getId(),

                        request
                );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Status created ✅",

                        response
                )
        );
    }

    // ===============================
    // 🔥 STATUS FEED
    // ===============================
    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<?>>
    getFeed(

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        List<StatusResponse> feed =

                statusService.getStatusFeed(

                        userDetails.getUser()
                                .getId()
                );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Status feed fetched ✅",

                        feed
                )
        );
    }

    // ===============================
    // 🔥 MY STATUS
    // ===============================
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<?>>
    getMyStatuses(

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        List<StatusResponse> statuses =

                statusService.getMyStatuses(

                        userDetails.getUser()
                                .getId()
                );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "My statuses fetched ✅",

                        statuses
                )
        );
    }

    // ===============================
    // 🔥 MARK VIEWED
    // ===============================
    @PostMapping("/view/{statusId}")
    public ResponseEntity<ApiResponse<?>>
    markViewed(

            @PathVariable
            Long statusId,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        statusService.markViewed(

                statusId,

                userDetails.getUser()
                        .getId()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Status viewed ✅",

                        null
                )
        );
    }

    // ===============================
    // 🔥 REACT TO STATUS
    // ===============================
    @PostMapping("/react/{statusId}")
    public ResponseEntity<ApiResponse<?>>
    reactToStatus(

            @PathVariable
            Long statusId,

            @RequestBody
            Map<String, String> body,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        statusService.reactToStatus(

                statusId,

                userDetails.getUser()
                        .getId(),

                body.get("reaction")
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Reaction added ✅",

                        null
                )
        );
    }

    // ===============================
    // 🔥 REPLY TO STATUS
    // ===============================
    @PostMapping("/reply/{statusId}")
    public ResponseEntity<ApiResponse<?>>
    replyToStatus(

            @PathVariable
            Long statusId,

            @RequestBody
            Map<String, String> body,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        statusService.replyToStatus(

                statusId,

                userDetails.getUser()
                        .getId(),

                body.get("reply")
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Reply sent ✅",

                        null
                )
        );
    }

    // ===============================
    // 🔥 STATUS VIEWERS
    // ===============================
    @GetMapping("/viewers/{statusId}")
    public ResponseEntity<ApiResponse<?>>
    getViewers(

            @PathVariable
            Long statusId
    ) {

        List<StatusViewerResponse> viewers =

                statusService.getViewers(
                        statusId
                );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Status viewers fetched ✅",

                        viewers
                )
        );
    }

    // ===============================
    // 🔥 DELETE STATUS
    // ===============================
    @DeleteMapping("/{statusId}")
    public ResponseEntity<ApiResponse<?>>
    deleteStatus(

            @PathVariable
            Long statusId,

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        statusService.deleteStatus(

                statusId,

                userDetails.getUser()
                        .getId()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Status deleted ✅",

                        null
                )
        );
    }
}