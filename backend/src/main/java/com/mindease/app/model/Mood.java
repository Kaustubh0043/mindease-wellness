package com.mindease.app.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "moods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}
