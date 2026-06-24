package com.surgicalcopilot.controller;

import com.surgicalcopilot.service.MedicalTermSimplifierService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/term-simplifier")
public class TermSimplifierController {

    private final MedicalTermSimplifierService service;

    public TermSimplifierController(MedicalTermSimplifierService service) {
        this.service = service;
    }

    @PostMapping
    public Map<String, String> simplify(@RequestBody Map<String, String> request) {
        String original = request.get("text");
        String simplified = service.simplify(original);
        return Map.of("original", original == null ? "" : original, "simplified", simplified);
    }
}
