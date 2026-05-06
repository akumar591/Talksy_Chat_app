package com.talksy.backend.controller;

import com.talksy.backend.entity.User;
import com.talksy.backend.payload.ApiResponse;
import com.talksy.backend.repository.ContactRepository;
import com.talksy.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final ContactRepository contactRepository;

    // ===============================
    // 🔐 GET CURRENT USER
    // ===============================
    private User getCurrentUser() {

        return (User)
                org.springframework.security.core.context.SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();
    }

    // ===============================
    // ✅ GET MY PROFILE
    // ===============================
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getMyProfile() {

        try {

            User user = getCurrentUser();

            Map<String, Object> response = mapUser(user);

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "My profile",
                            response
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500).body(
                    new ApiResponse<>(
                            false,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    // ===============================
    // ✏️ UPDATE MY PROFILE
    // ===============================
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<?>> updateProfile(
            @RequestBody User updatedData
    ) {

        try {

            User currentUser = getCurrentUser();

            User user = userRepository.findById(currentUser.getId())
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            // ===============================
            // 🔥 UPDATE NAME
            // ===============================
            if (updatedData.getName() != null &&
                    !updatedData.getName().trim().isBlank()) {

                user.setName(
                        updatedData.getName().trim()
                );
            }

            // ===============================
            // 🔥 UPDATE BIO
            // ===============================
            if (updatedData.getBio() != null) {

                user.setBio(
                        updatedData.getBio().trim()
                );
            }

            // ===============================
            // 🔥 UPDATE / REMOVE AVATAR
            // ===============================
            if (updatedData.getAvatar() != null) {

                user.setAvatar(
                        updatedData.getAvatar().trim()
                );
            }

            // ===============================
            // 🔥 EMAIL UPDATE
            // ===============================
            if (updatedData.getEmail() != null &&
                    !updatedData.getEmail().trim().isBlank()) {

                user.setEmail(
                        updatedData.getEmail().trim()
                );

                // 🔥 re-verify required
                user.setEmailVerified(false);
            }

            User savedUser = userRepository.save(user);

            Map<String, Object> response =
                    mapUser(savedUser);

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Profile updated",
                            response
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500).body(
                    new ApiResponse<>(
                            false,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    // ===============================
    // 🔐 GET OTHER USER PROFILE
    // ===============================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getUserProfile(
            @PathVariable Long id
    ) {

        try {

            User currentUser = getCurrentUser();

            // 🔒 contact validation
            boolean isContact = contactRepository
                    .findByUser_Id(currentUser.getId())
                    .stream()
                    .anyMatch(contact ->

                            contact.getContactUser() != null &&

                                    contact.getContactUser()
                                            .getId()
                                            .equals(id)
                    );

            if (!isContact) {

                return ResponseEntity.status(403).body(
                        new ApiResponse<>(
                                false,
                                "User not in contacts",
                                null
                        )
                );
            }

            User user = userRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            Map<String, Object> response =
                    mapUser(user);

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "User profile",
                            response
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500).body(
                    new ApiResponse<>(
                            false,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    // ===============================
    // 🔥 COMMON USER DTO MAPPER
    // ===============================
    private Map<String, Object> mapUser(User user) {

        Map<String, Object> map =
                new HashMap<>();

        map.put("id", user.getId());

        map.put("name",
                user.getName());

        map.put("avatar",
                user.getAvatar());

        map.put("bio",
                user.getBio());

        map.put("phone",
                user.getPhone());

        map.put("email",
                user.getEmail());

        map.put("online",
                user.isOnline());

        map.put("lastSeen",
                user.getLastSeen());

        return map;
    }
}