package com.surgicalcopilot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "knowledge_articles")
@Getter
@Setter
public class KnowledgeArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255, nullable = false)
    private String title;

    @Column(length = 100)
    private String category; // e.g. CARDIOLOGY, ORTHOPEDICS, GENERAL_SURGERY

    @Column(length = 255)
    private String authors;

    @Column(length = 100)
    private String sourceJournal;

    private LocalDate publishedDate;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String tags; // comma separated
}
