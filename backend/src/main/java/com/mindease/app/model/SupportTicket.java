package com.mindease.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String studentEmail;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private String status; // OPEN, IN_PROGRESS, RESOLVED

    @CreationTimestamp
    private LocalDateTime createdAt;
}
