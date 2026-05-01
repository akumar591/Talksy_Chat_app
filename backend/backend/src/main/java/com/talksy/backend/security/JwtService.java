package com.talksy.backend.security;

import com.talksy.backend.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 🔐 SECRET FROM ENV (FINAL FIX)
    @Value("${jwt.secret}")
    private String SECRET;

    // 🔑 Dynamic key (same logic, no change)
    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ⏳ expiry (UNCHANGED)
    private final long ACCESS_EXPIRATION = 1000 * 60 * 15; // 15 min
    private final long REFRESH_EXPIRATION = 1000L * 60 * 60 * 24 * 7; // 7 days

    // ===============================
    // 🔥 GENERATE ACCESS TOKEN
    // ===============================
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getPhone())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ===============================
    // 🔥 GENERATE REFRESH TOKEN
    // ===============================
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getPhone())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ===============================
    // 🔍 EXTRACT PHONE
    // ===============================
    public String extractPhone(String token) {
        return getClaims(token).getSubject();
    }

    // ===============================
    // 🔍 VALIDATE TOKEN
    // ===============================
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ===============================
    // 🔍 PARSE CLAIMS
    // ===============================
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}