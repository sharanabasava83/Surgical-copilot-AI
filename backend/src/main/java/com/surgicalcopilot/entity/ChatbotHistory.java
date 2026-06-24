package com.surgicalcopilot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chatbot_history")
@Getter
@Setter
public class ChatbotHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String sessionId;

    @Column(length = 120)
    private String userName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String userMessage;

    @Column(columnDefinition = "TEXT")
    private String botResponse;

    @Column(length = 30)
    private String language = "en";

    @Column(length = 30)
    private String source = "RULE_BASED"; // RULE_BASED, EXTERNAL_LLM (when key configured)

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
