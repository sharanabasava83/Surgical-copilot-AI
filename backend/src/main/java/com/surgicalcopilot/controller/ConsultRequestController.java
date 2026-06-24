package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.ConsultRequest;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.ConsultRequestRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consult-requests")
public class ConsultRequestController {

    private final ConsultRequestRepository repository;

    public ConsultRequestController(ConsultRequestRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ConsultRequest> getAll() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultRequest create(@Valid @RequestBody ConsultRequest request) {
        return repository.save(request);
    }

    @PatchMapping("/{id}/respond")
    public ConsultRequest respond(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ConsultRequest existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consult request not found with id " + id));
        existing.setExpertResponse(body.get("response"));
        existing.setStatus("RESPONDED");
        return repository.save(existing);
    }
}
