package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
