package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.RecoveryRecord;
import org.springframework.stereotype.Service;

/**
 * Infection Risk Predictor / Readmission Risk Predictor (simulated).
 *
 * IMPORTANT: Simple heuristic thresholds on self-reported vitals, NOT a
 * trained clinical model. Labeled as simulated throughout the API/UI.
 */
@Service
public class RecoveryRiskService {

    public void applySimulatedRisk(RecoveryRecord record) {
        record.setInfectionRiskLevel(computeInfectionRisk(record));
        record.setReadmissionRiskLevel(computeReadmissionRisk(record));
        record.setRecoveryProgressPct(computeRecoveryProgress(record));
    }

    private String computeInfectionRisk(RecoveryRecord r) {
        int score = 0;
        if (r.getTemperatureCelsius() != null && r.getTemperatureCelsius() >= 38.0) score += 2;
        if (r.getHeartRateBpm() != null && r.getHeartRateBpm() > 100) score += 1;
        if (r.getPainScore() != null && r.getPainScore() >= 7) score += 1;
        if (score >= 3) return "HIGH";
        if (score >= 1) return "MEDIUM";
        return "LOW";
    }

    private String computeReadmissionRisk(RecoveryRecord r) {
        int score = 0;
        if (r.getMobilityScore() != null && r.getMobilityScore() < 40) score += 2;
        if (r.getPainScore() != null && r.getPainScore() >= 8) score += 1;
        if ("HIGH".equals(computeInfectionRisk(r))) score += 1;
        if (score >= 3) return "HIGH";
        if (score >= 1) return "MEDIUM";
        return "LOW";
    }

    private double computeRecoveryProgress(RecoveryRecord r) {
        double mobility = r.getMobilityScore() != null ? r.getMobilityScore() : 50;
        double painPenalty = r.getPainScore() != null ? r.getPainScore() * 3 : 15;
        double progress = mobility - painPenalty + 50;
        return Math.max(0, Math.min(100, Math.round(progress * 10) / 10.0));
    }
}
