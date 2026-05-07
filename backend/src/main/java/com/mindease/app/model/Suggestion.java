package com.mindease.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suggestions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Suggestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MoodType mood;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String suggestion;
}
