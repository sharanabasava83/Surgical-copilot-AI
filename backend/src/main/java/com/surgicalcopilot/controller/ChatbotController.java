package com.surgicalcopilot.controller;

import com.surgicalcopilot.dto.ChatRequest;
import com.surgicalcopilot.entity.ChatbotHistory;
import com.surgicalcopilot.repository.ChatbotHistoryRepository;
import com.surgicalcopilot.service.ChatbotService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final ChatbotHistoryRepository historyRepository;

    public ChatbotController(ChatbotService chatbotService, ChatbotHistoryRepository historyRepository) {
        this.chatbotService = chatbotService;
        this.historyRepository = historyRepository;
    }

    @PostMapping("/message")
    public Map<String, String> sendMessage(@RequestBody ChatRequest request) {
        String response = chatbotService.respond(request.getMessage());

        ChatbotHistory history = new ChatbotHistory();
        history.setSessionId(request.getSessionId());
        history.setUserName(request.getUserName());
        history.setUserMessage(request.getMessage());
        history.setBotResponse(response);
        history.setLanguage(request.getLanguage());
        historyRepository.save(history);

        return Map.of("response", response);
    }

    @GetMapping("/history/{sessionId}")
    public List<ChatbotHistory> getHistory(@PathVariable String sessionId) {
        return historyRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }
}
