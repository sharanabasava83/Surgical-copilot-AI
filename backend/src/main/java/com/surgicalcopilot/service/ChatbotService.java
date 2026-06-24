package com.surgicalcopilot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * AI Medical Chatbot service.
 *
 * IMPORTANT: This provides GENERAL informational responses only.
 * It does not diagnose, prescribe, or replace professional medical advice.
 *
 * Modes (set via app.integrations.chatbot.provider in application.properties):
 *  - "none" (default): simple keyword matching, works with zero setup.
 *  - "anthropic": calls the Claude Messages API.
 *  - "openai": calls the OpenAI Chat Completions API.
 *
 * To enable a real provider:
 *   1. Get an API key from Anthropic (console.anthropic.com) or OpenAI (platform.openai.com).
 *   2. Set in application.properties:
 *        app.integrations.chatbot.provider=anthropic   (or openai)
 *        app.integrations.chatbot.api-key=sk-ant-...    (your real key)
 *      The api-url has sensible defaults below and usually doesn't need changing.
 *   3. Never commit your real key - keep it local or use an environment variable override.
 */
@Service
public class ChatbotService {

    private static final String SYSTEM_PROMPT =
            "You are a general medical information assistant inside a software demo. " +
            "You provide general, educational health information only. " +
            "You do NOT diagnose conditions, prescribe medication, or replace a licensed " +
            "clinician. Keep responses concise (3-5 sentences). If the user describes an " +
            "emergency (e.g. chest pain, difficulty breathing, severe bleeding, suicidal " +
            "thoughts), tell them clearly to contact local emergency services immediately. " +
            "Always remind the user to consult a qualified healthcare professional for advice " +
            "specific to their situation.";

    @Value("${app.integrations.chatbot.provider:none}")
    private String provider;

    @Value("${app.integrations.chatbot.api-key:YOUR_LLM_API_KEY_HERE}")
    private String apiKey;

    @Value("${app.integrations.chatbot.api-url:}")
    private String apiUrl;

    @Value("${app.integrations.chatbot.model:}")
    private String configuredModel;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final List<String[]> RULES = List.of(
            new String[]{"fever", "Fevers can have many causes, from infections to inflammation. If a fever is high (above 39.4°C/103°F), persistent, or accompanied by severe symptoms, please seek medical attention promptly."},
            new String[]{"headache", "Headaches are usually not serious, but sudden severe headaches, headaches with vision changes, confusion, or stiff neck need urgent evaluation."},
            new String[]{"surgery", "Recovery time and risks vary a lot by procedure and individual health. Your surgical team is the best source for guidance specific to your case."},
            new String[]{"pain", "Pain levels and patterns are important to track. Please log it in the Recovery Tracker, and contact your care team if pain is severe or worsening."},
            new String[]{"infection", "Signs like increasing redness, warmth, swelling, pus, or fever around a wound can indicate infection and should be checked by a clinician promptly."},
            new String[]{"medication", "For questions about a specific medication, please check the Drug Interaction Checker module or consult your pharmacist/doctor directly."},
            new String[]{"emergency", "If this is a medical emergency, please contact local emergency services immediately rather than relying on this assistant."}
    );

    public String respond(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return "I didn't catch that — could you tell me a bit more about what you'd like to know?";
        }

        boolean useExternal = apiKey != null
                && !apiKey.isBlank()
                && !apiKey.startsWith("YOUR_")
                && (isAnthropic() || isOpenAi());

        if (useExternal) {
            try {
                if (isAnthropic()) return callAnthropic(userMessage);
                return callOpenAi(userMessage);
            } catch (Exception ex) {
                return ruleBasedResponse(userMessage)
                        + "\n\n(Note: external AI provider call failed [" + ex.getMessage()
                        + "], showing a general fallback response instead.)";
            }
        }

        return ruleBasedResponse(userMessage);
    }

    private boolean isAnthropic() {
        return "anthropic".equalsIgnoreCase(provider) || "claude".equalsIgnoreCase(provider);
    }

    private boolean isOpenAi() {
        return "openai".equalsIgnoreCase(provider) || "chatgpt".equalsIgnoreCase(provider);
    }

    private String ruleBasedResponse(String userMessage) {
        String lower = userMessage.toLowerCase(Locale.ROOT);
        for (String[] rule : RULES) {
            if (lower.contains(rule[0])) {
                return rule[1] + "\n\nThis is general information only, not a diagnosis. Please consult a qualified clinician for advice specific to you.";
            }
        }
        return "Thanks for your message. This assistant gives general medical information only, not diagnosis or treatment advice. "
                + "For anything specific to your health, please consult a qualified healthcare professional. "
                + "(Demo mode: connect a real LLM API key in application.properties for richer responses.)";
    }

    // ---------------------------------------------------------------------
    // Anthropic Claude — POST https://api.anthropic.com/v1/messages
    // Required headers: x-api-key, anthropic-version
    // ---------------------------------------------------------------------
    @SuppressWarnings("unchecked")
    private String callAnthropic(String userMessage) {
        String url = (apiUrl == null || apiUrl.isBlank())
                ? "https://api.anthropic.com/v1/messages"
                : apiUrl;
        String model = (configuredModel == null || configuredModel.isBlank())
                ? "claude-sonnet-4-6"
                : configuredModel;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");

        Map<String, Object> body = Map.of(
                "model", model,
                "max_tokens", 400,
                "system", SYSTEM_PROMPT,
                "messages", List.of(Map.of("role", "user", "content", userMessage))
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

        if (response == null) return ruleBasedResponse(userMessage);
        List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
        if (content == null || content.isEmpty()) return ruleBasedResponse(userMessage);

        StringBuilder text = new StringBuilder();
        for (Map<String, Object> block : content) {
            if ("text".equals(block.get("type")) && block.get("text") != null) {
                text.append(block.get("text"));
            }
        }
        return text.length() > 0 ? text.toString() : ruleBasedResponse(userMessage);
    }

    // ---------------------------------------------------------------------
    // OpenAI — POST https://api.openai.com/v1/chat/completions
    // Required header: Authorization: Bearer <key>
    // ---------------------------------------------------------------------
    @SuppressWarnings("unchecked")
    private String callOpenAi(String userMessage) {
        String url = (apiUrl == null || apiUrl.isBlank())
                ? "https://api.openai.com/v1/chat/completions"
                : apiUrl;
        String model = (configuredModel == null || configuredModel.isBlank())
                ? "gpt-4o-mini"
                : configuredModel;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> body = Map.of(
                "model", model,
                "max_tokens", 400,
                "messages", List.of(
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", userMessage)
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

        if (response == null) return ruleBasedResponse(userMessage);
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) return ruleBasedResponse(userMessage);

        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        if (message == null || message.get("content") == null) return ruleBasedResponse(userMessage);

        return String.valueOf(message.get("content"));
    }
}
