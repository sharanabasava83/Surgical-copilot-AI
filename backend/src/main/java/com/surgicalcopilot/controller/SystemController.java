package com.surgicalcopilot.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    @Value("${app.demo-mode:true}")
    private boolean demoMode;

    @Value("${app.disclaimer}")
    private String disclaimer;

    @GetMapping("/info")
    public Map<String, Object> info() {
        return Map.of(
                "name", "Global AI Surgical Copilot Ecosystem",
                "demoMode", demoMode,
                "disclaimer", disclaimer,
                "moduleCount", 53
        );
    }
}
