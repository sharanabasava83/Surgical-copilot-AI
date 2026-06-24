package com.surgicalcopilot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents one of the 53 modules in the ecosystem catalog.
 * `implementationStatus` tells the frontend whether to render a fully
 * working feature (LIVE_DEMO) or a labeled mock screen (SIMULATED).
 *
 * IMPORTANT: SIMULATED modules never represent real clinical AI -
 * they exist to demonstrate UX/architecture for the full ecosystem scope.
 */
@Entity
@Table(name = "module_catalog")
@Getter
@Setter
public class ModuleCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150, nullable = false, unique = true)
    private String moduleKey; // e.g. "tumor-detection"

    @Column(length = 200, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 30, nullable = false)
    private String implementationStatus; // LIVE_DEMO, SIMULATED

    @Column(length = 30)
    private String riskCategory; // NON_CLINICAL, CLINICAL_SIMULATED

    @Column(length = 100)
    private String icon; // icon identifier used by frontend

    private int displayOrder;
}
