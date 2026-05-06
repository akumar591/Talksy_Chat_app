package com.talksy.backend.controller;

import java.util.Map;
import java.util.HashMap;
import com.talksy.backend.dto.AddContactResponse;
import com.talksy.backend.entity.Contact;
import com.talksy.backend.entity.User;
import com.talksy.backend.payload.ApiResponse;
import com.talksy.backend.service.ContactService;
import com.talksy.backend.entity.Conversation;
import com.talksy.backend.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {
    private final ConversationService conversationService;
    private final ContactService contactService;

    // ===============================
    // 🔐 CURRENT USER
    // ===============================
    private User getCurrentUser() {
        return (User) org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // ===============================
    // ➕ ADD CONTACT
    // ===============================
    @PostMapping
    public ResponseEntity<ApiResponse<?>> addContact(@RequestBody Contact contact) {

        User user = getCurrentUser();

        AddContactResponse result = contactService.addContact(user.getId(), contact);

        // ❌ Invite case
        if (!result.isExists()) {
            return ResponseEntity.ok(
                    new ApiResponse<>(false, result.getMessage(), null)
            );
        }

        // ✅ Saved
        return ResponseEntity.ok(
                new ApiResponse<>(true, result.getMessage(), result)
        );
    }

    // ===============================
    // 📋 GET CONTACTS
    // ===============================
    // ===============================
// 📋 GET CONTACTS
// ===============================
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getContacts() {

        User currentUser = getCurrentUser();

        List<Contact> contacts =
                contactService.getMyContacts(currentUser.getId());

        List<Map<String, Object>> response =
                contacts.stream().map(contact -> {

                    Map<String, Object> map =
                            new HashMap<>();

                    // ===============================
                    // 🔥 BASIC CONTACT
                    // ===============================
                    map.put("id",
                            contact.getContactUser() != null
                                    ? contact.getContactUser().getId()
                                    : contact.getId());

                    map.put("name",
                            contact.getName());

                    map.put("phone",
                            contact.getPhone());

                    map.put("blocked",
                            contact.isBlocked());

                    // ===============================
                    // 🔥 USER DATA
                    // ===============================
                    if (contact.getContactUser() != null) {

                        User otherUser =
                                contact.getContactUser();

                        map.put("avatar",
                                otherUser.getAvatar());

                        map.put("bio",
                                otherUser.getBio());

                        map.put("online",
                                otherUser.isOnline());

                        map.put("lastSeen",
                                otherUser.getLastSeen());
                    }

                    // ===============================
                    // 🔥 CONVERSATION DATA
                    // ===============================
                    Conversation conversation =
                            conversationService
                                    .getConversationIfExists(
                                            currentUser.getId(),
                                            contact.getContactUser().getId()
                                    );

                    if (conversation != null) {

                        map.put("conversationId",
                                conversation.getId());

                        map.put("lastMessage",
                                conversation.getLastMessage());

                        map.put("lastMessageTime",
                                conversation.getLastMessageTime());

                        Integer unreadCount =
                                conversation.getUser1().getId().equals(currentUser.getId())
                                        ? conversation.getUnreadCountUser1()
                                        : conversation.getUnreadCountUser2();

                        map.put("unreadCount",
                                unreadCount);

                    } else {

                        map.put("conversationId",
                                null);

                        map.put("lastMessage",
                                "");

                        map.put("lastMessageTime",
                                null);

                        map.put("unreadCount",
                                0);
                    }

                    return map;

                }).toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Contacts fetched",
                        response
                )
        );
    }

    // ===============================
    // 🔍 SEARCH CONTACT
    // ===============================
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> search(@RequestParam String query) {

        User user = getCurrentUser();

        List<Contact> contacts = contactService.searchContacts(user.getId(), query);

        List<AddContactResponse> response = contacts.stream().map(c ->
                AddContactResponse.builder()
                        .exists(true)
                        .message("Contact fetched")
                        .id(c.getId())
                        .name(c.getName())
                        .phone(c.getPhone())
                        .blocked(c.isBlocked())
                        .avatar(
                                c.getContactUser() != null
                                        ? c.getContactUser().getAvatar()
                                        : null
                        )
                        .bio(
                                c.getContactUser() != null
                                        ? c.getContactUser().getBio()
                                        : null
                        )
                        .build()
        ).toList();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Search result", response)
        );
    }

    // ===============================
    // ❌ DELETE CONTACT
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable Long id) {

        User user = getCurrentUser();

        contactService.deleteContact(user.getId(), id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Contact deleted", null)
        );
    }

    // ===============================
    // 🚫 BLOCK / UNBLOCK (🔥 FIXED)
    // ===============================
    @PutMapping("/{id}/block")
    public ResponseEntity<ApiResponse<?>> toggleBlock(@PathVariable Long id) {

        User user = getCurrentUser();

        Contact updated = contactService.toggleBlockContact(user.getId(), id);

        AddContactResponse response = AddContactResponse.builder()
                .exists(true)
                .message("Contact updated")
                .id(updated.getId())
                .name(updated.getName())
                .phone(updated.getPhone())
                .blocked(updated.isBlocked())
                .avatar(
                        updated.getContactUser() != null
                                ? updated.getContactUser().getAvatar()
                                : null
                )
                .bio(
                        updated.getContactUser() != null
                                ? updated.getContactUser().getBio()
                                : null
                )
                .build();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Contact updated", response)
        );
    }
}