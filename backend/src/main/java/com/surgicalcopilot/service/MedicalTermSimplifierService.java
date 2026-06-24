package com.surgicalcopilot.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Medical Term Simplifier.
 *
 * Real (non-simulated) rule-based rewriting: replaces common clinical
 * terms with plain-language equivalents using a glossary. This is a
 * genuinely useful, deterministic text transform - not an AI model -
 * so it is safe to label as a "live" feature.
 */
@Service
public class MedicalTermSimplifierService {

    // Ordered so longer/more specific phrases are matched before shorter ones.
    private static final Map<String, String> GLOSSARY = new LinkedHashMap<>();

    static {
        GLOSSARY.put("myocardial infarction", "heart attack");
        GLOSSARY.put("cerebrovascular accident", "stroke");
        GLOSSARY.put("hypertension", "high blood pressure");
        GLOSSARY.put("hypotension", "low blood pressure");
        GLOSSARY.put("hyperglycemia", "high blood sugar");
        GLOSSARY.put("hypoglycemia", "low blood sugar");
        GLOSSARY.put("tachycardia", "fast heart rate");
        GLOSSARY.put("bradycardia", "slow heart rate");
        GLOSSARY.put("dyspnea", "shortness of breath");
        GLOSSARY.put("edema", "swelling caused by fluid buildup");
        GLOSSARY.put("laparoscopic", "minimally invasive (using small incisions and a camera)");
        GLOSSARY.put("anesthesia", "medicine used to prevent pain during a procedure");
        GLOSSARY.put("benign", "not cancerous");
        GLOSSARY.put("malignant", "cancerous");
        GLOSSARY.put("metastasis", "spread of cancer to other parts of the body");
        GLOSSARY.put("biopsy", "a small tissue sample taken for testing");
        GLOSSARY.put("contraindicated", "not recommended/should be avoided");
        GLOSSARY.put("idiopathic", "of unknown cause");
        GLOSSARY.put("prognosis", "expected outcome");
        GLOSSARY.put("comorbidity", "an additional existing health condition");
        GLOSSARY.put("postoperative", "after surgery");
        GLOSSARY.put("preoperative", "before surgery");
        GLOSSARY.put("intraoperative", "during surgery");
        GLOSSARY.put("thrombosis", "a blood clot");
        GLOSSARY.put("embolism", "a blockage caused by a clot or other particle");
        GLOSSARY.put("sepsis", "a serious, body-wide response to infection");
        GLOSSARY.put("fracture", "a broken bone");
        GLOSSARY.put("lesion", "an area of abnormal tissue");
    }

    public String simplify(String clinicalText) {
        if (clinicalText == null || clinicalText.isBlank()) return "";

        String result = clinicalText;
        for (Map.Entry<String, String> entry : GLOSSARY.entrySet()) {
            Pattern pattern = Pattern.compile("(?i)\\b" + Pattern.quote(entry.getKey()) + "\\b");
            Matcher matcher = pattern.matcher(result);
            result = matcher.replaceAll(Matcher.quoteReplacement(entry.getValue()));
        }
        return result;
    }
}
