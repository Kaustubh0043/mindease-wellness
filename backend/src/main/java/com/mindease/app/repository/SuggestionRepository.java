package com.mindease.app.repository;

import com.mindease.app.model.MoodType;
import com.mindease.app.model.Suggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    List<Suggestion> findByMood(MoodType mood);
}
