package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.Surgery;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * AI Surgical Decision Support.
 *
 * Real (non-simulated) rule engine: evaluates real surgery record fields
 * (predicted blood loss, predicted duration, procedure type) against
 * simple thresholds to surface recommendations. The thresholds and
 * recommendation text are illustrative, not clinically validated
 * guidance - labeled simulated in the API/UI.
 */
@Service
public class DecisionSupportService {

    public List<Map<String, String>> getRecommendations(Surgery surgery) {
        List<Map<String, String>> recs = new ArrayList<>();
        if (surgery == null) return recs;

        if (surgery.getPredictedBloodLossMl() != null && surgery.getPredictedBloodLossMl() > 400) {
            recs.add(Map.of("priority", "HIGH",
                    "recommendation", "Consider having additional blood products on standby given elevated predicted blood loss."));
        }
        if (surgery.getPredictedDurationMinutes() != null && surgery.getPredictedDurationMinutes() > 240) {
            recs.add(Map.of("priority", "MEDIUM",
                    "recommendation", "Long predicted duration - consider staff rotation/break planning."));
        }
        if ("CARDIAC".equalsIgnoreCase(surgery.getProcedureType())) {
            recs.add(Map.of("priority", "MEDIUM",
                    "recommendation", "Cardiac procedure - confirm perfusion team and equipment availability."));
        }
        if ("NEURO".equalsIgnoreCase(surgery.getProcedureType())) {
            recs.add(Map.of("priority", "MEDIUM",
                    "recommendation", "Neuro procedure - confirm neuro-monitoring equipment is calibrated and ready."));
        }
        if (recs.isEmpty()) {
            recs.add(Map.of("priority", "LOW",
                    "recommendation", "No elevated-risk factors flagged based on current predicted metrics."));
        }
        return recs;
    }
}
