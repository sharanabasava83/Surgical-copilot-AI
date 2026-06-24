package com.surgicalcopilot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {
    private String sessionId;
    private String userName;
    private String message;
    private String language = "en";
}
