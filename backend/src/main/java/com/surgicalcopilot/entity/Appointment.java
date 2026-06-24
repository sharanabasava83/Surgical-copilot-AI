package com.surgicalcopilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"medicalHistory", "allergies"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(length = 150)
    private String reason;

    private LocalDateTime appointmentTime;

    @Column(length = 30)
    private String status = "BOOKED"; // BOOKED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW

    @Column(length = 30)
    private String type = "CONSULTATION"; // CONSULTATION, FOLLOW_UP, PRE_OP, POST_OP

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
