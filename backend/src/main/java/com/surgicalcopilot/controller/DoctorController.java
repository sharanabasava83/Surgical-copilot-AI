package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.Doctor;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.DoctorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository repository;

    public DoctorController(DoctorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Doctor> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Doctor getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Doctor create(@Valid @RequestBody Doctor doctor) {
        return repository.save(doctor);
    }

    @PutMapping("/{id}")
    public Doctor update(@PathVariable Long id, @Valid @RequestBody Doctor updated) {
        Doctor existing = getOne(id);
        existing.setFullName(updated.getFullName());
        existing.setSpecialization(updated.getSpecialization());
        existing.setHospitalName(updated.getHospitalName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setCountry(updated.getCountry());
        existing.setYearsExperience(updated.getYearsExperience());
        existing.setAvailabilityStatus(updated.getAvailabilityStatus());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(getOne(id));
    }
}
