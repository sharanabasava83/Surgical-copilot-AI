package com.surgicalcopilot.service;

import org.springframework.stereotype.Service;

import java.util.*;

/**
 * AI Diagnosis Assistant (simulated).
 *
 * IMPORTANT: Uses simple keyword-to-condition mapping against a small
 * illustrative list. This is NOT a real diagnostic model, has not been
 * validated on any clinical data, and must never be used for real
 * diagnostic decisions. Every output is labeled simulated.
 */
@Service
public class DiagnosisAssistantService {

    private record ConditionRule(String keyword, String condition, String likelihood) {}

    private final List<ConditionRule> rules = List.of(
            new ConditionRule("chest pain", "Possible cardiac event (e.g. angina)", "Consider urgent evaluation"),
            new ConditionRule("chest pain", "Musculoskeletal chest wall pain", "Common, lower urgency"),
            new ConditionRule("shortness of breath", "Respiratory infection", "Moderate likelihood"),
            new ConditionRule("shortness of breath", "Asthma exacerbation", "Moderate likelihood"),
            new ConditionRule("fever", "Viral infection", "Common"),
            new ConditionRule("fever", "Bacterial infection", "Consider if persistent/high"),
            new ConditionRule("headache", "Tension headache", "Common"),
            new ConditionRule("headache", "Migraine", "Consider if recurrent with aura"),
            new ConditionRule("abdominal pain", "Gastritis", "Common"),
            new ConditionRule("abdominal pain", "Appendicitis", "Consider if right-lower-quadrant, worsening"),
            new ConditionRule("joint pain", "Osteoarthritis", "Common with age"),
            new ConditionRule("joint pain", "Inflammatory arthritis", "Consider if multiple joints, morning stiffness"),
            new ConditionRule("fatigue", "Anemia", "Consider with blood work"),
            new ConditionRule("fatigue", "Hypothyroidism", "Consider with blood work"),
            new ConditionRule("rash", "Contact dermatitis", "Common"),
            new ConditionRule("rash", "Allergic reaction", "Consider if rapid onset")
    );

    public List<Map<String, String>> generateDifferential(String symptomsInput) {
        List<Map<String, String>> results = new ArrayList<>();
        if (symptomsInput == null || symptomsInput.isBlank()) return results;

        String lower = symptomsInput.toLowerCase(Locale.ROOT);
        Set<String> matchedConditions = new LinkedHashSet<>();

        for (ConditionRule rule : rules) {
            if (lower.contains(rule.keyword()) && !matchedConditions.contains(rule.condition())) {
                results.add(Map.of(
                        "condition", rule.condition(),
                        "matchedSymptom", rule.keyword(),
                        "likelihoodNote", rule.likelihood(),
                        "simulated", "true"
                ));
                matchedConditions.add(rule.condition());
            }
        }

        if (results.isEmpty()) {
            results.add(Map.of(
                    "condition", "No matching pattern in demo dataset",
                    "matchedSymptom", "—",
                    "likelihoodNote", "Try keywords like: chest pain, fever, headache, fatigue, joint pain, rash",
                    "simulated", "true"
            ));
        }

        return results;
    }
}
