package com.surgicalcopilot.repository;

import com.surgicalcopilot.entity.CollaborationPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollaborationPostRepository extends JpaRepository<CollaborationPost, Long> {
    List<CollaborationPost> findByPostTypeOrderByCreatedAtDesc(String postType);
    List<CollaborationPost> findAllByOrderByCreatedAtDesc();
}
