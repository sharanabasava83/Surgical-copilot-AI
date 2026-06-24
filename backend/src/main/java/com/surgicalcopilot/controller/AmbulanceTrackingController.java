package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.AmbulanceTracking;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.AmbulanceTrackingRepository;
import com.surgicalcopilot.service.AmbulanceTrackingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceTrackingController {

    private final AmbulanceTrackingRepository repository;
    private final AmbulanceTrackingService trackingService;

    public AmbulanceTrackingController(AmbulanceTrackingRepository repository,
                                        AmbulanceTrackingService trackingService) {
        this.repository = repository;
        this.trackingService = trackingService;
    }

    @GetMapping
    public List<AmbulanceTracking> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public AmbulanceTracking getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AmbulanceTracking create(@Valid @RequestBody AmbulanceTracking ambulance) {
        return repository.save(ambulance);
    }

    /** Advances the ambulance's simulated position one step closer to destination. */
    @PostMapping("/{id}/advance")
    public AmbulanceTracking advance(@PathVariable Long id) {
        AmbulanceTracking ambulance = getOne(id);
        trackingService.advance(ambulance);
        return repository.save(ambulance);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(getOne(id));
    }
}
