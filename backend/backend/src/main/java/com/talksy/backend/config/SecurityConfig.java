package com.talksy.backend.config;

import com.talksy.backend.security.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ❌ CSRF off (JWT use kar rahe ho)
                .csrf(csrf -> csrf.disable())

                // 🔥 Stateless (VERY IMPORTANT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔥 CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 🔥 Error handling (same style as tera ApiResponse)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setContentType("application/json");
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.getWriter().write("""
                                {"success":false,"message":"Unauthorized ❌"}
                            """);
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setContentType("application/json");
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.getWriter().write("""
                                {"success":false,"message":"Access denied ❌"}
                            """);
                        })
                )

                // 🔐 ROUTES
                .authorizeHttpRequests(auth -> auth

                        // 🔓 AUTH (LOGIN FLOW — MUST BE OPEN)
                        .requestMatchers("/api/auth/**").permitAll()

                        // 🔓 FILE UPLOAD (public)
                        .requestMatchers("/api/file/**").permitAll()

                        // 🔒 EVERYTHING ELSE (contacts, future APIs)
                        .anyRequest().authenticated()
                )

                // 🔥 JWT FILTER
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ===============================
    // 🌐 CORS CONFIG (SAFE FOR YOUR FLOW)
    // ===============================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // ⚠️ frontend origin (React/Vite)
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        // 🔥 VERY IMPORTANT (cookies ke liye)
        config.setAllowCredentials(true);

        // 🔥 expose cookies
        config.setExposedHeaders(List.of("Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}