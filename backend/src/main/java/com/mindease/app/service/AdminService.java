package com.mindease.app.service;

import com.mindease.app.model.User;
import com.mindease.app.repository.MoodRepository;
import com.mindease.app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final MoodRepository moodRepository;

    public AdminService(UserRepository userRepository, MoodRepository moodRepository) {
        this.userRepository = userRepository;
        this.moodRepository = moodRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalMoods", moodRepository.count());
        return stats;
    }
}
