package com.surgicalcopilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "checklist_items")
@Getter
@Setter
public class ChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "surgery_id", nullable = false)
    @JsonIgnoreProperties({"notes"})
    private Surgery surgery;

    @Column(length = 30)
    private String phase; // SIGN_IN, TIME_OUT, SIGN_OUT (WHO checklist style)

    @Column(length = 255, nullable = false)
    private String itemText;

    private boolean completed = false;

    @Column(length = 120)
    private String completedBy;

    private LocalDateTime completedAt;

    private int displayOrder;
}
