package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.VitalSign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VitalSignRepository extends JpaRepository<VitalSign, Long> {
    List<VitalSign> findTop50ByPatientIdOrderByRecordedAtDesc(Long patientId);
}
