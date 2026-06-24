package com.surgicalcopilot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ambulance_tracking")
@Getter
@Setter
public class AmbulanceTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String vehicleCode;

    @Column(length = 150)
    private String driverName;

    @Column(length = 30)
    private String status = "AVAILABLE"; // AVAILABLE, DISPATCHED, EN_ROUTE, ARRIVED, COMPLETED

    private Double currentLat;
    private Double currentLng;

    @Column(length = 255)
    private String destinationHospital;

    private Double destinationLat;
    private Double destinationLng;

    private Integer etaMinutes; // simulated ETA

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
