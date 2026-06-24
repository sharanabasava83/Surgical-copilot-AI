package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.KnowledgeArticle;
import com.surgicalcopilot.repository.KnowledgeArticleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/knowledge-articles")
public class KnowledgeArticleController {

    private final KnowledgeArticleRepository repository;

    public KnowledgeArticleController(KnowledgeArticleRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<KnowledgeArticle> getAll(@RequestParam(required = false) String search) {
        List<KnowledgeArticle> all = repository.findAll();
        if (search == null || search.isBlank()) return all;
        String q = search.toLowerCase(Locale.ROOT);
        return all.stream()
                .filter(a -> (a.getTitle() != null && a.getTitle().toLowerCase(Locale.ROOT).contains(q))
                        || (a.getTags() != null && a.getTags().toLowerCase(Locale.ROOT).contains(q))
                        || (a.getCategory() != null && a.getCategory().toLowerCase(Locale.ROOT).contains(q)))
                .toList();
    }
}
