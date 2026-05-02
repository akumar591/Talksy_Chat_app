package com.talksy.backend.repository;

import com.talksy.backend.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    // 🔥 Get all contacts of logged-in user
    List<Contact> findByUser_Id(Long userId);

    // 🔥 Search by name
    List<Contact> findByUser_IdAndNameContainingIgnoreCase(Long userId, String name);

    // 🔥 Search by phone
    List<Contact> findByUser_IdAndPhoneContaining(Long userId, String phone);

    // 🔥 Combined search (name OR phone)
    List<Contact> findByUser_IdAndNameContainingIgnoreCaseOrUser_IdAndPhoneContaining(
            Long userId, String name,
            Long userId2, String phone
    );
}