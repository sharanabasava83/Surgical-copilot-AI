package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.ModuleCatalog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleCatalogRepository extends JpaRepository<ModuleCatalog, Long> {
    List<ModuleCatalog> findAllByOrderByDisplayOrderAsc();
    ModuleCatalog findByModuleKey(String moduleKey);
}
