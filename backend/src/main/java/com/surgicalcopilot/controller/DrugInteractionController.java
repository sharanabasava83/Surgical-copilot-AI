package com.surgicalcopilot.controller;

import com.surgicalcopilot.service.DrugInteractionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drug-interactions")
public class DrugInteractionController {

    private final DrugInteractionService service;

    public DrugInteractionController(DrugInteractionService service) {
        this.service = service;
    }

    @PostMapping("/check")
    public Map<String, Object> check(@RequestBody Map<String, List<String>> request) {
        List<String> drugs = request.getOrDefault("drugs", List.of());
        List<Map<String, String>> interactions = service.checkInteractions(drugs);
        return Map.of(
                "drugsChecked", drugs,
                "interactionsFound", interactions.size(),
                "interactions", interactions,
                "disclaimer", "Demo dataset only - not an exhaustive or clinically validated drug interaction database."
        );
    }
}
