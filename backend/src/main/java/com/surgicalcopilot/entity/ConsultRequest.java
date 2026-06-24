package com.surgicalcopilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "consult_requests")
@Getter
@Setter
public class ConsultRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requesting_doctor_id")
    private Doctor requestingDoctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expert_doctor_id")
    private Doctor expertDoctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"medicalHistory", "allergies"})
    private Patient patient;

    @Column(columnDefinition = "TEXT")
    private String question;

    @Column(length = 30)
    private String urgency = "ROUTINE"; // ROUTINE, URGENT, EMERGENCY

    @Column(length = 30)
    private String status = "PENDING"; // PENDING, ACCEPTED, RESPONDED, CLOSED

    @Column(columnDefinition = "TEXT")
    private String expertResponse;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
