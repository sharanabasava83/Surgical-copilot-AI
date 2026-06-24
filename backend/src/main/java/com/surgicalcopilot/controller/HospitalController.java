package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.Hospital;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.HospitalRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalRepository repository;

    public HospitalController(HospitalRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Hospital> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Hospital getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Hospital create(@Valid @RequestBody Hospital hospital) {
        return repository.save(hospital);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(getOne(id));
    }
}
