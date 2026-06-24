package com.surgicalcopilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@Getter
@Setter
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(length = 100)
    private String specialization;

    @Column(length = 150)
    private String hospitalName;

    @Column(length = 150)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 60)
    private String country;

    private int yearsExperience;

    @Column(length = 30)
    private String availabilityStatus = "AVAILABLE"; // AVAILABLE, IN_SURGERY, OFF_DUTY

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
