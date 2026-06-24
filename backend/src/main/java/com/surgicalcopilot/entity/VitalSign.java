package com.surgicalcopilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "vital_signs")
@Getter
@Setter
public class VitalSign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"medicalHistory", "allergies"})
    private Patient patient;

    private Integer heartRateBpm;
    private Integer systolicBp;
    private Integer diastolicBp;
    private Double temperatureCelsius;
    private Integer oxygenSaturationPct;
    private Integer respiratoryRate;

    @Column(length = 60)
    private String deviceSource = "SIMULATED_WEARABLE";

    @Column(nullable = false, updatable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();
}
