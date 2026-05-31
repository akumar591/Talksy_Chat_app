package com.talksy.backend.service;

import com.talksy.backend.entity.Otp;
import com.talksy.backend.entity.OtpType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import com.talksy.backend.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class OtpService {

    // ===============================
    // 🔥 MSG91 CONFIG
    // ===============================
    @Value("${msg91.api.key}")
    private String apiKey;

    @Value("${msg91.template.id}")
    private String templateId;



    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();

    // ===============================
// 🔥 RENDER MAIL ENV DEBUG
// ===============================
    @PostConstruct
    public void testMailConfig() {

        System.out.println(
                "MAIL USER = "
                        + System.getenv("MAIL_USERNAME")
        );

        String pass =
                System.getenv("MAIL_PASSWORD");

        System.out.println(
                "MAIL PASSWORD EXISTS = "
                        + (pass != null && !pass.isBlank())
        );
    }

    // ===============================
    // 🔥 DEV MODE OTP
    // ===============================
    private final Map<String, String> phoneOtpMap =
            new ConcurrentHashMap<>();

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
        if (type == OtpType.PHONE) {

            phoneOtpMap.put(
                    identifier,
                    otpValue
            );
        }
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

            // =====================================
            // DEV MODE
            // MSG91 TEMPORARILY DISABLED
            // =====================================

    /*
    sendSms(
            identifier,
            otpValue
    );
    */

        } else {

            sendEmail(
                    identifier,
                    otpValue
            );
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


    // ===============================
    // 🔥 SEND SMS VIA MSG91
    // ===============================
    private void sendSms(String phone, String otp) {

        try {

            // ===============================
            // 🔥 MSG91 API URL
            // ===============================
            String url = "https://control.msg91.com/api/v5/otp";

            // ===============================
            // 🔥 REQUEST BODY
            // ===============================
            Map<String, Object> body = new HashMap<>();

            body.put("template_id", templateId);

            // ===============================
            // 🔥 CLEAN PHONE NUMBER
            // ===============================
            String cleanPhone = phone.replaceAll("[^0-9]", "");

            if (!cleanPhone.startsWith("91")) {
                cleanPhone = "91" + cleanPhone;
            }

            body.put("mobile", cleanPhone);

            body.put("otp", otp);

            // ===============================
            // 🔥 HEADERS
            // ===============================
            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);

            headers.set("authkey", apiKey);

            System.out.println("API KEY: " + apiKey);

            System.out.println("TEMPLATE ID: " + templateId);

            System.out.println("PHONE: " + cleanPhone);

            System.out.println("OTP: " + otp);

            System.out.println("BODY: " + body);

            // ===============================
            // 🔥 REQUEST ENTITY
            // ===============================
            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            // ===============================
            // 🔥 API CALL
            // ===============================
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            request,
                            String.class
                    );

            // ===============================
            // 🔥 SUCCESS LOG
            // ===============================
            System.out.println(
                    "MSG91 Response: " + response.getBody()
            );

        } catch (Exception e) {

            // ===============================
            // 🔥 ERROR LOG
            // ===============================
            throw new RuntimeException(
                    "Failed to send SMS OTP: " + e.getMessage()
            );
        }
    }

    private void sendEmail(String email, String otp) {

        try {

            System.out.println("STEP-1 Email method entered");

            SimpleMailMessage message = new SimpleMailMessage();

            System.out.println("STEP-2 Message created");

            message.setTo(email);
            message.setSubject("Talksy OTP");
            message.setText("Your OTP is: " + otp);

            System.out.println("STEP-3 Before mailSender.send");

            mailSender.send(message);

            System.out.println("STEP-4 Mail sent successfully");

        } catch (Exception e) {

            System.out.println("STEP-5 Mail exception");

            e.printStackTrace();

            throw new RuntimeException(
                    "Mail send failed: " + e.getMessage(),
                    e
            );
        }
    }

    // ===============================
    // 🔥 GET LAST OTP (DEV MODE)
    // ===============================
    public String getOtpForPhone(
            String phone
    ) {

        return phoneOtpMap.get(phone);
    }
}