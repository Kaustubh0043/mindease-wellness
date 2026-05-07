package com.mindease.app.repository;

import com.mindease.app.model.Mood;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MoodRepository extends JpaRepository<Mood, Long> {
    List<Mood> findByUserIdOrderByDateDesc(Long userId);
    void deleteByUserId(Long userId);
    long count();
}
