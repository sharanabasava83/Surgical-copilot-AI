package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.Patient;
import com.surgicalcopilot.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @GetMapping
    public List<Patient> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Patient getOne(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Patient create(@Valid @RequestBody Patient patient) {
        return service.create(patient);
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable Long id, @Valid @RequestBody Patient patient) {
        return service.update(id, patient);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
