package com.surgicalcopilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Global AI Surgical Copilot Ecosystem - Backend entry point.
 *
 * IMPORTANT: This is a software architecture / portfolio demo project.
 * It is NOT a certified medical device. All diagnostic, predictive, and
 * clinical-recommendation outputs in the "simulated" modules are
 * synthetic and must never be used for real patient care.
 */
@SpringBootApplication
public class SurgicalCopilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(SurgicalCopilotApplication.class, args);
        System.out.println("\n" +
                "============================================================\n" +
                " Global AI Surgical Copilot Ecosystem - Backend running\n" +
                " API base: http://localhost:8080/api\n" +
                " DEMO MODE: outputs are simulated, not clinically validated\n" +
                "============================================================\n");
    }
}
