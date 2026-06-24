package com.surgicalcopilot.service;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Report Explanation Engine.
 *
 * Reuses the real MedicalTermSimplifierService to rewrite report text into
 * plain language, plus adds a structured "what this means" / "what to ask
 * your doctor" scaffold. The text rewriting is real; the structured
 * scaffold is templated guidance, not a clinical interpretation - labeled
 * accordingly in the API/UI.
 */
@Service
public class ReportExplanationService {

    private final MedicalTermSimplifierService simplifierService;

    public ReportExplanationService(MedicalTermSimplifierService simplifierService) {
        this.simplifierService = simplifierService;
    }

    public String explain(String reportText) {
        if (reportText == null || reportText.isBlank()) return "";
        return simplifierService.simplify(reportText);
    }

    public List<String> suggestedQuestions() {
        return List.of(
                "What does this finding mean for my specific situation?",
                "Do I need any follow-up tests because of this report?",
                "Does this change my treatment plan?",
                "Are there any symptoms I should watch for related to this finding?"
        );
    }
}
