package com.mindease.app.service;

import com.mindease.app.model.MoodType;
import com.mindease.app.model.Suggestion;
import com.mindease.app.repository.SuggestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuggestionService {
    private final SuggestionRepository suggestionRepository;

    public List<Suggestion> getSuggestionsByMood(MoodType mood) {
        return suggestionRepository.findByMood(mood);
    }

    public List<Suggestion> getAllSuggestions() {
        return suggestionRepository.findAll();
    }

    public Suggestion saveSuggestion(Suggestion suggestion) {
        return suggestionRepository.save(suggestion);
    }

    public void deleteSuggestion(Long id) {
        suggestionRepository.deleteById(id);
    }

    public Suggestion updateSuggestion(Long id, Suggestion details) {
        Suggestion suggestion = suggestionRepository.findById(id).orElseThrow();
        suggestion.setMood(details.getMood());
        suggestion.setSuggestion(details.getSuggestion());
        return suggestionRepository.save(suggestion);
    }
}
