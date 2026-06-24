package com.surgicalcopilot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String country;

    private Double latitude;
    private Double longitude;

    @Column(length = 30)
    private String type; // GENERAL, TRAUMA_CENTER, SPECIALTY, CLINIC

    private Integer bedsAvailable;
    private Integer icuBedsAvailable;

    @Column(length = 30)
    private String emergencyCapacity = "NORMAL"; // NORMAL, BUSY, CRITICAL
}
