package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.AmbulanceTracking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AmbulanceTrackingRepository extends JpaRepository<AmbulanceTracking, Long> {
}
