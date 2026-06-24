package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.Surgery;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * Produces SIMULATED predictions for surgery outcomes.
 *
 * IMPORTANT: This is a deterministic-ish heuristic for demo purposes only.
 * It is NOT a trained clinical model and must never be used for real
 * surgical planning or patient risk assessment. Every output is labeled
 * "simulated" end-to-end through the API and UI.
 */
@Service
public class SurgeryPredictionService {

    private final Random random = new Random();

    public void applySimulatedPredictions(Surgery surgery) {
        String type = surgery.getProcedureType() == null ? "GENERAL" : surgery.getProcedureType();

        double baseSuccess = switch (type) {
            case "CARDIAC" -> 90.0;
            case "NEURO" -> 87.0;
            case "ORTHOPEDIC" -> 95.0;
            case "TRANSPLANT" -> 84.0;
            default -> 93.0;
        };
        double successJitter = (random.nextDouble() * 6) - 3; // +/- 3
        surgery.setPredictedSuccessRate(round1(clamp(baseSuccess + successJitter, 50, 99.5)));

        double baseBloodLoss = switch (type) {
            case "CARDIAC" -> 400.0;
            case "NEURO" -> 250.0;
            case "ORTHOPEDIC" -> 200.0;
            case "TRANSPLANT" -> 600.0;
            default -> 150.0;
        };
        double bloodJitter = (random.nextDouble() * 100) - 50;
        surgery.setPredictedBloodLossMl(round1(Math.max(20, baseBloodLoss + bloodJitter)));

        int baseDuration = switch (type) {
            case "CARDIAC" -> 240;
            case "NEURO" -> 210;
            case "ORTHOPEDIC" -> 150;
            case "TRANSPLANT" -> 300;
            default -> 90;
        };
        int durationJitter = random.nextInt(41) - 20; // +/- 20
        surgery.setPredictedDurationMinutes(Math.max(30, baseDuration + durationJitter));
    }

    private double clamp(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }

    private double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
