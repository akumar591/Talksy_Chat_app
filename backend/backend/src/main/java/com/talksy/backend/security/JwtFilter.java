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
    private final TokenBlacklistRepository blacklistRepo;
    private final UserService userService; // 🔥 NEW

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {

            String token = extractTokenFromCookies(request);

            if (token != null) {

                // ❌ blacklist
                if (blacklistRepo.existsByToken(token)) {
                    sendError(response, "Token is blacklisted");
                    return;
                }

                // ❌ invalid / expired
                if (!jwtService.isTokenValid(token)) {
                    sendError(response, "Invalid or expired token");
                    return;
                }

                // ✅ extract user
                String phone = jwtService.extractPhone(token);
                User user = userService.getByPhone(phone);

                if (user != null) {
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    Collections.emptyList()
                            );

                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }

        } catch (Exception e) {
            sendError(response, "Unauthorized");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private void sendError(HttpServletResponse response, String msg) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"success\":false,\"message\":\"" + msg + "\"}");
    }
}