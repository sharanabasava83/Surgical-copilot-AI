package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.Patient;
import com.surgicalcopilot.entity.VitalSign;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.PatientRepository;
import com.surgicalcopilot.repository.VitalSignRepository;
import com.surgicalcopilot.service.VitalsSimulationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vitals")
public class VitalSignController {

    private final VitalSignRepository repository;
    private final PatientRepository patientRepository;
    private final VitalsSimulationService simulationService;

    public VitalSignController(VitalSignRepository repository,
                                PatientRepository patientRepository,
                                VitalsSimulationService simulationService) {
        this.repository = repository;
        this.patientRepository = patientRepository;
        this.simulationService = simulationService;
    }

    @GetMapping("/patient/{patientId}")
    public List<VitalSign> getRecent(@PathVariable Long patientId) {
        return repository.findTop50ByPatientIdOrderByRecordedAtDesc(patientId);
    }

    /**
     * Generates one new SIMULATED vitals reading for the patient and stores it.
     * Intended to be polled by the frontend every few seconds to animate a
     * "live monitoring" view.
     */
    @PostMapping("/patient/{patientId}/simulate-reading")
    public VitalSign simulateReading(@PathVariable Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + patientId));
        VitalSign reading = simulationService.generateForPatient(patient);
        return repository.save(reading);
    }
}
