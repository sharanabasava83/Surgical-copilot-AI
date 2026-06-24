package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.ModuleCatalog;
import com.surgicalcopilot.repository.ModuleCatalogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class ModuleCatalogController {

    private final ModuleCatalogRepository repository;

    public ModuleCatalogController(ModuleCatalogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ModuleCatalog> getAllModules() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @GetMapping("/{moduleKey}")
    public ModuleCatalog getModule(@PathVariable String moduleKey) {
        return repository.findByModuleKey(moduleKey);
    }
}
