package com.mindease.app.service;

import com.mindease.app.model.Mood;
import com.mindease.app.model.MoodType;
import com.mindease.app.model.User;
import com.mindease.app.repository.MoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MoodService {

    private final MoodRepository moodRepository;

    public MoodService(MoodRepository moodRepository) {
        this.moodRepository = moodRepository;
    }

    public Mood saveMood(Mood mood) {
        return moodRepository.save(mood);
    }

    public List<Mood> getUserMoods(Long userId) {
        return moodRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<Mood> getAllMoods() {
        return moodRepository.findAll();
    }

    public Map<MoodType, Long> getMoodStats() {
        return moodRepository.findAll().stream()
                .collect(Collectors.groupingBy(Mood::getMood, Collectors.counting()));
    }
}
