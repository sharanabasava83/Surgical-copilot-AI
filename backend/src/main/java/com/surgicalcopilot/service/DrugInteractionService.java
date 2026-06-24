package com.surgicalcopilot.service;

import org.springframework.stereotype.Service;

import java.util.*;

/**
 * AI Drug Interaction Checker.
 *
 * IMPORTANT: Uses a small, illustrative sample dataset of well-known
 * interactions for demo purposes. This is NOT an exhaustive or
 * clinically validated drug-interaction database. Real systems use
 * licensed databases (e.g. First Databank, Lexicomp, Micromedex).
 * Never use this output for real prescribing decisions.
 */
@Service
public class DrugInteractionService {

    private record InteractionRule(String drugA, String drugB, String severity, String description) {}

    private final List<InteractionRule> rules = List.of(
            new InteractionRule("warfarin", "aspirin", "HIGH", "Increased risk of bleeding when combined."),
            new InteractionRule("warfarin", "ibuprofen", "HIGH", "Increased bleeding risk; NSAIDs can potentiate anticoagulant effect."),
            new InteractionRule("metformin", "alcohol", "MEDIUM", "Increased risk of lactic acidosis with heavy alcohol use."),
            new InteractionRule("simvastatin", "clarithromycin", "HIGH", "Increased risk of muscle toxicity (myopathy/rhabdomyolysis)."),
            new InteractionRule("lisinopril", "potassium", "MEDIUM", "Increased risk of hyperkalemia."),
            new InteractionRule("sildenafil", "nitrates", "HIGH", "Can cause severe, life-threatening drop in blood pressure."),
            new InteractionRule("ssri", "maoi", "HIGH", "Risk of serotonin syndrome."),
            new InteractionRule("paracetamol", "alcohol", "MEDIUM", "Increased risk of liver toxicity with chronic alcohol use.")
    );

    public List<Map<String, String>> checkInteractions(List<String> drugNames) {
        List<Map<String, String>> results = new ArrayList<>();
        if (drugNames == null || drugNames.size() < 2) return results;

        List<String> normalized = drugNames.stream().map(d -> d.toLowerCase(Locale.ROOT).trim()).toList();

        for (int i = 0; i < normalized.size(); i++) {
            for (int j = i + 1; j < normalized.size(); j++) {
                String a = normalized.get(i);
                String b = normalized.get(j);
                for (InteractionRule rule : rules) {
                    boolean match = (a.contains(rule.drugA()) && b.contains(rule.drugB()))
                            || (a.contains(rule.drugB()) && b.contains(rule.drugA()));
                    if (match) {
                        results.add(Map.of(
                                "drugA", drugNames.get(i),
                                "drugB", drugNames.get(j),
                                "severity", rule.severity(),
                                "description", rule.description()
                        ));
                    }
                }
            }
        }
        return results;
    }
}
