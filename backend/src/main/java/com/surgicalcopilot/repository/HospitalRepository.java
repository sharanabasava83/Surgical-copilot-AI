package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
}
