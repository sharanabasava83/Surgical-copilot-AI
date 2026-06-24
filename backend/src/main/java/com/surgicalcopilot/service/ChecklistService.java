package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.ChecklistItem;
import com.surgicalcopilot.entity.Surgery;
import com.surgicalcopilot.repository.ChecklistItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChecklistService {

    private final ChecklistItemRepository repository;

    public ChecklistService(ChecklistItemRepository repository) {
        this.repository = repository;
    }

    private static final List<String[]> STANDARD_ITEMS = List.of(
            new String[]{"SIGN_IN", "Patient identity, site, and procedure confirmed"},
            new String[]{"SIGN_IN", "Consent confirmed"},
            new String[]{"SIGN_IN", "Surgical site marked (if applicable)"},
            new String[]{"SIGN_IN", "Anesthesia safety check completed"},
            new String[]{"SIGN_IN", "Known allergies reviewed"},
            new String[]{"TIME_OUT", "All team members introduced by name and role"},
            new String[]{"TIME_OUT", "Surgeon, anesthesia, and nursing confirm patient, site, procedure"},
            new String[]{"TIME_OUT", "Anticipated critical events reviewed"},
            new String[]{"TIME_OUT", "Imaging displayed (if applicable)"},
            new String[]{"SIGN_OUT", "Procedure name recorded"},
            new String[]{"SIGN_OUT", "Instrument, sponge, and needle counts confirmed"},
            new String[]{"SIGN_OUT", "Specimen labelling confirmed"},
            new String[]{"SIGN_OUT", "Equipment issues identified"},
            new String[]{"SIGN_OUT", "Key recovery concerns communicated to team"}
    );

    public List<ChecklistItem> generateForSurgery(Surgery surgery) {
        List<ChecklistItem> existing = repository.findBySurgeryIdOrderByDisplayOrderAsc(surgery.getId());
        if (!existing.isEmpty()) return existing;

        List<ChecklistItem> items = new java.util.ArrayList<>();
        int order = 0;
        for (String[] entry : STANDARD_ITEMS) {
            ChecklistItem item = new ChecklistItem();
            item.setSurgery(surgery);
            item.setPhase(entry[0]);
            item.setItemText(entry[1]);
            item.setDisplayOrder(order++);
            items.add(item);
        }
        return repository.saveAll(items);
    }
}
