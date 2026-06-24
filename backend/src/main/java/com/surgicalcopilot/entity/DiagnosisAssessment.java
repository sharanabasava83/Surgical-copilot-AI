package com.surgicalcopilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_assessments")
@Getter
@Setter
public class DiagnosisAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"medicalHistory", "allergies"})
    private Patient patient;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String symptomsInput;

    @Column(columnDefinition = "TEXT")
    private String possibleConditionsJson; // simulated differential list, JSON string

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
