package com.surgicalcopilot.controller;

import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.VitalSignRepository;
import com.surgicalcopilot.service.EmergencyDetectionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency-detection")
public class EmergencyDetectionController {

    private final EmergencyDetectionService service;
    private final VitalSignRepository vitalSignRepository;

    public EmergencyDetectionController(EmergencyDetectionService service, VitalSignRepository vitalSignRepository) {
        this.service = service;
        this.vitalSignRepository = vitalSignRepository;
    }

    @GetMapping("/patient/{patientId}")
    public Map<String, Object> evaluateLatest(@PathVariable Long patientId) {
        List<com.surgicalcopilot.entity.VitalSign> readings =
                vitalSignRepository.findTop50ByPatientIdOrderByRecordedAtDesc(patientId);
        if (readings.isEmpty()) {
            throw new ResourceNotFoundException("No vitals readings found for patient " + patientId);
        }
        var latest = readings.get(0);
        List<Map<String, String>> alerts = service.evaluate(latest);
        return Map.of(
                "latestReading", latest,
                "alerts", alerts,
                "alertCount", alerts.size()
        );
    }
}
