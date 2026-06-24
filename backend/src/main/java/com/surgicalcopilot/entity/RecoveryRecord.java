package com.surgicalcopilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_records")
@Getter
@Setter
public class RecoveryRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"medicalHistory", "allergies"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "surgery_id")
    private Surgery surgery;

    private LocalDate recordDate;

    private Integer painScore;          // 0-10, self-reported
    private Double temperatureCelsius;
    private Integer heartRateBpm;
    private Integer mobilityScore;       // 0-100 simulated
    private Double recoveryProgressPct;  // 0-100 simulated

    @Column(length = 30)
    private String infectionRiskLevel;   // LOW, MEDIUM, HIGH - simulated
    @Column(length = 30)
    private String readmissionRiskLevel; // LOW, MEDIUM, HIGH - simulated

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
