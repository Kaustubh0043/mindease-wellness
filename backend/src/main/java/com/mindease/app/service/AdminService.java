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
    private final JournalRepository journalRepository;
    private final ChatLogRepository chatLogRepository;

    public AdminService(
        UserRepository userRepository, 
        MoodRepository moodRepository,
        JournalRepository journalRepository,
        ChatLogRepository chatLogRepository
    ) {
        this.userRepository = userRepository;
        this.moodRepository = moodRepository;
        this.journalRepository = journalRepository;
        this.chatLogRepository = chatLogRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long id) {
        // Clear all neural anchors first
        moodRepository.deleteByUserId(id);
        journalRepository.deleteByUserId(id);
        chatLogRepository.deleteByUserId(id);
        
        // Terminate master identity
        userRepository.deleteById(id);
    }

    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalMoods", moodRepository.count());
        return stats;
    }
}
