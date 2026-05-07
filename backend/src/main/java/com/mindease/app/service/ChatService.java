package com.mindease.app.service;

import com.mindease.app.model.ChatLog;
import com.mindease.app.model.User;
import com.mindease.app.repository.ChatLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatLogRepository chatLogRepository;

    public ChatLog processMessage(User user, String message) {
        String response = generateResponse(message);
        ChatLog log = ChatLog.builder()
                .user(user)
                .message(message)
                .response(response)
                .build();
        return chatLogRepository.save(log);
    }

    private String generateResponse(String message) {
        String msg = message.toLowerCase();
        if (msg.contains("sad") || msg.contains("depressed")) {
            return "I'm sorry you're feeling this way. Remember, it's okay to not be okay. Have you tried talking to someone you trust?";
        } else if (msg.contains("stressed") || msg.contains("anxious")) {
            return "Take a deep breath. Try to focus on one thing at a time. Maybe a short walk or some music could help?";
        } else if (msg.contains("happy") || msg.contains("great")) {
            return "That's wonderful to hear! Keep that positive energy going. What made your day so good?";
        } else if (msg.contains("hello") || msg.contains("hi")) {
            return "Hello! I'm here to listen. How are you feeling today?";
        } else {
            return "I hear you. Tell me more about what's on your mind. I'm here to support you.";
        }
    }

    public List<ChatLog> getUserChatLogs(Long userId) {
        return chatLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
