package com.surgicalcopilot.controller;

import com.surgicalcopilot.service.SimilarCaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/similar-cases")
public class SimilarCaseController {

    private final SimilarCaseService service;

    public SimilarCaseController(SimilarCaseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Map<String, Object>> find(
            @RequestParam(required = false) String procedureType,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long excludeId) {
        return service.findSimilar(procedureType, query, excludeId);
    }
}
