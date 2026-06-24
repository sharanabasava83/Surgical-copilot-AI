package com.surgicalcopilot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Translation engine.
 *
 * Two modes:
 *  - MOCK (default): wraps text with a "[<lang>]" tag so the UI flow works
 *    end-to-end with zero setup.
 *  - LIBRETRANSLATE / other: if app.integrations.translation.api-key and
 *    api-url are set to a real provider, calls out to it instead.
 */
@Service
public class TranslationService {

    @Value("${app.integrations.translation.provider:none}")
    private String provider;

    @Value("${app.integrations.translation.api-key:YOUR_TRANSLATION_API_KEY_HERE}")
    private String apiKey;

    @Value("${app.integrations.translation.api-url:}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String translate(String text, String sourceLang, String targetLang) {
        if (text == null || text.isBlank()) return "";

        if (!"none".equalsIgnoreCase(provider) && apiKey != null && !apiKey.startsWith("YOUR_")) {
            try {
                return callExternalProvider(text, sourceLang, targetLang);
            } catch (Exception ex) {
                return mockTranslate(text, targetLang) + " (external provider call failed, showing mock translation)";
            }
        }

        return mockTranslate(text, targetLang);
    }

    private String mockTranslate(String text, String targetLang) {
        return "[" + (targetLang == null ? "??" : targetLang.toUpperCase()) + "] " + text;
    }

    @SuppressWarnings("unchecked")
    private String callExternalProvider(String text, String sourceLang, String targetLang) {
        Map<String, Object> body = Map.of(
                "q", text,
                "source", sourceLang == null ? "auto" : sourceLang,
                "target", targetLang,
                "format", "text",
                "api_key", apiKey
        );
        Map<String, Object> response = restTemplate.postForObject(apiUrl, body, Map.class);
        if (response == null || !response.containsKey("translatedText")) {
            return mockTranslate(text, targetLang);
        }
        return String.valueOf(response.get("translatedText"));
    }
}
