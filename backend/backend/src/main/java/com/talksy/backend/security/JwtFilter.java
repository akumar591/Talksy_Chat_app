package com.talksy.backend.security;

import com.talksy.backend.entity.User;
import com.talksy.backend.repository.TokenBlacklistRepository;
import com.talksy.backend.service.UserService;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final TokenBlacklistRepository
            blacklistRepo;

    private final UserService
            userService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )
            throws ServletException, IOException {

        try {

            // ===============================
            // 🔥 BYPASS PUBLIC AUTH APIs
            // ===============================
            String path =
                    request.getServletPath();

            // 🔥 refresh token endpoint bypass
            if (
                    path.equals("/api/auth/refresh-token")
            ) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // ===============================
            // 🍪 ACCESS TOKEN
            // ===============================
            String token =
                    extractTokenFromCookies(
                            request
                    );

            // 🔥 no token → continue
            if (token == null) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // ===============================
            // ❌ BLACKLIST CHECK
            // ===============================
            if (
                    blacklistRepo.existsByToken(
                            token
                    )
            ) {

                sendError(
                        response,
                        "Token is blacklisted"
                );

                return;
            }

            // ===============================
            // ❌ INVALID / EXPIRED
            // ===============================
            if (
                    !jwtService.isTokenValid(
                            token
                    )
            ) {

                sendError(
                        response,
                        "Invalid or expired token"
                );

                return;
            }

            // ===============================
            // ✅ EXTRACT USER
            // ===============================
            String phone =
                    jwtService.extractPhone(
                            token
                    );

            User user =
                    userService.getByPhone(
                            phone
                    );

            if (user != null) {

                // ===============================
                // 🔥 ACTIVITY TRACKING
                // ===============================
                user.markOnline();

                userService.saveUser(user);

                // ===============================
                // ✅ AUTHENTICATION
                // ===============================
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                Collections.emptyList()
                        );

                auth.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(auth);
            }

        } catch (Exception e) {

            sendError(
                    response,
                    "Unauthorized"
            );

            return;
        }

        // ===============================
        // ✅ CONTINUE FILTER CHAIN
        // ===============================
        filterChain.doFilter(
                request,
                response
        );
    }

    // ===============================
    // 🍪 EXTRACT ACCESS TOKEN
    // ===============================
    private String extractTokenFromCookies(
            HttpServletRequest request
    ) {

        if (
                request.getCookies() == null
        ) {

            return null;
        }

        for (
                Cookie cookie
                : request.getCookies()
        ) {

            if (
                    "accessToken".equals(
                            cookie.getName()
                    )
            ) {

                return cookie.getValue();
            }
        }

        return null;
    }

    // ===============================
    // ❌ ERROR RESPONSE
    // ===============================
    private void sendError(
            HttpServletResponse response,
            String msg
    ) throws IOException {

        response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
        );

        response.setContentType(
                "application/json"
        );

        response.getWriter().write(
                "{\"success\":false,\"message\":\""
                        + msg +
                        "\"}"
        );
    }
}