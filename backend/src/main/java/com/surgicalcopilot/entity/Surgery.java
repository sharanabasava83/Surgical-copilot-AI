package com.surgicalcopilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "surgeries")
@Getter
@Setter
public class Surgery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"medicalHistory", "allergies"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_surgeon_id")
    private Doctor leadSurgeon;

    @Column(length = 150, nullable = false)
    private String procedureName;

    @Column(length = 60)
    private String procedureType; // e.g. CARDIAC, ORTHOPEDIC, NEURO, GENERAL

    @Column(length = 30)
    private String status = "SCHEDULED"; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private LocalDateTime actualStart;
    private LocalDateTime actualEnd;

    @Column(length = 100)
    private String operatingRoom;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // ----- Simulated AI outputs (clearly demo / not clinically validated) -----
    private Double predictedSuccessRate;       // 0-100, simulated
    private Double predictedBloodLossMl;       // simulated
    private Integer predictedDurationMinutes;  // simulated

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
