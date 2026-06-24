package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, Long> {
}
