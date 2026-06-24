package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.RecoveryRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecoveryRecordRepository extends JpaRepository<RecoveryRecord, Long> {
    List<RecoveryRecord> findByPatientIdOrderByRecordDateAsc(Long patientId);
}
