package com.surgicalcopilot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "collaboration_posts")
@Getter
@Setter
public class CollaborationPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150, nullable = false)
    private String authorName;

    @Column(length = 150)
    private String hospitalName;

    @Column(length = 100)
    private String country;

    @Column(length = 30)
    private String postType = "CASE_SHARE"; // CASE_SHARE, DISCUSSION, ALERT

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(length = 30)
    private String anonymizationLevel = "FULLY_ANONYMIZED";

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
