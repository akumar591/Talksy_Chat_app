package com.talksy.backend.service;

import com.talksy.backend.dto.AddContactResponse;
import com.talksy.backend.entity.Contact;
import com.talksy.backend.entity.User;
import com.talksy.backend.repository.ContactRepository;
import com.talksy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    // ===============================
    // 🔍 HELPER
    // ===============================
    private Contact getContactOrThrow(Long contactId) {
        return contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    // ===============================
    // ➕ ADD CONTACT (WHATSAPP LOGIC)
    // ===============================
    public AddContactResponse addContact(Long userId, Contact contact) {

        // 🔥 owner (logged-in user)
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔍 target user (jis number ko add kar rahe ho)
        User targetUser = userRepository.findByPhone(contact.getPhone())
                .orElse(null);

        // ❌ USER NOT EXISTS → INVITE
        if (targetUser == null) {
            return AddContactResponse.builder()
                    .exists(false)
                    .message("User not on platform. Invite suggested.")
                    .build();
        }

        // ⚠️ DUPLICATE CHECK
        boolean alreadyExists = contactRepository
                .findByUser_Id(userId)
                .stream()
                .anyMatch(c -> c.getPhone().equals(contact.getPhone()));

        if (alreadyExists) {
            return AddContactResponse.builder()
                    .exists(true)
                    .message("Contact already exists")
                    .build();
        }

        // ❌ SELF ADD BLOCK
        if (owner.getPhone().equals(contact.getPhone())) {
            throw new RuntimeException("You cannot add yourself as contact");
        }

        // ✅ SAVE CONTACT
        contact.setUser(owner);
        contact.setContactUser(targetUser); // 🔥 IMPORTANT

        Contact saved = contactRepository.save(contact);

        // ✅ RETURN CLEAN DTO (NO ENTITY)
        return AddContactResponse.builder()
                .exists(true)
                .message("Contact added successfully")
                .id(saved.getId())
                .name(saved.getName())
                .phone(saved.getPhone())
                .blocked(saved.isBlocked())
                .avatar(
                        saved.getContactUser() != null
                                ? saved.getContactUser().getAvatar()
                                : null
                )
                .bio(
                        saved.getContactUser() != null
                                ? saved.getContactUser().getBio()
                                : null
                )
                .build();
    }

    // ===============================
    // 📋 GET CONTACTS
    // ===============================
    public List<Contact> getMyContacts(Long userId) {
        return contactRepository.findByUser_Id(userId);
    }

    // ===============================
    // 🔍 SEARCH CONTACT
    // ===============================
    public List<Contact> searchContacts(Long userId, String query) {

        if (query == null || query.isBlank()) {
            return contactRepository.findByUser_Id(userId);
        }

        return contactRepository
                .findByUser_IdAndNameContainingIgnoreCaseOrUser_IdAndPhoneContaining(
                        userId, query,
                        userId, query
                );
    }

    // ===============================
    // ❌ DELETE CONTACT
    // ===============================
    public void deleteContact(Long userId, Long contactId) {

        Contact contact = getContactOrThrow(contactId);

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this contact");
        }

        contactRepository.delete(contact);
    }

    // ===============================
    // 🚫 BLOCK / UNBLOCK CONTACT
    // ===============================
    public Contact toggleBlockContact(Long userId, Long contactId) {

        Contact contact = getContactOrThrow(contactId);

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not allowed to modify this contact");
        }

        contact.setBlocked(!contact.isBlocked());

        return contactRepository.save(contact);
    }
}