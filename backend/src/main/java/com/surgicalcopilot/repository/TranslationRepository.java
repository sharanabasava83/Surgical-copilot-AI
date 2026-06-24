package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.Translation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TranslationRepository extends JpaRepository<Translation, Long> {
}
