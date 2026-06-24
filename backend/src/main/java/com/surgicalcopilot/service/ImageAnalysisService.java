package com.surgicalcopilot.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Medical Image Analysis (simulated).
 *
 * IMPORTANT: Does NOT run any real computer-vision model. It generates
 * plausible-looking but entirely synthetic bounding-box annotations so
 * the UI/UX of an "AI-annotated scan viewer" can be demonstrated safely.
 * Every output is tagged as simulated in the API response and entity.
 */
@Service
public class ImageAnalysisService {

    private final Random random = new Random();

    public String generateSimulatedFindingsJson(String reportType) {
        List<Map<String, Object>> boxes = new java.util.ArrayList<>();
        int count = 1 + random.nextInt(2);
        for (int i = 0; i < count; i++) {
            boxes.add(Map.of(
                    "label", pickLabel(reportType),
                    "confidence", round1(50 + random.nextDouble() * 45),
                    "x", random.nextInt(60),
                    "y", random.nextInt(60),
                    "width", 10 + random.nextInt(25),
                    "height", 10 + random.nextInt(25),
                    "simulated", true
            ));
        }
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < boxes.size(); i++) {
            Map<String, Object> b = boxes.get(i);
            json.append(String.format(
                    "{\"label\":\"%s\",\"confidence\":%s,\"x\":%s,\"y\":%s,\"width\":%s,\"height\":%s,\"simulated\":true}",
                    b.get("label"), b.get("confidence"), b.get("x"), b.get("y"), b.get("width"), b.get("height")));
            if (i < boxes.size() - 1) json.append(",");
        }
        json.append("]");
        return json.toString();
    }

    private String pickLabel(String reportType) {
        String type = reportType == null ? "" : reportType.toUpperCase();
        List<String> labels = switch (type) {
            case "XRAY" -> List.of("possible fracture line", "dense region of interest");
            case "MRI" -> List.of("region of interest", "signal intensity variation");
            case "CT" -> List.of("region of interest", "density variation");
            default -> List.of("region of interest");
        };
        return labels.get(random.nextInt(labels.size()));
    }

    private double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
