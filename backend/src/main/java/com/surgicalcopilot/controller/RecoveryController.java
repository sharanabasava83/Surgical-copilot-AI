package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.RecoveryRecord;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.RecoveryRecordRepository;
import com.surgicalcopilot.service.RecoveryRiskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recovery-records")
public class RecoveryController {

    private final RecoveryRecordRepository repository;
    private final RecoveryRiskService riskService;

    public RecoveryController(RecoveryRecordRepository repository, RecoveryRiskService riskService) {
        this.repository = repository;
        this.riskService = riskService;
    }

    @GetMapping("/patient/{patientId}")
    public List<RecoveryRecord> getByPatient(@PathVariable Long patientId) {
        return repository.findByPatientIdOrderByRecordDateAsc(patientId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecoveryRecord create(@Valid @RequestBody RecoveryRecord record) {
        riskService.applySimulatedRisk(record);
        return repository.save(record);
    }

    @GetMapping("/{id}")
    public RecoveryRecord getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recovery record not found with id " + id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(getOne(id));
    }
}
