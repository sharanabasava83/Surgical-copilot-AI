package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
