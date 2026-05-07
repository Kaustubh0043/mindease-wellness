package com.mindease.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String response;

    @CreationTimestamp
    private LocalDateTime timestamp;
}
