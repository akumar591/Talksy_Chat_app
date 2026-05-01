package com.talksy.backend.service;

import com.talksy.backend.entity.User;
import com.talksy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // ===============================
    // 💾 SAVE USER (CREATE / UPDATE)
    // ===============================
    @Transactional
    public User saveUser(User user) {

        if (user == null) {
            throw new RuntimeException("User is null ❌");
        }

        // 🔥 phone must exist
        if (user.getPhone() == null || user.getPhone().isBlank()) {
            throw new RuntimeException("Phone is required ❌");
        }

        // 🔥 email duplicate check
        if (user.getEmail() != null) {
            User existingByEmail = userRepository.findByEmail(user.getEmail()).orElse(null);

            if (existingByEmail != null && !existingByEmail.getId().equals(user.getId())) {
                throw new RuntimeException("Email already in use ❌");
            }
        }

        return userRepository.save(user);
    }

    // ===============================
    // 📱 GET USER BY PHONE
    // ===============================
    public User getByPhone(String phone) {

        if (phone == null || phone.isBlank()) {
            throw new RuntimeException("Phone is required ❌");
        }

        return userRepository.findByPhone(phone)
                .orElse(null);
    }

    // ===============================
    // 📧 GET USER BY EMAIL
    // ===============================
    public User getByEmail(String email) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required ❌");
        }

        return userRepository.findByEmail(email)
                .orElse(null);
    }

    // ===============================
    // 🔥 GET OR CREATE USER (IMPORTANT)
    // ===============================
    @Transactional
    public User getOrCreate(String phone) {

        User user = userRepository.findByPhone(phone).orElse(null);

        if (user == null) {
            user = new User();
            user.setPhone(phone);
            user.setPhoneVerified(true);
        }

        return userRepository.save(user);
    }

    // ===============================
    // ✅ EXISTS CHECKS
    // ===============================
    public boolean existsByPhone(String phone) {
        return userRepository.findByPhone(phone).isPresent();
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}