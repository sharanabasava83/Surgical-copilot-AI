package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.ConsultRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultRequestRepository extends JpaRepository<ConsultRequest, Long> {
}
