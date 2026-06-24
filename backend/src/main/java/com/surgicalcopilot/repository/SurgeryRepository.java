package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.Surgery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurgeryRepository extends JpaRepository<Surgery, Long> {
    List<Surgery> findByPatientId(Long patientId);
    List<Surgery> findByStatus(String status);
}
