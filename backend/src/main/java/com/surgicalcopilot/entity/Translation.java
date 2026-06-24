package com.surgicalcopilot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "translations")
@Getter
@Setter
public class Translation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String sourceText;

    @Column(columnDefinition = "TEXT")
    private String translatedText;

    @Column(length = 10)
    private String sourceLanguage;

    @Column(length = 10)
    private String targetLanguage;

    @Column(length = 30)
    private String context; // GENERAL, EMERGENCY, SURGERY_TEAM, CHAT

    @Column(length = 30)
    private String provider = "MOCK"; // MOCK, LIBRETRANSLATE, GOOGLE, etc.

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
