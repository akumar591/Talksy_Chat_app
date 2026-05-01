package com.talksy.backend.controller;

import lombok.RequiredArgsConstructor;
import com.talksy.backend.entity.OtpType;
import com.talksy.backend.service.OtpService;
import com.talksy.backend.entity.User;
import com.talksy.backend.security.JwtService;
import com.talksy.backend.entity.TokenBlacklist;
import com.talksy.backend.repository.TokenBlacklistRepository;
import com.talksy.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.talksy.backend.entity.RefreshToken;
import com.talksy.backend.repository.RefreshTokenRepository;
import com.talksy.backend.payload.ApiResponse;

// DTO
import com.talksy.backend.dto.*;
import jakarta.validation.Valid;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.http.ResponseCookie;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final OtpService otpService;
    private final UserService userService;
    private final JwtService jwtService;
    private final TokenBlacklistRepository blacklistRepo;
    private final RefreshTokenRepository refreshRepo;

    // ===============================
    // 📱 SEND PHONE OTP
    // ===============================
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<?>> sendOtp(@Valid @RequestBody SendOtpRequest req) {

        String phone = req.getPhone();

        if (phone == null || !phone.matches("^[6-9]\\d{9}$")) {
            throw new RuntimeException("Invalid phone ❌");
        }

        otpService.sendOtp(phone, OtpType.PHONE);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "OTP sent ✅", null)
        );
    }

    // ===============================
    // 🔐 VERIFY PHONE OTP
    // ===============================
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<?>> verifyOtp(@Valid @RequestBody VerifyOtpRequest req,
                                                    HttpServletResponse response) {

        String phone = req.getPhone();
        String otp = req.getOtp();

        if (phone == null || otp == null) {
            throw new RuntimeException("Phone & OTP required ❌");
        }

        boolean valid = otpService.verifyOtp(phone, otp, OtpType.PHONE);

        if (!valid) {
            throw new RuntimeException("Invalid OTP ❌");
        }

        User user = userService.getByPhone(phone);
        boolean isNewUser = false;

        if (user == null) {
            user = new User();
            user.setPhone(phone);
            isNewUser = true;
        }

        user.setPhoneVerified(true);
        user = userService.saveUser(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        RefreshToken rt = new RefreshToken();
        rt.setToken(refreshToken);
        rt.setUserId(user.getId());
        rt.setExpiry(LocalDateTime.now().plusDays(7));
        refreshRepo.save(rt);

        // 🔥 FIXED COOKIE CONFIG
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(15 * 60)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.addHeader("Set-Cookie", accessCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        data.put("isNewUser", isNewUser);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login successful ✅", data)
        );
    }

    // ===============================
    // 📧 SEND EMAIL OTP
    // ===============================
    @PostMapping("/send-email-otp")
    public ResponseEntity<ApiResponse<?>> sendEmailOtp(@Valid @RequestBody SendEmailOtpRequest req) {

        String email = req.getEmail();

        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new RuntimeException("Invalid email ❌");
        }

        otpService.sendOtp(email, OtpType.EMAIL);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Email OTP sent ✅", null)
        );
    }

    // ===============================
    // 📧 VERIFY EMAIL OTP
    // ===============================
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<?>> verifyEmail(@Valid @RequestBody VerifyEmailRequest req) {

        String phone = req.getPhone();
        String email = req.getEmail();
        String otp = req.getOtp();

        if (phone == null || email == null || otp == null) {
            throw new RuntimeException("Phone, Email & OTP required ❌");
        }

        User user = userService.getByPhone(phone);

        if (user == null) {
            throw new RuntimeException("User not found ❌");
        }

        if (!user.isPhoneVerified()) {
            throw new RuntimeException("Verify phone first ❌");
        }

        boolean valid = otpService.verifyOtp(email, otp, OtpType.EMAIL);

        if (!valid) {
            throw new RuntimeException("Invalid OTP ❌");
        }

        user.setEmail(email);
        user.setEmailVerified(true);

        User saved = userService.saveUser(user);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Email verified ✅", saved)
        );
    }

    // ===============================
    // 👤 PROFILE UPDATE
    // ===============================
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody ProfileSetupRequest req) {

        if (req.getPhone() == null || req.getPhone().isBlank()) {
            throw new RuntimeException("Phone required ❌");
        }

        String phone = req.getPhone().trim();

        User user = userService.getByPhone(phone);

        if (user == null) {
            throw new RuntimeException("User not found ❌");
        }

        if (!user.isPhoneVerified()) {
            throw new RuntimeException("Verify phone first ❌");
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Verify email first ❌");
        }

        if (req.getName() != null && !req.getName().isBlank()) {
            user.setName(req.getName().trim());
        }

        if (req.getBio() != null) {
            user.setBio(req.getBio().trim());
        }

        if (req.getAvatar() != null && !req.getAvatar().isBlank()) {
            user.setAvatar(req.getAvatar().trim());
        }

        User updated = userService.saveUser(user);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile updated ✅", updated)
        );
    }

    // ===============================
    // 👤 GET PROFILE
    // ===============================
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<?>> getProfile(HttpServletRequest request) {

        String token = extractToken(request, "accessToken");

        if (token == null) {
            throw new RuntimeException("Unauthorized ❌");
        }

        String phone = jwtService.extractPhone(token);
        User user = userService.getByPhone(phone);

        if (user == null) {
            throw new RuntimeException("User not found ❌");
        }

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile fetched ✅", user)
        );
    }

    // ===============================
    // 👤 LOGOUT
    // ===============================
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request, HttpServletResponse response) {

        String token = extractToken(request, "accessToken");

        if (token != null) {
            TokenBlacklist black = new TokenBlacklist();
            black.setToken(token);
            black.setExpiry(LocalDateTime.now().plusMinutes(15));
            blacklistRepo.save(black);
        }

        ResponseCookie clearAccess = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        ResponseCookie clearRefresh = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", clearAccess.toString());
        response.addHeader("Set-Cookie", clearRefresh.toString());

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Logout successful ✅", null)
        );
    }

    // ===============================
    // 🔄 REFRESH TOKEN
    // ===============================
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<?>> refresh(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = extractToken(request, "refreshToken");

        Optional<RefreshToken> stored = refreshRepo.findByToken(refreshToken);

        if (stored.isEmpty()) {
            throw new RuntimeException("Invalid refresh token ❌");
        }

        String phone = jwtService.extractPhone(refreshToken);
        User user = userService.getByPhone(phone);

        String newAccess = jwtService.generateAccessToken(user);

        ResponseCookie cookie = ResponseCookie.from("accessToken", newAccess)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(15 * 60)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Token refreshed ✅", null)
        );
    }

    // ===============================
    // 🍪 EXTRACT TOKEN
    // ===============================
    private String extractToken(HttpServletRequest request, String name) {

        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}