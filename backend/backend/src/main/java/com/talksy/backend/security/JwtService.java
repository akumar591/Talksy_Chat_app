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

    @Value("${jwt.secret}")
    private String SECRET;

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    private final long ACCESS_EXPIRATION = 1000 * 60 * 15;
    private final long REFRESH_EXPIRATION = 1000L * 60 * 60 * 24 * 7;

    // 🔥 ACCESS TOKEN
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getPhone())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 🔥 REFRESH TOKEN
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getPhone())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 🔍 EXTRACT PHONE
    public String extractPhone(String token) {
        return getClaims(token).getSubject();
    }

    // 🔍 CHECK EXPIRY
    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // 🔍 FULL VALIDATION (🔥 USE THIS)
    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // 🔍 OLD METHOD (optional keep)
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 🔍 PARSE CLAIMS
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}