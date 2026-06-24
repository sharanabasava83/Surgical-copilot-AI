package com.surgicalcopilot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TranslationRequest {
    private String text;
    private String sourceLanguage;
    private String targetLanguage;
    private String context = "GENERAL";
}
