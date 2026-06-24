package com.surgicalcopilot.service;

import com.surgicalcopilot.entity.Surgery;
import com.surgicalcopilot.repository.SurgeryRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Similar Case Recommendation.
 *
 * Real (non-simulated) similarity logic: ranks existing surgeries by how
 * many attributes (procedure type, procedure name keywords) match the
 * given query. This is genuine retrieval logic over real stored data -
 * but the underlying "case database" is just this demo's small sample
 * dataset, not a real clinical case repository, so results are limited
 * and should be read as a UX demonstration rather than real case matching.
 */
@Service
public class SimilarCaseService {

    private final SurgeryRepository surgeryRepository;

    public SimilarCaseService(SurgeryRepository surgeryRepository) {
        this.surgeryRepository = surgeryRepository;
    }

    public List<Map<String, Object>> findSimilar(String procedureType, String procedureNameQuery, Long excludeId) {
        List<Surgery> all = surgeryRepository.findAll();
        String queryLower = procedureNameQuery == null ? "" : procedureNameQuery.toLowerCase(Locale.ROOT);

        List<Map<String, Object>> scored = new ArrayList<>();
        for (Surgery s : all) {
            if (excludeId != null && s.getId().equals(excludeId)) continue;

            int score = 0;
            if (procedureType != null && procedureType.equalsIgnoreCase(s.getProcedureType())) score += 3;
            if (!queryLower.isBlank() && s.getProcedureName() != null
                    && s.getProcedureName().toLowerCase(Locale.ROOT).contains(queryLower)) score += 2;
            if (score == 0) continue;

            Map<String, Object> entry = new HashMap<>();
            entry.put("surgeryId", s.getId());
            entry.put("procedureName", s.getProcedureName());
            entry.put("procedureType", s.getProcedureType());
            entry.put("status", s.getStatus());
            entry.put("similarityScore", score);
            entry.put("patientName", s.getPatient() != null ? s.getPatient().getFullName() : null);
            scored.add(entry);
        }

        return scored.stream()
                .sorted((a, b) -> Integer.compare((int) b.get("similarityScore"), (int) a.get("similarityScore")))
                .limit(10)
                .collect(Collectors.toList());
    }
}
