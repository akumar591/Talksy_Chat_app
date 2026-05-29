package com.talksy.backend.scheduler;

import com.talksy.backend.entity.User;
import com.talksy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UserPresenceScheduler {

    private final UserRepository userRepository;

    // 🔥 run every 60 sec
    @Scheduled(fixedRate = 60000)
    public void markUsersOffline() {

        LocalDateTime threshold = LocalDateTime.now().minusSeconds(60);

        // 🔥 get only online users
        List<User> users = userRepository.findByOnlineTrue();

        for (User user : users) {

            // 🔥 check inactive
            if (user.getLastActiveAt() == null ||
                    user.getLastActiveAt().isBefore(threshold)) {

                user.markOffline(); // sets online=false + lastSeen
            }
        }

        userRepository.saveAll(users);
    }
}