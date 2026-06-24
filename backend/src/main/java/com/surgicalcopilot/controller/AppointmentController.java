package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.Appointment;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.AppointmentRepository;
import com.surgicalcopilot.service.SchedulingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository repository;
    private final SchedulingService schedulingService;

    public AppointmentController(AppointmentRepository repository, SchedulingService schedulingService) {
        this.repository = repository;
        this.schedulingService = schedulingService;
    }

    @GetMapping
    public List<Appointment> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Appointment getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + id));
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getByPatient(@PathVariable Long patientId) {
        return repository.findByPatientId(patientId);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Appointment appointment) {
        Long doctorId = appointment.getDoctor() != null ? appointment.getDoctor().getId() : null;
        boolean conflict = schedulingService.hasConflict(doctorId, appointment.getAppointmentTime(), null);
        if (conflict) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", "Scheduling conflict",
                    "message", "This doctor already has an appointment within 30 minutes of the requested time."
            ));
        }
        Appointment saved = repository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Appointment updated) {
        Appointment existing = getOne(id);
        Long doctorId = updated.getDoctor() != null ? updated.getDoctor().getId() : null;
        boolean conflict = schedulingService.hasConflict(doctorId, updated.getAppointmentTime(), id);
        if (conflict) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", "Scheduling conflict",
                    "message", "This doctor already has an appointment within 30 minutes of the requested time."
            ));
        }
        existing.setDoctor(updated.getDoctor());
        existing.setPatient(updated.getPatient());
        existing.setReason(updated.getReason());
        existing.setAppointmentTime(updated.getAppointmentTime());
        existing.setStatus(updated.getStatus());
        existing.setType(updated.getType());
        return ResponseEntity.ok(repository.save(existing));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(getOne(id));
    }
}
