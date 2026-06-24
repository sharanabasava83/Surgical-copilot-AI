package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {
    List<ChecklistItem> findBySurgeryIdOrderByDisplayOrderAsc(Long surgeryId);
}
