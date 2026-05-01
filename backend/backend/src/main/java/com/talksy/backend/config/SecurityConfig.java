package com.talksy.backend.config;

import com.talksy.backend.security.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// 🔥 CORS IMPORTS
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 🔥 Disable CSRF (JWT based auth)
                .csrf(csrf -> csrf.disable())

                // 🔥 ENABLE CORS (VERY IMPORTANT)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 🔥 Custom error handling (VERY IMPORTANT)
                .exceptionHandling(ex -> ex

                        // 🔐 User not logged in / invalid token
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                            response.getWriter().write("""
                                {
                                  "success": false,
                                  "message": "Please login / verify phone first ❌"
                                }
                            """);
                        })

                        // 🚫 User logged in but no permission
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);

                            response.getWriter().write("""
                                {
                                  "success": false,
                                  "message": "Access denied ❌"
                                }
                            """);
                        })
                )

                // 🔐 Route security
                .authorizeHttpRequests(auth -> auth

                        // 🔓 PUBLIC ROUTES
                        .requestMatchers(
                                "/api/auth/send-otp",
                                "/api/auth/verify-otp",
                                "/api/auth/send-email-otp",
                                "/api/auth/verify-email",
                                "/api/file/**"
                        ).permitAll()

                        // 🔒 PROTECTED ROUTES
                        .anyRequest().authenticated()
                )

                // 🔥 JWT FILTER
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔥🔥🔥 CORS CONFIG (MAIN FIX)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}