package com.surgicalcopilot.controller;

import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.SurgeryRepository;
import com.surgicalcopilot.service.DecisionSupportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/decision-support")
public class DecisionSupportController {

    private final DecisionSupportService service;
    private final SurgeryRepository surgeryRepository;

    public DecisionSupportController(DecisionSupportService service, SurgeryRepository surgeryRepository) {
        this.service = service;
        this.surgeryRepository = surgeryRepository;
    }

    @GetMapping("/surgery/{surgeryId}")
    public List<Map<String, String>> getRecommendations(@PathVariable Long surgeryId) {
        var surgery = surgeryRepository.findById(surgeryId)
                .orElseThrow(() -> new ResourceNotFoundException("Surgery not found with id " + surgeryId));
        return service.getRecommendations(surgery);
    }
}
