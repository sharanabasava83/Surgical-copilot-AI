package com.surgicalcopilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"medicalHistory", "allergies"})
    private Patient patient;

    @Column(length = 60)
    private String reportType; // MRI, CT, XRAY, LAB, PATHOLOGY

    @Column(length = 255)
    private String fileName;

    @Column(length = 500)
    private String filePath;

    @Column(columnDefinition = "TEXT")
    private String findingsSummary;

    @Column(columnDefinition = "TEXT")
    private String simplifiedExplanation; // output of "Medical Term Simplifier"

    @Column(length = 30)
    private String aiAnalysisStatus = "PENDING"; // PENDING, SIMULATED_COMPLETE

    @Column(columnDefinition = "TEXT")
    private String aiFindingsJson; // simulated bounding boxes / labels, JSON string

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
