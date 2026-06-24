package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.DiagnosisAssessment;
import com.surgicalcopilot.entity.Patient;
import com.surgicalcopilot.repository.DiagnosisAssessmentRepository;
import com.surgicalcopilot.repository.PatientRepository;
import com.surgicalcopilot.service.DiagnosisAssistantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnosis")
public class DiagnosisController {

    private final DiagnosisAssistantService service;
    private final DiagnosisAssessmentRepository repository;
    private final PatientRepository patientRepository;

    public DiagnosisController(DiagnosisAssistantService service,
                                DiagnosisAssessmentRepository repository,
                                PatientRepository patientRepository) {
        this.service = service;
        this.repository = repository;
        this.patientRepository = patientRepository;
    }

    @PostMapping("/assess")
    public Map<String, Object> assess(@RequestBody Map<String, Object> request) {
        String symptoms = String.valueOf(request.get("symptoms"));
        Object patientIdRaw = request.get("patientId");

        List<Map<String, String>> differential = service.generateDifferential(symptoms);

        DiagnosisAssessment assessment = new DiagnosisAssessment();
        assessment.setSymptomsInput(symptoms);
        assessment.setPossibleConditionsJson(differential.toString());
        if (patientIdRaw != null) {
            Long patientId = Long.valueOf(String.valueOf(patientIdRaw));
            Patient patient = patientRepository.findById(patientId).orElse(null);
            assessment.setPatient(patient);
        }
        repository.save(assessment);

        return Map.of(
                "symptoms", symptoms,
                "possibleConditions", differential,
                "disclaimer", "Simulated differential from a small illustrative ruleset - not a real diagnostic model. Always consult a qualified clinician."
        );
    }

    @GetMapping("/history")
    public List<DiagnosisAssessment> history() {
        return repository.findAll();
    }
}
