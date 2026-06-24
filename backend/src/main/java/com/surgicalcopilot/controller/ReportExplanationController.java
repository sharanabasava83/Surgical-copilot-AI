package com.surgicalcopilot.controller;

import com.surgicalcopilot.service.ReportExplanationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/report-explanation")
public class ReportExplanationController {

    private final ReportExplanationService service;

    public ReportExplanationController(ReportExplanationService service) {
        this.service = service;
    }

    @PostMapping
    public Map<String, Object> explain(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        return Map.of(
                "original", text == null ? "" : text,
                "explanation", service.explain(text),
                "suggestedQuestions", service.suggestedQuestions()
        );
    }
}
