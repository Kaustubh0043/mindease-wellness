package com.mindease.app.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "moods")
public class Mood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MoodType mood;

    private String note;

    @Column(nullable = false)
    private LocalDate date;

    public Mood() {}

    public Mood(User user, MoodType mood, String note, LocalDate date) {
        this.user = user;
        this.mood = mood;
        this.note = note;
        this.date = date;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public MoodType getMood() { return mood; }
    public void setMood(MoodType mood) { this.mood = mood; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
