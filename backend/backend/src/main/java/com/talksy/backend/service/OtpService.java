package com.talksy.backend.service;

import com.talksy.backend.entity.Otp;
import com.talksy.backend.entity.OtpType;
import com.talksy.backend.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();

    // 📤 SEND OTP
    @Transactional
    public void sendOtp(String identifier, OtpType type) {

        Otp existing = otpRepository
                .findByIdentifierAndType(identifier, type)
                .orElse(null);

        if (existing != null && existing.getLastSentAt() != null) {
            if (existing.getLastSentAt().isAfter(LocalDateTime.now().minusSeconds(30))) {
                throw new RuntimeException("Please wait 30 seconds");
            }
        }

        String otpValue = String.valueOf(100000 + random.nextInt(900000));
        String hashedOtp = encoder.encode(otpValue);

        Otp otp = (existing != null) ? existing : new Otp();

        otp.setIdentifier(identifier);
        otp.setType(type);
        otp.setOtp(hashedOtp);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otp.setAttempts(0);
        otp.setLastSentAt(LocalDateTime.now());
        otp.setVerified(false);

        otpRepository.save(otp);

        if (type == OtpType.PHONE) {
            sendSms(identifier, otpValue);
        } else {
            sendEmail(identifier, otpValue);
        }
    }

    // 🔐 VERIFY OTP
    @Transactional
    public boolean verifyOtp(String identifier, String otpInput, OtpType type) {

        Otp otp = otpRepository
                .findByIdentifierAndType(identifier, type)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otp);
            throw new RuntimeException("OTP expired");
        }

        if (otp.getAttempts() >= 5) {
            otpRepository.delete(otp);
            throw new RuntimeException("Too many attempts");
        }

        if (!encoder.matches(otpInput, otp.getOtp())) {
            otp.setAttempts(otp.getAttempts() + 1);
            otpRepository.save(otp);
            return false;
        }

        otp.setVerified(true);
        otpRepository.delete(otp);

        return true;
    }

    private void sendSms(String phone, String otp) {
        System.out.println("OTP for " + phone + " is: " + otp);
    }

    private void sendEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Talksy OTP");
        message.setText("Your OTP is: " + otp);
        mailSender.send(message);
    }
}