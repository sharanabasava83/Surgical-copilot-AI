package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.Surgery;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.SurgeryRepository;
import com.surgicalcopilot.service.SurgeryPredictionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surgeries")
public class SurgeryController {

    private final SurgeryRepository repository;
    private final SurgeryPredictionService predictionService;

    public SurgeryController(SurgeryRepository repository, SurgeryPredictionService predictionService) {
        this.repository = repository;
        this.predictionService = predictionService;
    }

    @GetMapping
    public List<Surgery> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Surgery getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Surgery not found with id " + id));
    }

    @GetMapping("/patient/{patientId}")
    public List<Surgery> getByPatient(@PathVariable Long patientId) {
        return repository.findByPatientId(patientId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Surgery create(@Valid @RequestBody Surgery surgery) {
        // Always (re)compute simulated predictions server-side so the
        // frontend can never spoof "validated" numbers.
        predictionService.applySimulatedPredictions(surgery);
        return repository.save(surgery);
    }

    @PutMapping("/{id}")
    public Surgery update(@PathVariable Long id, @Valid @RequestBody Surgery updated) {
        Surgery existing = getOne(id);
        existing.setProcedureName(updated.getProcedureName());
        existing.setProcedureType(updated.getProcedureType());
        existing.setStatus(updated.getStatus());
        existing.setScheduledStart(updated.getScheduledStart());
        existing.setScheduledEnd(updated.getScheduledEnd());
        existing.setActualStart(updated.getActualStart());
        existing.setActualEnd(updated.getActualEnd());
        existing.setOperatingRoom(updated.getOperatingRoom());
        existing.setNotes(updated.getNotes());
        predictionService.applySimulatedPredictions(existing);
        return repository.save(existing);
    }

    @PostMapping("/{id}/recompute-prediction")
    public Surgery recomputePrediction(@PathVariable Long id) {
        Surgery existing = getOne(id);
        predictionService.applySimulatedPredictions(existing);
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(getOne(id));
    }
}
