package com.talksy.backend.repository;

import com.talksy.backend.entity.Otp;
import com.talksy.backend.entity.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {

    // 🔍 Find OTP by identifier + type (PHONE / EMAIL)
    Optional<Otp> findByIdentifierAndType(String identifier, OtpType type);

    // 🧹 Delete OTP after verification (cleanup)
    void deleteByIdentifierAndType(String identifier, OtpType type);

    // ❓ Check if OTP exists (optional but useful)
    boolean existsByIdentifierAndType(String identifier, OtpType type);
}