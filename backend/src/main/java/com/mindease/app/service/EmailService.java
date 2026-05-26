package com.mindease.app.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("MindEase Identity Verification Code");
        message.setText("Welcome to MindEase.\n\n" +
                "To initialize your neural presence, enter this 6-digit access code on your registration screen:\n\n" +
                "   " + code + "\n\n" +
                "This code is confidential. If you did not request this, please disregard this transmission.\n\n" +
                "Stay mindful,\n" +
                "MindEase Institutional Wellness Portal");
        
        try {
            mailSender.send(message);
            System.out.println("Verification email successfully dispatched to " + toEmail);
        } catch (Exception e) {
            System.err.println("FAILED TO DISPATCH VERIFICATION EMAIL to " + toEmail + ": " + e.getMessage());
            // Print advice to logs on how to resolve SMTP configuration
            System.err.println("Please configure valid SMTP credentials in application.properties (spring.mail.username and spring.mail.password).");
        }
    }
}
