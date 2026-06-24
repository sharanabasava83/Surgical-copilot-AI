package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.ChatbotHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatbotHistoryRepository extends JpaRepository<ChatbotHistory, Long> {
    List<ChatbotHistory> findBySessionIdOrderByCreatedAtAsc(String sessionId);
}
