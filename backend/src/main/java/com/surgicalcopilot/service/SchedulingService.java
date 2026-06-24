package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.Appointment;
import com.surgicalcopilot.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Real (non-simulated) scheduling logic: checks whether a doctor already
 * has a booked appointment within +/- 30 minutes of the requested time.
 */
@Service
public class SchedulingService {

    private static final int BUFFER_MINUTES = 30;

    private final AppointmentRepository repository;

    public SchedulingService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public boolean hasConflict(Long doctorId, LocalDateTime requestedTime, Long excludeAppointmentId) {
        if (doctorId == null || requestedTime == null) return false;
        List<Appointment> existing = repository.findByDoctorId(doctorId);
        LocalDateTime windowStart = requestedTime.minusMinutes(BUFFER_MINUTES);
        LocalDateTime windowEnd = requestedTime.plusMinutes(BUFFER_MINUTES);

        return existing.stream()
                .filter(a -> excludeAppointmentId == null || !a.getId().equals(excludeAppointmentId))
                .filter(a -> !"CANCELLED".equals(a.getStatus()))
                .anyMatch(a -> a.getAppointmentTime() != null
                        && !a.getAppointmentTime().isBefore(windowStart)
                        && !a.getAppointmentTime().isAfter(windowEnd));
    }
}
