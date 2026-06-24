package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.ChecklistItem;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.ChecklistItemRepository;
import com.surgicalcopilot.repository.SurgeryRepository;
import com.surgicalcopilot.service.ChecklistService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checklist")
public class ChecklistController {

    private final ChecklistItemRepository repository;
    private final SurgeryRepository surgeryRepository;
    private final ChecklistService checklistService;

    public ChecklistController(ChecklistItemRepository repository,
                                SurgeryRepository surgeryRepository,
                                ChecklistService checklistService) {
        this.repository = repository;
        this.surgeryRepository = surgeryRepository;
        this.checklistService = checklistService;
    }

    @GetMapping("/surgery/{surgeryId}")
    public List<ChecklistItem> getForSurgery(@PathVariable Long surgeryId) {
        var surgery = surgeryRepository.findById(surgeryId)
                .orElseThrow(() -> new ResourceNotFoundException("Surgery not found with id " + surgeryId));
        return checklistService.generateForSurgery(surgery);
    }

    @PatchMapping("/{id}/toggle")
    public ChecklistItem toggle(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ChecklistItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Checklist item not found with id " + id));
        item.setCompleted(!item.isCompleted());
        item.setCompletedBy(item.isCompleted() ? body.getOrDefault("completedBy", "Unknown") : null);
        item.setCompletedAt(item.isCompleted() ? LocalDateTime.now() : null);
        return repository.save(item);
    }
}
