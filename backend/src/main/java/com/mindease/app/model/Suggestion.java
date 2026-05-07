package com.mindease.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suggestions")
public class Suggestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MoodType mood;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String suggestion;

    public Suggestion() {}

    public Suggestion(MoodType mood, String suggestion) {
        this.mood = mood;
        this.suggestion = suggestion;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public MoodType getMood() { return mood; }
    public void setMood(MoodType mood) { this.mood = mood; }
    public String getSuggestion() { return suggestion; }
    public void setSuggestion(String suggestion) { this.suggestion = suggestion; }
}
