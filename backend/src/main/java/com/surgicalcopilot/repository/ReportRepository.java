package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByPatientId(Long patientId);
}
