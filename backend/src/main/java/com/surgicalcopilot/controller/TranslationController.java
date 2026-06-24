package com.surgicalcopilot.controller;

import com.surgicalcopilot.dto.TranslationRequest;
import com.surgicalcopilot.entity.Translation;
import com.surgicalcopilot.repository.TranslationRepository;
import com.surgicalcopilot.service.TranslationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/translate")
public class TranslationController {

    private final TranslationService translationService;
    private final TranslationRepository repository;

    public TranslationController(TranslationService translationService, TranslationRepository repository) {
        this.translationService = translationService;
        this.repository = repository;
    }

    @PostMapping
    public Map<String, String> translate(@RequestBody TranslationRequest request) {
        String translated = translationService.translate(
                request.getText(), request.getSourceLanguage(), request.getTargetLanguage());

        Translation record = new Translation();
        record.setSourceText(request.getText());
        record.setTranslatedText(translated);
        record.setSourceLanguage(request.getSourceLanguage());
        record.setTargetLanguage(request.getTargetLanguage());
        record.setContext(request.getContext());
        repository.save(record);

        return Map.of("translatedText", translated);
    }

    @GetMapping("/history")
    public List<Translation> getHistory() {
        return repository.findAll();
    }
}
