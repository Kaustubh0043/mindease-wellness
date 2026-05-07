package com.mindease.app.repository;

import com.mindease.app.model.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
    List<ChatLog> findByUserIdOrderByTimestampDesc(Long userId);
}
