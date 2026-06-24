package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.Patient;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository repository;

    public PatientService(PatientRepository repository) {
        this.repository = repository;
    }

    public List<Patient> findAll() {
        return repository.findAll();
    }

    public Patient findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + id));
    }

    public Patient create(Patient patient) {
        return repository.save(patient);
    }

    public Patient update(Long id, Patient updated) {
        Patient existing = findById(id);
        existing.setFullName(updated.getFullName());
        existing.setGender(updated.getGender());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setBloodGroup(updated.getBloodGroup());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        existing.setPreferredLanguage(updated.getPreferredLanguage());
        existing.setMedicalHistory(updated.getMedicalHistory());
        existing.setAllergies(updated.getAllergies());
        existing.setStatus(updated.getStatus());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Patient existing = findById(id);
        repository.delete(existing);
    }
}
